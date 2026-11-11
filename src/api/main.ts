import {completeContract} from './openapi';
import 'reflect-metadata';
import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { hash,compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import helmet from 'helmet';
import { randomUUID } from 'node:crypto';
import { Auth } from '../application/features/auth';
import { Catalog } from '../application/features/catalog';
import { MongoStore } from '../infrastructure/mongo-store';
import { CatalogController } from './controller';
import { AccessGuard, Errors, correlation, env } from './common';
async function main(){
 const store=await MongoStore.connect(env('MONGO_URI')); env('INTERNAL_API_KEY');env('JWT_SECRET');
 if(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && !await store.userByEmail(process.env.ADMIN_EMAIL.toLowerCase())) {
  if(process.env.ADMIN_PASSWORD.length<12) throw new Error('ADMIN_PASSWORD must have at least 12 characters');
  await store.createUser({id:randomUUID(),name:'Administrador SmartPark',email:process.env.ADMIN_EMAIL.toLowerCase(),passwordHash:await hash(process.env.ADMIN_PASSWORD,12),role:'admin'});
 }
 const auth=new Auth(store,{hash:(s)=>hash(s,12),compare},{sign:(u)=>sign({role:u.role},env('JWT_SECRET'),{subject:u.id,expiresIn:'2h',issuer:'smartpark',audience:'smartpark-api',algorithm:'HS256'})});
 @Module({controllers:[CatalogController],providers:[{provide:'AUTH',useValue:auth},{provide:'CATALOG',useValue:new Catalog(store)}]}) class App{}
 const app=await NestFactory.create(App);app.use(helmet());app.use(correlation);app.useGlobalGuards(new AccessGuard());app.useGlobalFilters(new Errors());
 const doc=SwaggerModule.createDocument(app,new DocumentBuilder().setTitle('SmartPark — Catálogo').setVersion('1.0').addBearerAuth().addServer('/catalog').build());SwaggerModule.setup('docs',app,completeContract(doc,'catalog'));
 await app.listen(Number(process.env.PORT||3001),'0.0.0.0');
}
main().catch(e=>{console.error(e.name,e.message);process.exit(1);});
