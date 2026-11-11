export type User = { id:string; name:string; email:string; passwordHash:string; role:'driver'|'admin' };
export type Parking = { id:string; name:string; address:string; description:string; active:boolean };
export type Vehicle = { id:string; userId:string; plate:string; model:string };
