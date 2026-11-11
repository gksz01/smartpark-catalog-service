import { MongoClient, Db } from 'mongodb';
import { CatalogStore } from '../application/ports';
import { User, Parking, Vehicle } from '../domain/models';
import { DomainError } from '../domain/errors';
export class MongoStore implements CatalogStore {
 constructor(private db:Db){}
 static async connect(uri:string){const client=new MongoClient(uri,{maxPoolSize:5,serverSelectionTimeoutMS:10000});await client.connect();const store=new MongoStore(client.db('smartpark_catalog'));await store.db.collection('users').createIndex({email:1},{unique:true});await store.db.collection('users').createIndex({id:1},{unique:true});await store.db.collection('parkings').createIndex({id:1},{unique:true});await store.db.collection('vehicles').createIndex({id:1},{unique:true});await store.db.collection('vehicles').createIndex({userId:1,plate:1},{unique:true});return store;}
 async userByEmail(email:string){return await this.db.collection<User>('users').findOne({email},{projection:{_id:0}});}
 async createUser(user:User){try{await this.db.collection<User>('users').insertOne(user);}catch(e:any){if(e.code===11000)throw new DomainError(409,'E-mail já cadastrado.');throw e;}}
 async parkings(){return this.db.collection<Parking>('parkings').find({},{projection:{_id:0}}).sort({name:1}).limit(200).toArray();}
 async parking(id:string){return this.db.collection<Parking>('parkings').findOne({id},{projection:{_id:0}});}
 async saveParking(p:Parking){await this.db.collection<Parking>('parkings').replaceOne({id:p.id},p,{upsert:true});}
 async vehicles(userId:string){return this.db.collection<Vehicle>('vehicles').find({userId},{projection:{_id:0}}).limit(100).toArray();}
 async vehicle(id:string){return this.db.collection<Vehicle>('vehicles').findOne({id},{projection:{_id:0}});}
 async saveVehicle(v:Vehicle){try{await this.db.collection<Vehicle>('vehicles').replaceOne({id:v.id},v,{upsert:true});}catch(e:any){if(e.code===11000)throw new DomainError(409,'Placa já cadastrada.');throw e;}}
 async deleteVehicle(id:string){await this.db.collection('vehicles').deleteOne({id});}
}
