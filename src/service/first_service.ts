import {IdentityMap , Identity , ID , FunctionalIdentity , asFunctionalInterface} from '../model/identity';
import {Application} from '../application/application';
import {Request,Response} from 'express';
import * as async from 'async';
import { AsyncLocalStorage, AsyncResource } from 'node:async_hooks';
import {QueryResult} from 'pg'
import EventEmitter from 'node:events';
const { Client  , Result} = require('pg')
var parse = require('pg-connection-string').parse;
const kqueryresult=Symbol('kquery');
const kresponse=Symbol('response')
var config = parse('postgres://postgres:123@localhost:5432/postgres');
let asyncLocalStorage:AsyncLocalStorage<IdentityMap<any>> = new AsyncLocalStorage();
export async function baseRequestService(memoryMap:IdentityMap<any>){
	asyncLocalStorage.run(memoryMap , ()=>{
		var events:EventEmitter = new EventEmitter({captureRejections:true}); 
					async.waterfall(
						[
							function (callback:any){
								const req:Request  = memoryMap.get('request');
								memoryMap.base.set('headers' , req.headers);
								callback(null , req.body);
							},  new BaseFunction(),
								callback,
								pgFunc
							,
								function (body:any , callback:any ){
								events.on(kqueryresult , ()=>{
									const resp = asyncLocalStorage.getStore()?.get('response');
									asyncLocalStorage.getStore()?.base.set('body' , body);
									const store = asyncLocalStorage.getStore();
									const trans:any[] = store?.get('trans');
									const result:typeof Result= store?.get('result');
									trans.push(result?.rows[0]);
									resp.send(JSON.stringify(trans));
									events.emit(kresponse);
								});
								events.on(kresponse , ()=>{
									const resp = asyncLocalStorage.getStore()?.get('response');
									resp.end();
								});
								return true;
								}
						], function (err, result) {
								if (err)
									throw err;
							}
						);
						 function pgFunc(r:any , fn:any){
								const client = new Client({
									  host: 'localhost',
									  port: 5432,
									  user: 'postgres',
									  password: '123',
									});
								console.log('called pgfunc');
								client.connect();
									client.query('SELECT NOW()', (err:any, res:any) => {
											  if (err) throw err
											  console.log(res.rows);
											  const store = asyncLocalStorage.getStore();
											  store?.base.set('result' , res);
											  client.end()
											  events.emit(kqueryresult);
											})
											return fn(null,r);
							}
			});
}

export function callback(model:any,func?:any){
	let trans:any=[model];
	const store = asyncLocalStorage.getStore();
	store?.base.set('trans' , trans);
	return func(null, model);
}


export class BaseFunction extends Function {
	
	constructor(args?:Array<string>, callback?:string){
		const theArgs = args || ['r' , 'callback']
		super( theArgs.join(',') ,  callback || BaseFunction.func());
	}
	
	static func():string{
		return `
				return callback(null,r);
		
		`;
		
	}
}