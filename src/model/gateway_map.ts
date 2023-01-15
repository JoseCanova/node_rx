import {IdentityMap , ID} from './identity'
import { METHODS } from 'http';
//Method Base Handler.
class BaseGateway <T extends ID<T>>
extends IdentityMap<T>{
	
	constructor(k?:T){
		super(k || buildBaseServiceMethods());
	}
	
	public getMethodService(method:string){
		this.base.entries
	}
}


function buildBaseServiceMethods(): any {
    throw new Error('Function not implemented.');
}
