import { randomUUID } from 'node:crypto';
import { CatalogStore } from '../../ports';
import { Actor, DomainError, own, requireAdmin } from '../../../domain/errors';
import { Parking, Vehicle } from '../../../domain/models';
export class GetParking{
 constructor(private store:CatalogStore){}
 async execute(id:string){const p=await this.store.parking(id); if(!p) throw new DomainError(404,'Estacionamento não encontrado.'); return p;}
}
