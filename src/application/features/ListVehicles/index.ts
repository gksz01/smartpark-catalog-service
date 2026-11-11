import { randomUUID } from 'node:crypto';
import { CatalogStore } from '../../ports';
import { Actor, DomainError, own, requireAdmin } from '../../../domain/errors';
import { Parking, Vehicle } from '../../../domain/models';
export class ListVehicles{
 constructor(private store:CatalogStore){}
 async execute(actor:Actor){return this.store.vehicles(actor.sub);}
}
