const api=window.dexterity,$=id=>document.getElementById(id);
const attempt=async fn=>{try{await fn();}catch(e){$('notice').textContent=e.message;}};
$('close').onclick=()=>api.hideCoach();$('point').onclick=()=>attempt(()=>api.pointLesson());$('next').onclick=()=>attempt(()=>api.nextLesson());$('talk').onclick=()=>attempt(()=>api.coachListen());$('stop').onclick=()=>api.stopTask();
api.onCoach(data=>{$('answer').textContent=data.answer;$('point').hidden=!data.target||data.busy;$('next').hidden=!data.teach||data.busy;$('stop').hidden=!data.busy;$('talk').hidden=!!data.busy;$('provider').textContent=data.busy?'Reading your screen…':(data.provider||'Dexterity')+' · Mic off · Escape stops';$('notice').textContent='';});api.onCoachNotice(text=>$('notice').textContent=text);
