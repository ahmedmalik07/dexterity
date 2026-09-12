const{test}=require('node:test'),assert=require('node:assert/strict');
const{parseDecision,needsReview}=require('../electron/agent.cjs');
const{TaskRunner}=require('../electron/task-runner.cjs');
const context={controls:[{id:'name',name:'Full name',actions:['type']},{id:'send',name:'Submit registration',actions:['click']}],token:'snapshot'};
const decision=(type='none',targetId='',value='')=>({answer:'A useful answer',status:type==='none'?'done':'continue',action:{type,targetId,value}});
test('answer and teach never execute; actions must name a current supported control',()=>{
 assert.throws(()=>parseDecision(decision('click','send'),'answer',context),/only explains/);
 assert.throws(()=>parseDecision(decision('type','missing','x'),'do',context),/not available/);
 assert.throws(()=>parseDecision(decision('click','name'),'do',context),/not available/);
 assert.throws(()=>parseDecision(decision('open_url','','file:///secret'),'do',context),/http/);
 assert.ok(needsReview(decision('click','send').action,context));assert.ok(!needsReview(decision('type','name','Alex').action,context));
});
test('premature done with an action still requires execution and observation; ask does not execute',()=>{
 const premature=decision('type','name','Alex');premature.status='done';assert.equal(parseDecision(premature,'do',context).status,'continue');
 const ask=decision('click','send');ask.status='ask';assert.equal(parseDecision(ask,'do',context).action.type,'none');
});
test('teaching markers require a screenshot and finite normalized coordinates',()=>{
 const marker={...decision(),target:{x:.5,y:.3,label:'Click here'}};
 assert.equal(parseDecision(structuredClone(marker),'teach',context).target,null);
 assert.equal(parseDecision(structuredClone(marker),'answer',{...context,image:'image'}).target,null);
 assert.equal(parseDecision({...marker,target:{x:2,y:.3,label:'Invalid'}},'teach',{...context,image:'image'}).target,null);
 assert.equal(parseDecision(structuredClone(marker),'teach',{...context,image:'image'}).target.label,'Click here');
});
test('runner observes after actions and pauses exactly once for review',async()=>{
 const events=[];let calls=0,reads=0,actions=[];
 const runner=new TaskRunner({settings:()=>({}),read:async()=>{reads++;return context;},act:async(a,c,confirmed)=>actions.push({type:a.type,confirmed}),emit:e=>events.push(e),restore:()=>{},verifier:async()=>({complete:true}),planner:async()=>++calls===1?decision('type','name','Alex'):calls===2?decision('click','send'):decision()});
 const{id}=await runner.start({goal:'Fill and submit',mode:'do'});
 while(!runner.run?.review)await new Promise(r=>setTimeout(r,1));
 assert.equal(actions.length,1);assert.equal(reads,2);
 await runner.approve(id);while(runner.run)await new Promise(r=>setTimeout(r,1));
 assert.deepEqual(actions,[{type:'type',confirmed:false},{type:'click',confirmed:true}]);assert.equal(reads,3);assert.equal(events.at(-1).status,'done');
 await assert.rejects(()=>runner.approve(id),/expired/);
});
test('stop during planning prevents later execution',async()=>{
 let resolve;let acts=0;const runner=new TaskRunner({settings:()=>({}),read:async()=>context,act:async()=>acts++,emit:()=>{},restore:()=>{},planner:()=>new Promise(r=>resolve=r)});
 await runner.start({goal:'Type a name',mode:'do'});while(!resolve)await new Promise(r=>setTimeout(r,1));runner.stop();resolve(decision('type','name','Alex'));await new Promise(r=>setTimeout(r,5));assert.equal(acts,0);assert.equal(runner.run,null);
});
test('general questions require no screen read; follow-ups retain conversation',async()=>{
 let reads=0,history;
 const runner=new TaskRunner({settings:()=>({}),read:async()=>{reads++;return context;},act:async()=>{},emit:()=>{},restore:()=>{},planner:async(s,input)=>{history=input.history.slice();return decision();}});
 await runner.start({goal:'Define ubiquitous',mode:'answer',screen:false});while(runner.run)await new Promise(r=>setTimeout(r,1));
 await runner.start({goal:'Use it in a sentence',mode:'answer',screen:false});while(runner.run)await new Promise(r=>setTimeout(r,1));
 assert.equal(reads,0);assert.equal(history[0].goal,'Define ubiquitous');
});
test('failed completion verification continues the missing action instead of reporting done',async()=>{
 let plans=0,actions=0,verifications=0;const events=[];
 const runner=new TaskRunner({settings:()=>({}),read:async()=>context,act:async()=>actions++,emit:e=>events.push(e),restore:()=>{},planner:async()=>++plans===2?decision('type','name','Alex'):decision(),verifier:async()=>++verifications===1?{complete:false,reason:'Name is empty'}:{complete:true}});
 await runner.start({goal:'Fill the name',mode:'do'});while(runner.run)await new Promise(r=>setTimeout(r,1));
 assert.equal(actions,1);assert.equal(verifications,2);assert.equal(events.at(-1).status,'done');
});
test('team coordinates once across review and passes selected memories to operator and verifier',async()=>{
 let coordinates=0,plans=0,recorded;const selected=[{title:'About me',text:'Name: Alex'}];const runner=new TaskRunner({settings:()=>({}),memory:(goal,enabled)=>enabled?selected:[],read:async()=>context,act:async()=>{},emit:()=>{},restore:()=>{},record:(run,answer,status)=>recorded={run,status},coordinator:async(s,input)=>{coordinates++;assert.deepEqual(input.memories,selected);return{summary:'Fill',steps:['Fill name'],success:'Name is Alex'};},planner:async(s,input)=>{assert.deepEqual(input.memories,selected);assert.equal(input.taskPlan.success,'Name is Alex');return ++plans===1?decision('click','send'):decision();},verifier:async(s,input)=>{assert.deepEqual(input.memories,selected);return {complete:true};}});
 const{id}=await runner.start({goal:'Submit with my saved details',mode:'do'});while(!runner.run?.review)await new Promise(r=>setTimeout(r,1));await runner.approve(id);while(runner.run)await new Promise(r=>setTimeout(r,1));assert.equal(coordinates,1);assert.equal(recorded.status,'done');
});
