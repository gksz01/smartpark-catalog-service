import { randomUUID } from 'node:crypto';
import { CatalogStore, Passwords, Tokens } from '../ports';
import { DomainError } from '../../domain/errors';
export class Auth {
 constructor(private store:CatalogStore,private passwords:Passwords,private tokens:Tokens){}
 async register(input:{name:string;email:string;password:string}) {
  const email=input.email.toLowerCase();
  if(await this.store.userByEmail(email)) throw new DomainError(409,'E-mail já cadastrado.');
  const user={id:randomUUID(),name:input.name,email,passwordHash:await this.passwords.hash(input.password),role:'driver' as const};
  await this.store.createUser(user); return this.result(user);
 }
 async login(input:{email:string;password:string}) {
  const user=await this.store.userByEmail(input.email.toLowerCase());
  if(!user || !await this.passwords.compare(input.password,user.passwordHash)) throw new DomainError(401,'E-mail ou senha inválidos.');
  return this.result(user);
 }
 private result(user:any){return {token:this.tokens.sign(user),user:{id:user.id,name:user.name,email:user.email,role:user.role}};}
}
