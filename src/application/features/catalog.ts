import { randomUUID } from 'node:crypto';
import { CatalogStore } from '../ports';
import { Actor, DomainError, own, requireAdmin } from '../../domain/errors';
import { Parking, Vehicle } from '../../domain/models';
export class Catalog {
 constructor(private store:CatalogStore){}
 async parkings(actor:Actor){return (await this.store.parkings()).filter(p=>actor.role==='admin'||p.active);}
 async parking(id:string){const p=await this.store.parking(id); if(!p) throw new DomainError(404,'Estacionamento não encontrado.'); return p;}
 async createParking(actor:Actor,input:Omit<Parking,'id'>){requireAdmin(actor);const p={...input,id:randomUUID()};await this.store.saveParking(p);return p;}
 async updateParking(actor:Actor,id:string,input:Omit<Parking,'id'>){requireAdmin(actor);await this.parking(id);const p={...input,id};await this.store.saveParking(p);return p;}
 async deleteParking(actor:Actor,id:string){requireAdmin(actor);const p=await this.parking(id);await this.store.saveParking({...p,active:false});return {deleted:true};}
 async vehicles(actor:Actor){return this.store.vehicles(actor.sub);}
 async vehicle(actor:Actor,id:string){const v=await this.store.vehicle(id);if(!v)throw new DomainError(404,'Veículo não encontrado.');own(actor,v.userId);return v;}
 async saveVehicle(actor:Actor,input:Pick<Vehicle,'plate'|'model'>,id?:string){if(id)await this.vehicle(actor,id);const v={...input,id:id||randomUUID(),userId:actor.sub};await this.store.saveVehicle(v);return v;}
 async deleteVehicle(actor:Actor,id:string){await this.vehicle(actor,id);await this.store.deleteVehicle(id);return {deleted:true};}
}
