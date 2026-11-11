import { randomUUID } from 'node:crypto';
import { CatalogStore } from '../../ports';
import { Actor, DomainError, own, requireAdmin } from '../../../domain/errors';
import { Parking, Vehicle } from '../../../domain/models';
import {GetVehicle} from '../GetVehicle';
export class SaveVehicle{
 constructor(private store:CatalogStore){}
 async execute(actor:Actor,input:Pick<Vehicle,'plate'|'model'>,id?:string){const existing=id?await new GetVehicle(this.store).execute(actor,id):undefined;const v={...input,id:id||randomUUID(),userId:existing?.userId||actor.sub};await this.store.saveVehicle(v);return v;}
}
