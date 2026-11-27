const {JSDOM,VirtualConsole}=require('jsdom');const fs=require('fs');
const html=fs.readFileSync('/home/claude/mk/index.html','utf8');
const vc=new VirtualConsole();
const dom=new JSDOM(html,{url:'https://imran9848.github.io/mk-day-app/',runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc});
const w=dom.window;const E=s=>w.eval(s);
let pass=0,fail=0;const log=[];
function ok(name,cond,extra){if(cond){pass++;log.push('PASS  '+name)}else{fail++;log.push('FAIL  '+name+'  '+(extra||''))}}
function near(a,b){return Math.abs(a-b)<0.011}
setTimeout(()=>{
E(`window.__toasts=[];window.__ans=[];toast=m=>window.__toasts.push(String(m));save=()=>{};R=()=>{};
ask=(t,f,okcb)=>{const a=window.__ans.shift();if(!a)throw new Error('no answer for '+t);okcb(typeof a==='function'?a(f):a)};
yn=(t,okcb)=>{window.__yn=okcb};`);
const reset=()=>{E(`D.tx=[];D.biz={products:[{id:1,n:'পণ্য',qty:0,cost:0,price:0,unit:'পিস',packages:[]}],customers:[],sales:[],purchases:[],returns:[],payments:[]};window.__toasts=[];window.__ans=[];ensureBiz()`)};
const P=()=>JSON.parse(E(`JSON.stringify(D.biz.products[0])`));
const B=()=>JSON.parse(E(`JSON.stringify(D.biz)`));
const buy=(q,amt)=>{E(`window.__ans=[{p:'1'},{unit:'base'},{q:'${q}',amt:'${amt}',note:''}];bizStock('purchase')`)};
const sell=(q,amt)=>{E(`window.__ans=[{p:'1'},{unit:'base'},{q:'${q}',amt:'${amt}',note:''},{c:'',paid:'${amt}'}];bizStock('sale')`)};
const toasts=()=>E(`window.__toasts.slice()`);

// T1
reset();buy(2000,60000);buy(3000,120000);let p=P();
ok('T1 দুই ক্রয়ের পর স্টক ৫০০০',p.qty===5000,p.qty);ok('T1 গড় দাম ৳৩৬',near(p.cost,36),p.cost);
// T2 delete 2nd purchase
let b=B();let id2=b.purchases[1].id;E(`bizDeleteEntry('purchase',${id2})`);E(`window.__yn()`);p=P();
ok('T2 দ্বিতীয় ক্রয় মুছলে স্টক ২০০০',p.qty===2000,p.qty);ok('T2 গড় দাম ৳৩০',near(p.cost,30),p.cost);
// T3 sale between purchases (P1,S,P2) -> delete P2
reset();buy(2000,60000);sell(1000,50000);buy(3000,120000);b=B();p=P();
ok('T3 ক্রম P1,বিক্রি,P2: স্টক ৪০০০',p.qty===4000,p.qty);
ok('T3 বিক্রির costAtSale ৳৩০, লাভ ২০০০০ (মাঝের বিক্রি)',near(b.sales[0].profit,20000),b.sales[0].profit);
ok('T3 এখনকার গড় = (১০০০×৩০+৩০০০×৪০)/৪০০০ = ৩৭.৫',near(p.cost,37.5),p.cost);
E(`bizDeleteEntry('purchase',${b.purchases[1].id})`);E(`window.__yn()`);b=B();p=P();
ok('T3 P2 মুছার পর স্টক ১০০০, গড় ৩০',p.qty===1000&&near(p.cost,30),p.qty+' '+p.cost);
ok('T3 বিক্রির লাভ ২০০০০ থাকল',near(b.sales[0].profit,20000),b.sales[0].profit);
E(`window.__toasts=[]`);E(`bizDeleteEntry('purchase',${b.purchases[0].id})`);E(`window.__yn()`);b=B();p=P();
ok('T3 P1 মুছলে বিক্রি ঘাটতিতে পড়ে → Delete ব্লক',b.purchases.length===1&&p.qty===1000,JSON.stringify(toasts()));
ok('T3 ব্লক বার্তায় "ঘাটতিতে পড়বে" ও "আগে ওই বিক্রি ঠিক করুন"',toasts().some(t=>t.includes('ঘাটতিতে পড়বে')&&t.includes('আগে ওই বিক্রি ঠিক করুন')),JSON.stringify(toasts()));
// T4 profit recalculation: P1,P2,S after both
reset();buy(2000,60000);buy(3000,120000);sell(1000,50000);b=B();
ok('T4 পরের বিক্রি costAtSale ৳৩৬ → লাভ ১৪০০০',near(b.sales[0].profit,14000),b.sales[0].profit);
E(`bizDeleteEntry('purchase',${b.purchases[1].id})`);E(`window.__yn()`);b=B();p=P();
ok('T4 P2 মুছার পর (বিক্রি ঘাটতিতে পড়ে না): স্টক ১০০০',p.qty===1000,p.qty+' '+JSON.stringify(toasts()));
ok('T4 বিক্রির লাভ নতুন গড় ৩০ দামে ২০০০০ হলো',near(b.sales[0].profit,20000),b.sales[0].profit);
// T5 negative block
reset();buy(2000,60000);buy(3000,120000);sell(4000,200000);b=B();E(`window.__toasts=[]`);
E(`bizDeleteEntry('purchase',${b.purchases[1].id})`);E(`window.__yn()`);b=B();p=P();
ok('T5 মুছলে স্টক ঋণাত্মক হয় → Delete ব্লক, কিছু বদলায়নি',b.purchases.length===2&&p.qty===1000&&near(p.cost,36),p.qty+' '+p.cost+JSON.stringify(toasts()));
// T6 returns
reset();buy(2000,60000);buy(3000,120000);sell(1000,50000);
E(`window.__ans=[a=>({src:a[0].o[0].v}),{u:'base'},{q:'200'}];bizReturn('sale')`);b=B();p=P();
ok('T6 বিক্রি ফেরত ২০০: স্টক ৪২০০',p.qty===4200,p.qty+JSON.stringify(toasts()));
ok('T6 ফেরতের cost = ২০০×৩৬ = ৭২০০',near(b.returns[0].cost,7200),b.returns[0].cost);
ok('T6 ফেরতের পর গড় ৳৩৬',near(p.cost,36),p.cost);
E(`window.__ans=[a=>({src:a[0].o[0].v}),{u:'base'},{q:'500'}];bizReturn('purchase')`);p=P();
ok('T6 ক্রয় ফেরত ৫০০ (প্রথম ক্রয়ের ৩০ দামে): স্টক ৩৭০০',p.qty===3700,p.qty+JSON.stringify(toasts()));
// T7 backdated purchase
reset();E(`D.biz.products[0].base=null`);
E(`(()=>{const b=ensureBiz(),p=b.products[0];bizJAdd(b,p,'purchases',{id:11,pid:1,q:2000,amt:60000,d:100});bizJAdd(b,p,'sales',{id:12,pid:1,q:1000,amt:50000,d:200,cost:0,profit:0});})()`);
b=B();ok('T7 শুরুতে বিক্রি ৳৩০ → লাভ ২০০০০',near(b.sales[0].profit,20000),b.sales[0].profit);
E(`(()=>{const b=ensureBiz(),p=b.products[0];const r=bizJAdd(b,p,'purchases',{id:10,pid:1,q:1000,amt:20000,d:50});window.__r=r.ok})()`);b=B();p=P();
ok('T7 পুরোনো তারিখে ক্রয় ঢুকলে Replay: স্টক ২০০০',p.qty===2000,p.qty);
ok('T7 গড় ২৬.৬৭, বিক্রির cost ২৬৬৭০, লাভ ২৩৩৩০',near(p.cost,26.67)&&near(b.sales[0].cost,26670)&&near(b.sales[0].profit,23330),p.cost+' '+b.sales[0].cost+' '+b.sales[0].profit);
// T8 baseline legacy
reset();E(`(()=>{const b=ensureBiz(),p=b.products[0];p.qty=100;p.cost=10;b.purchases.push({id:5,pid:1,n:'পণ্য',q:50,amt:500,d:1})})()`);
buy(100,2000);p=P();
ok('T8 Baseline(১০০ পিস ৳১০) + নতুন ক্রয় ১০০×২০ → ২০০ পিস, গড় ১৫',p.qty===200&&near(p.cost,15),p.qty+' '+p.cost);
ok('T8 Baseline রেকর্ড আছে (id, তারিখ)',!!(p.base&&p.base.id&&p.base.at),JSON.stringify(p.base));
E(`bizDeleteEntry('purchase',5)`);E(`window.__yn()`);p=P();
ok('T8 পুরোনো (Baseline-এর আগের) ক্রয় মুছলে স্টক ১৫০',p.qty===150,p.qty+JSON.stringify(toasts()));
// T9 recalc after sync (tamper)
reset();buy(2000,60000);buy(3000,120000);E(`D.biz.products[0].qty=999;D.biz.products[0].cost=1`);E(`bizJRecalcAll()`);p=P();
ok('T9 সিঙ্ক/লোডের পর recalc: ভুল স্টক ঠিক হয় (৫০০০, ৩৬)',p.qty===5000&&near(p.cost,36),p.qty+' '+p.cost);
const snap=E(`JSON.stringify(D.biz)`);E('D.biz=JSON.parse('+JSON.stringify(snap)+');bizJRecalcAll()');p=P();
ok('T9 অন্য ডিভাইসের ডেটা লোড করে Replay একই ফল',p.qty===5000&&near(p.cost,36),p.qty+' '+p.cost);
// T10 double delete + tx revert
reset();buy(2000,60000);buy(3000,120000);b=B();const tx2=E(`D.tx[1].id`);
E(`delTx(${tx2})`);E(`const __cb=window.__yn;__cb();__cb();`);p=P();
ok('T10 লেনদেন দ্রুত দুইবার Delete: একবারই কাজ, স্টক ২০০০',p.qty===2000&&E(`D.tx.length`)===1,p.qty+' tx='+E(`D.tx.length`));
reset();buy(2000,60000);buy(3000,120000);b=B();E(`bizDeleteEntry('purchase',${b.purchases[1].id})`);E(`const __c=window.__yn;__c();__c();`);p=P();
ok('T10 ক্রয় এন্ট্রি দ্রুত দুইবার Delete: স্টক ২০০০',p.qty===2000&&B().purchases.length===1,p.qty);
// T11 delTx blocked
reset();buy(2000,60000);buy(3000,120000);sell(4000,200000);E(`window.__toasts=[]`);const tx3=E(`D.tx[1].id`);
E(`delTx(${tx3})`);E(`window.__yn()`);p=P();
ok('T11 লিংক করা ক্রয়-লেনদেন মুছলে ঘাটতি হলে ব্লক, লেনদেন থাকে',E(`D.tx.length`)===3&&p.qty===1000,E(`D.tx.length`)+' '+p.qty+JSON.stringify(toasts()));
// T12 edit purchase
reset();buy(2000,60000);buy(3000,120000);b=B();
E(`window.__ans=[{unit:'base'},{q:'2500',amt:'100000',note:''}];bizEditEntry('purchase',${b.purchases[1].id})`);p=P();
ok('T12 দ্বিতীয় ক্রয় এডিট ২৫০০×৪০ → ৪৫০০, গড় ৩৫.৫৬',p.qty===4500&&near(p.cost,35.56),p.qty+' '+p.cost+JSON.stringify(toasts()));
// T13 bizTxPost (form flow) through journal
reset();E(`txbLines=()=>[{p:D.biz.products[0],q:100,amt:2000}]`);
E(`(()=>{const id=Date.now();D.tx.push({id,t:'e',c:'ব্যবসা',s:'মাল ক্রয়',m:2000,n:'',d:id});bizTxPost(id,'e','ব্যবসা','মাল ক্রয়',2000,id,false,0);window.__txid=id})()`);
p=P();ok('T13 ফর্ম থেকে ক্রয় (bizTxPost): স্টক ১০০, গড় ২০',p.qty===100&&near(p.cost,20),p.qty+' '+p.cost);
E(`txbLines=()=>[{p:D.biz.products[0],q:30,amt:900}]`);
E(`(()=>{const id=Date.now()+5;D.tx.push({id,t:'i',c:'ব্যবসা',s:'x',m:900,n:'',d:id});bizTxPost(id,'i','ব্যবসা','x',900,id,false,0)})()`);b=B();p=P();
ok('T13 ফর্ম থেকে বিক্রি ৩০: স্টক ৭০, লাভ ৩০০',p.qty===70&&near(b.sales[0].profit,300),p.qty+' '+b.sales[0].profit);
console.log(log.join('\n'));console.log('\nপাশ:',pass,' ব্যর্থ:',fail);process.exit(fail?1:0)},1500);
process.on('uncaughtException',e=>{console.log(log.join('\n'));console.log('CRASH',e.message.slice(0,200));process.exit(2)});
