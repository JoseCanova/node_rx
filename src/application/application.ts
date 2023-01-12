import {IdentityMap , Identity , IdentityNewType  , ID , FunctionalIdentity , asFunctionalInterface } from '../model/identity'
import { baseRequestService } from '../service/first_service';
import { METHODS } from 'http';
export const bodyParser = require('body-parser')
export const express = require('express')
export const Router = require('express/lib/router/index')
export const async = require('async')
const { Client , Result
 } = require('pg')


export const app = express();
export const router = Router();
export const as = async;

var parse = require('pg-connection-string').parse;

var config = parse('postgres://postgres:123@localhost:5432/postgres');
 
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
		this.async=as;
		this.proxy.listen(3000);
	}
	
	prepare(){
		this.pathMap.set('/hello' , baseRequestService);
		this.proxy.use(bodyParser.json());
		this.proxy.all('/*',  this.handleRequest(baseRequestService));
		const mt = new MethodHandler<any>();
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

class MethodHandler<T extends any> extends Map<key , Function>implements IdentityNewType<any,any>{
	
	constructor(){
		super();
		const met = METHODS;
		met.forEach(method => {
			this.set(method , baseRequestService);
		});
		
	}
}

export default Application;