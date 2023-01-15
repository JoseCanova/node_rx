import {IdentityMap , Identity , IdentityNewType  , ID , FunctionalIdentity , asFunctionalInterface } from '../model/identity'
import { baseRequestService } from '../service/first_service';
import { baseRequestNeoAsyncService } from '../service/first_neo_service';

import { METHODS } from 'http';
export const bodyParser = require('body-parser')
export const express = require('express')
export const Router = require('express/lib/router/index')
const { Client , Result
 } = require('pg')


export const app = express();
export const router = Router();

 
const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '123',
})

export class Application extends Identity<any> {
	
	app:any;
	router:any;
	async:any;
	proxy:any;
	pathMap:Map<String , Function>;
	queue:any;
	cli:typeof client=client;
	constructor(){
		super();
		this.app=app;
		this.router=router;
		this.proxy=new Proxy(this.app,this);
		this.proxy.all('/', this.handleRequest());
		this.pathMap = new Map<String , Function> ();
		this.prepare();
		this.proxy.listen(3000);
	}
	
	prepare(){
		this.pathMap.set('/echo' , baseRequestService);
		this.proxy.use(bodyParser.json());
		this.proxy.all('/async*',  this.handleRequest(baseRequestService));
		this.proxy.all('/neo-async*',  this.handleRequest(baseRequestNeoAsyncService));
		debugger;		
	}
	
	apply(target: any, thisArg: any, argArray: any): void {
    	target.apply(thisArg,argArray);
	}
	
	handleRequest(this:any,service?:any):(req:any,res:any,next:any)=>Function{
		return  (req:any , res:any , next:any)=> {
						const memory = {request:req , response:res , next:next , this:this};
						let memorymap = new IdentityMap<any>(memory);
						return this.processRequest(memorymap , service);
					}
	}
	
	processRequest(idmap:IdentityMap<any>, service?:any){
		if (service){
				service(idmap);
			} else {
				const resp = idmap.get('response');
				resp.end();
			}
	}
	
}

export type key = string | number | symbol;

//todo : implemens filter method.
class MethodHandler extends Map<key , Function>implements IdentityNewType<any,any>{
	
	constructor(){
		super();
		const met = METHODS;
		met.forEach(method => {
			this.set(method , baseRequestService);
		});
		
	}
}

export default Application;