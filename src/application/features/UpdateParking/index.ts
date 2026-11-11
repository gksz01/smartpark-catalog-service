import { randomUUID } from 'node:crypto';
import { CatalogStore } from '../../ports';
import { Actor, DomainError, own, requireAdmin } from '../../../domain/errors';
import { Parking, Vehicle } from '../../../domain/models';
import {GetParking} from '../GetParking';
export class UpdateParking{
 constructor(private store:CatalogStore){}
 async execute(actor:Actor,id:string,input:Omit<Parking,'id'>){requireAdmin(actor);await new GetParking(this.store).execute(id);const p={...input,id};await this.store.saveParking(p);return p;}
}
