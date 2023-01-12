import {IdentityMap , Identity , ID , FunctionalIdentity } from './model/identity'
import {Application} from './application/application'

const trace_events = require('trace_events');
const t1 = trace_events.createTracing({ categories: ['node.async_hooks'] });
t1.enable();
function main(){
	
	let newBase={id:1 , name:'record' , number:56.56};
	console.log('main');
	const fi = new FunctionalIdentity();
	let base = new Identity<any>();
	let idmap = new IdentityMap<any>(newBase);
	let proxy = new Proxy(fi, idmap);
	console.log(proxy);
	console.log(base);
	console.log(idmap);
	let app = new Application();
	console.log('app started');
	debugger;
}




main();

export default main;
