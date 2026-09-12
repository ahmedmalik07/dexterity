const{_electron:electron}=require('@playwright/test');const path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const env={...process.env,DEXTERITY_TEST:'1'};delete env.ELECTRON_RUN_AS_NODE;
 const desktop=await electron.launch({args:['.','--use-fake-device-for-media-stream','--use-file-for-fake-audio-capture='+path.resolve('test-results/speech.wav')],env});
 try{
  await desktop.firstWindow();let page,listener;
  for(let i=0;i<100;i++){page=desktop.windows().find(p=>p.url().endsWith('/index.html'));listener=desktop.windows().find(p=>p.url().endsWith('/listening.html'));if(page&&listener)break;await new Promise(r=>setTimeout(r,100));}
  await page.waitForFunction(()=>typeof prefs!=='undefined'&&prefs);
  await page.evaluate(async()=>{prefs=await api.saveSettings({...prefs,voice:false,geminiKey:'test-only'});syncSettings();document.getElementById('task-screen').checked=false;});
  await desktop.evaluate(()=>{globalThis.voiceRequests=0;globalThis.answerRequests=0;globalThis.fetch=async(url,o)=>{const body=JSON.parse(o.body);let result;if(body.contents[0].parts.some(p=>p.inline_data?.mime_type==='audio/webm')){globalThis.voiceRequests++;result={text:'What does ubiquitous mean?'};}else{globalThis.answerRequests++;const input=JSON.parse(body.contents[0].parts[0].text);if(input.goal!=='What does ubiquitous mean?'||input.mode!=='answer')throw new Error('Transcript did not reach task flow');result={answer:'Ubiquitous means found everywhere.',status:'done',action:{type:'none',targetId:'',value:''}};}return{ok:true,json:async()=>({candidates:[{finishReason:'STOP',content:{parts:[{text:JSON.stringify(result)}]}}]})};};});
  await page.evaluate(()=>api.listen());await listener.waitForFunction(()=>recording?.recorder?.state==='recording');await new Promise(r=>setTimeout(r,1200));await page.evaluate(()=>api.finishListening());
  await page.getByText('Ubiquitous means found everywhere.',{exact:true}).waitFor({timeout:25000});await page.waitForFunction(()=>!taskRunning);
  assert.deepEqual(await desktop.evaluate(()=>[globalThis.voiceRequests,globalThis.answerRequests]),[1,1]);
  console.log('PASS: call microphone → transcript → automatic task → useful answer, without a manual Capture or Ask step.');
 }finally{await desktop.close();}
})().catch(e=>{console.error(e);process.exit(1);});
