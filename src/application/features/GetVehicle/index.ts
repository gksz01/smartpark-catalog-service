import { randomUUID } from 'node:crypto';
import { CatalogStore } from '../../ports';
import { Actor, DomainError, own, requireAdmin } from '../../../domain/errors';
import { Parking, Vehicle } from '../../../domain/models';
export class GetVehicle{
 constructor(private store:CatalogStore){}
 async execute(actor:Actor,id:string){const v=await this.store.vehicle(id);if(!v)throw new DomainError(404,'Veículo não encontrado.');own(actor,v.userId);return v;}
}
