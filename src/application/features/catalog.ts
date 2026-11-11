import { randomUUID } from 'node:crypto';
import { CatalogStore } from '../ports';
import { Actor, DomainError, own, requireAdmin } from '../../domain/errors';
import { Parking, Vehicle } from '../../domain/models';
import {ListParkings} from './ListParkings';
import {GetParking} from './GetParking';
import {CreateParking} from './CreateParking';
import {UpdateParking} from './UpdateParking';
import {DeleteParking} from './DeleteParking';
import {ListVehicles} from './ListVehicles';
import {GetVehicle} from './GetVehicle';
import {SaveVehicle} from './SaveVehicle';
import {DeleteVehicle} from './DeleteVehicle';

/** Composition facade; business logic lives in individual feature slices. */
export class Catalog{
 constructor(private store:CatalogStore){}
 parkings(actor:Actor){return new ListParkings(this.store).execute(actor);}
 parking(id:string){return new GetParking(this.store).execute(id);}
 createParking(actor:Actor,input:Omit<Parking,'id'>){return new CreateParking(this.store).execute(actor,input);}
 updateParking(actor:Actor,id:string,input:Omit<Parking,'id'>){return new UpdateParking(this.store).execute(actor,id,input);}
 deleteParking(actor:Actor,id:string){return new DeleteParking(this.store).execute(actor,id);}
 vehicles(actor:Actor){return new ListVehicles(this.store).execute(actor);}
 vehicle(actor:Actor,id:string){return new GetVehicle(this.store).execute(actor,id);}
 saveVehicle(actor:Actor,input:Pick<Vehicle,'plate'|'model'>,id?:string){return new SaveVehicle(this.store).execute(actor,input,id);}
 deleteVehicle(actor:Actor,id:string){return new DeleteVehicle(this.store).execute(actor,id);}
}
