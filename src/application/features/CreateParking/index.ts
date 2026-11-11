import { randomUUID } from 'node:crypto';
import { CatalogStore } from '../../ports';
import { Actor, DomainError, own, requireAdmin } from '../../../domain/errors';
import { Parking, Vehicle } from '../../../domain/models';
export class CreateParking{
 constructor(private store:CatalogStore){}
 async execute(actor:Actor,input:Omit<Parking,'id'>){requireAdmin(actor);const p={...input,id:randomUUID()};await this.store.saveParking(p);return p;}
}
