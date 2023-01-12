import { get } from "https";

export interface  ID<T extends ID<T>>{
}

export interface  IID<T extends IID<T , R> , R>{
	 new (...args: R[]):(...args: R[]) => T ;
}

export interface IdType<T>{
	(k:T):()=>T;
}

type IDConstructor<T extends abstract new (...args: any) => any> = T extends abstract new (...args: infer P) => any ? P : never; //new Array Object

type InstanceType<T extends  new (...args: any) => any> = T extends  new (...args: any) => infer R ? R : any; //new Object constructor.

export type IdentityNewType<T extends R ,R extends ID<R>> = (T extends  new (...args: R[]) => infer T ? T : any ) & IdType<T>;

export type ArrayType <T extends ID<T>>= Array<Record<keyof T,T[keyof T]>>;

export type MapType <T extends ID<T>>= Map<keyof T,T[keyof T]>;

export class IdentityHandler<T extends ID<T>>   implements ProxyHandler<T> {
    constructor(){
	}
    setPrototypeOf?(target: any, v: object | null): boolean {
        return Object.setPrototypeOf(target,v);
    }
    preventExtensions?(target: any): boolean {
        throw new Error("preventExtensions not implemented.");
    }
    ownKeys?(target: any): ArrayLike<string | symbol> {
        return target.ownKeys;
    }
    isExtensible?(target: any): boolean {
		return Object.isExtensible(target);
    }
    getPrototypeOf?(target: any): object | null {
		return Object.getPrototypeOf(target);
    }
    getOwnPropertyDescriptor?(target: any, p: string | symbol): PropertyDescriptor | undefined {
        return Object.getOwnPropertyDescriptor(target, p);
    }
    deleteProperty?(target: any, p: string | symbol): boolean {
        throw new Error("deleteProperty not implemented.");
    }
    defineProperty?(target: any, property: string | symbol, attributes: PropertyDescriptor): boolean {
       return  Object.defineProperty(target , property , attributes);
    }
    construct?(target: any, argArray: any[], newTarget: Function): object {
        throw new Error("construct not implemented.");
    }
    apply?(target: any, thisArg: any, argArray: any[any]) {
		target.apply(thisArg , argArray);
    }
}

export type IDHandlerType<T extends ID<T>> =  IdentityNewType<ID<any> ,ID<any>>  & ID<T>;

export class IdentityHandlerType <T extends ID<T>> extends  IdentityHandler<T> implements  IDHandlerType<T>{
	
	constructor(){
		super();
	}
	
}

export function asFunctionalInterface<T extends ID<T>>(r:any):()=>T{
	return (r);
}

export class Identity<T extends ID<T>> extends IdentityHandlerType<T> {
	identity:Function;
	constructor(){
		super();
		this.identity=asFunctionalInterface;
		return this;
	}
}

export class IdentityMap<T extends any> 
extends Identity<(x:keyof T)=>{key:keyof T , value:T[keyof T]}>
{
	base:Map<keyof T , T[keyof T]>
	constructor(k:T){
		super();
		this.base=new Map<keyof T , T[keyof T]>();
		for(const index in k){
			this.base.set(index, k[index]);
		}
		return this;
	}
	
	keys(){
		return this.base.keys();
	}
	
	get(k:keyof T){
		return this.base.get(k);
	}
}


export class FunctionalIdentity extends Function implements  IdentityNewType<ID<any>,ID<any>>{

	constructor(){
		super('r' , 		`
			return (r);
		`
		);
	}
	
	apply(this: Function, thisArg: any, argArray?: any) {
		console.log('apply');
    	return thisArg;
	}
	
	
	
}
