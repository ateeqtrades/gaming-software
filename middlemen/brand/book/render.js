const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const shots=[['hero',1800,1800],['front',1600,1200],['top',1400,1400],['low',1400,1800],['bone',1400,1400],['graphite',1400,1400],['between',2400,1200],['m-chrome',800,800],['m-satin',800,800],['m-bone',800,800],['m-graphite',800,800],['pillar',800,1200]];
const only=process.argv[2];
for(const [s,w,h] of shots){ if(only&&!only.split(',').includes(s))continue;
const p=await b.newPage({viewport:{width:w,height:h}});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto(`http://localhost:4320/brand/book/render3d.html?shot=${s}&w=${w}&h=${h}`);
await p.waitForFunction(()=>window.__done,null,{timeout:120000}).catch(e=>errs.push('timeout'));
await p.screenshot({path:`/home/user/gaming-software/middlemen/brand/book/renders/${s}.png`,omitBackground:true});
console.log(s,errs.join('|'));await p.close();}
await b.close()})();
