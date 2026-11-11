import { randomUUID } from 'node:crypto';
import { CatalogStore } from '../../ports';
import { Actor, DomainError, own, requireAdmin } from '../../../domain/errors';
import { Parking, Vehicle } from '../../../domain/models';
import {GetParking} from '../GetParking';
export class DeleteParking{
 constructor(private store:CatalogStore){}
 async execute(actor:Actor,id:string){requireAdmin(actor);const p=await new GetParking(this.store).execute(id);await this.store.saveParking({...p,active:false});return {deleted:true};}
}
