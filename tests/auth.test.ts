import {it,expect,vi} from 'vitest';
import {Auth} from '../src/application/features/auth';
import {Catalog} from '../src/application/features/catalog';
it('cadastro sempre cria motorista e não retorna hash',async()=>{const createUser=vi.fn();const auth=new Auth({userByEmail:async()=>null,createUser} as any,{hash:async()=> 'HASH',compare:async()=>true},{sign:()=> 'JWT'});const result=await auth.register({name:'Teste',email:'TESTE@EXAMPLE.COM',password:'12345678'});expect(createUser.mock.calls[0][0]).toMatchObject({email:'teste@example.com',passwordHash:'HASH',role:'driver'});expect(result.user).not.toHaveProperty('passwordHash');});
it('login inválido não emite token',async()=>{const sign=vi.fn();const auth=new Auth({userByEmail:async()=>null} as any,{hash:async()=>'',compare:async()=>false},{sign});await expect(auth.login({email:'a@a.com',password:'12345678'})).rejects.toMatchObject({status:401});expect(sign).not.toHaveBeenCalled();});
it('motorista não altera catálogo',async()=>{await expect(new Catalog({} as any).createParking({sub:'a',role:'driver'},{name:'A',address:'B',description:'',active:true})).rejects.toMatchObject({status:403});});
it('veículo de outro motorista permanece inacessível',async()=>{const catalog=new Catalog({vehicle:async()=>({userId:'outro'})} as any);await expect(catalog.vehicle({sub:'a',role:'driver'},'id')).rejects.toMatchObject({status:404});});
