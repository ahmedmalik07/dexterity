const{ipcMain,screen}=require('electron');
const{toScreenPoint}=require('./core.cjs');
function createCoach({main,coach,pointer,native,broadcast,busy,hidePointer,startListening}){
 let lesson=null,pointerTimer,continuingGoal=null;
 function position(){const p=screen.getCursorScreenPoint(),area=screen.getDisplayNearestPoint(p).workArea;coach.setPosition(Math.max(area.x,Math.min(p.x+60,area.x+area.width-340)),Math.max(area.y,Math.min(p.y+30,area.y+area.height-310)));}
 function show(data){position();coach.webContents.send('coach:update',data);coach.showInactive();}
 async function point(){
  if(busy())throw new Error('Wait until the current step finishes.');
  if(!lesson?.target||Date.now()-lesson.timestamp>60000)throw new Error('Read the screen again to get a fresh click marker.');
  const{context,target}=lesson;
  if(context.windowId){const fresh=await native.request('focus',{windowId:context.windowId,title:context.title});if(JSON.stringify(fresh.bounds)!==JSON.stringify(context.bounds))throw new Error('The app moved or changed size. Read the screen again.');}
  const p=toScreenPoint({x:target.x,y:target.y},context.captureBounds);if(!p)throw new Error('No reliable target available. Read the screen again.');
  const area=screen.getDisplayNearestPoint(p).bounds,left=Math.max(area.x,Math.min(p.x-30,area.x+area.width-240)),top=Math.max(area.y,Math.min(p.y-30,area.y+area.height-110));
  hidePointer();clearTimeout(pointerTimer);main.hide();pointer.setPosition(left,top);pointer.webContents.send('point:data',{x:p.x-left,y:p.y-top,title:target.label});pointer.showInactive();pointerTimer=setTimeout(()=>pointer.hide(),12000);return true;
 }
 ipcMain.handle('coach:point',point);
 ipcMain.handle('coach:next',()=>{if(busy())throw new Error('Wait for the current step.');if(!lesson||lesson.mode!=='teach')throw new Error('Start a lesson first.');continuingGoal=lesson.rootGoal;broadcast({type:'task-quick',goal:'Continue this lesson: '+lesson.rootGoal.slice(0,2000)+'\nI have done the previous step. Read my current screen, check progress, and teach me ONE next step.',mode:'teach',companion:true,windowId:lesson.context?.windowId||'',remembered:true});});
 ipcMain.handle('coach:hide',()=>{coach.hide();hidePointer();clearTimeout(pointerTimer);});
 ipcMain.handle('coach:listen',()=>startListening());
 return{
  progress(event,run){if(run?.companion&&['task-start','task-progress','task-role'].includes(event.type)){if(event.type==='task-start'){lesson=null;main.hide();show({busy:true,answer:'Reading your request…'});}else coach.webContents.send('coach:update',{busy:true,answer:event.message||'Thinking…'});}},
  finish(run,result){const ready=['done','ask'].includes(result.status);lesson={rootGoal:continuingGoal||run.goal,mode:run.mode,context:run.observation,target:ready?run.lastDecision?.target:null,timestamp:run.observation?.capturedAt||Date.now()};continuingGoal=null;broadcast({type:'guide-ready',available:!!lesson.target});if(run.companion){main.hide();show({answer:result.answer,busy:false,teach:run.mode==='teach'&&ready,target:lesson.target,provider:run.lastDecision?.provider,status:result.status});if(lesson.target)point().catch(error=>coach.webContents.send('coach:notice',error.message));}else main.show();},
  hide(){coach.hide();},dispose(){clearTimeout(pointerTimer);}
 };
}
module.exports={createCoach};
