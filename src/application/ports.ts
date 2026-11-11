import { User, Parking, Vehicle } from '../domain/models';
export interface CatalogStore {
 userByEmail(email:string):Promise<User|null>;
 createUser(user:User):Promise<void>;
 parkings():Promise<Parking[]>;
 parking(id:string):Promise<Parking|null>;
 saveParking(parking:Parking):Promise<void>;
 vehicles(userId:string):Promise<Vehicle[]>;
 vehicle(id:string):Promise<Vehicle|null>;
 saveVehicle(vehicle:Vehicle):Promise<void>;
 deleteVehicle(id:string):Promise<void>;
}
export interface Passwords { hash(value:string):Promise<string>; compare(value:string,hash:string):Promise<boolean>; }
export interface Tokens { sign(user:User):string; }
