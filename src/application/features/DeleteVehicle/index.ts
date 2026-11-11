import { randomUUID } from 'node:crypto';
import { CatalogStore } from '../../ports';
import { Actor, DomainError, own, requireAdmin } from '../../../domain/errors';
import { Parking, Vehicle } from '../../../domain/models';
import {GetVehicle} from '../GetVehicle';
export class DeleteVehicle{
 constructor(private store:CatalogStore){}
 async execute(actor:Actor,id:string){await new GetVehicle(this.store).execute(actor,id);await this.store.deleteVehicle(id);return {deleted:true};}
}
