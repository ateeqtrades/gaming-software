const {chromium}=require('playwright');const path=require('path');(async()=>{const b=await chromium.launch();
for(const [h,o] of [['resume.html','Syed_Ahmad_Hassan_Resume_Binance.pdf'],['cover.html','Syed_Ahmad_Hassan_Cover_Letter_Binance.pdf']]){const p=await b.newPage({viewport:{width:794,height:1123}});await p.goto('file://'+path.join(__dirname,h),{waitUntil:'networkidle'});await p.pdf({path:path.join(__dirname,o),preferCSSPageSize:true,printBackground:true});
console.log(h,await p.evaluate(()=>document.body.scrollHeight));await p.screenshot({path:process.argv[2]+'/'+h+'.png',fullPage:true});}
await b.close()})()
