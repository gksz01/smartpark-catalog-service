import { randomUUID } from 'node:crypto';
import { CatalogStore } from '../../ports';
import { Actor, DomainError, own, requireAdmin } from '../../../domain/errors';
import { Parking, Vehicle } from '../../../domain/models';
export class ListParkings{
 constructor(private store:CatalogStore){}
 async execute(actor:Actor){return (await this.store.parkings()).filter(p=>actor.role==='admin'||p.active);}
}
