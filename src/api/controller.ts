import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { z } from 'zod';
import { Auth } from '../application/features/auth';
import { Catalog } from '../application/features/catalog';
import { actor } from './common';
const login=z.object({email:z.string().email().max(200),password:z.string().min(8).max(72)}).strict();
const parking=z.object({name:z.string().trim().min(2).max(100),address:z.string().trim().min(5).max(200),description:z.string().max(1000).default(''),active:z.boolean().default(true)}).strict();
const vehicle=z.object({plate:z.string().trim().toUpperCase().regex(/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/,'Use uma placa brasileira sem hífen.'),model:z.string().trim().min(2).max(100)}).strict();
const id=(v:string)=>z.string().uuid().parse(v);
@ApiTags('Catálogo e identidade') @ApiBearerAuth() @Controller()
export class CatalogController {
 constructor(@Inject('AUTH') private auth:Auth,@Inject('CATALOG') private catalog:Catalog){}
 @Get('health') health(){return {status:'ok',service:'catalog'};}
 @Post('auth/register') @ApiBody({schema:{type:'object',required:['name','email','password'],properties:{name:{type:'string'},email:{type:'string'},password:{type:'string',minLength:8}}}}) register(@Body() body:unknown){return this.auth.register(login.extend({name:z.string().trim().min(2).max(100)}).parse(body));}
 @Post('auth/login') @ApiBody({schema:{type:'object',required:['email','password'],properties:{email:{type:'string'},password:{type:'string'}}}}) login(@Body() body:unknown){return this.auth.login(login.parse(body));}
 @Get('parkings') list(@Req() req:any){return this.catalog.parkings(actor(req));}
 @Get('parkings/:id') get(@Param('id') v:string){return this.catalog.parking(id(v));}
 @Post('parkings') @ApiBody({schema:{type:'object',properties:{name:{type:'string'},address:{type:'string'},description:{type:'string'},active:{type:'boolean'}}}}) create(@Req() req:any,@Body() body:unknown){return this.catalog.createParking(actor(req),parking.parse(body));}
 @Put('parkings/:id') @ApiBody({schema:{type:'object',properties:{name:{type:'string'},address:{type:'string'},description:{type:'string'},active:{type:'boolean'}}}}) update(@Req() req:any,@Param('id') v:string,@Body() body:unknown){return this.catalog.updateParking(actor(req),id(v),parking.parse(body));}
 @Delete('parkings/:id') delete(@Req() req:any,@Param('id') v:string){return this.catalog.deleteParking(actor(req),id(v));}
 @Get('vehicles') vehicles(@Req() req:any){return this.catalog.vehicles(actor(req));}
 @Get('vehicles/:id') getVehicle(@Req() req:any,@Param('id') v:string){return this.catalog.vehicle(actor(req),id(v));}
 @Post('vehicles') @ApiBody({schema:{type:'object',properties:{plate:{type:'string'},model:{type:'string'}}}}) createVehicle(@Req() req:any,@Body() body:unknown){return this.catalog.saveVehicle(actor(req),vehicle.parse(body));}
 @Put('vehicles/:id') @ApiBody({schema:{type:'object',properties:{plate:{type:'string'},model:{type:'string'}}}}) updateVehicle(@Req() req:any,@Param('id') v:string,@Body() body:unknown){return this.catalog.saveVehicle(actor(req),vehicle.parse(body),id(v));}
 @Delete('vehicles/:id') deleteVehicle(@Req() req:any,@Param('id') v:string){return this.catalog.deleteVehicle(actor(req),id(v));}
}
