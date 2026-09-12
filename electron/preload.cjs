const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('dexterity', {
 settings: () => ipcRenderer.invoke('settings:get'), saveSettings: v => ipcRenderer.invoke('settings:save', v),
 pointLesson:()=>ipcRenderer.invoke('coach:point'),nextLesson:()=>ipcRenderer.invoke('coach:next'),hideCoach:()=>ipcRenderer.invoke('coach:hide'),coachListen:()=>ipcRenderer.invoke('coach:listen'),onCoach:cb=>ipcRenderer.on('coach:update',(_,data)=>cb(data)),onCoachNotice:cb=>ipcRenderer.on('coach:notice',(_,data)=>cb(data)),
 context:()=>ipcRenderer.invoke('context:get'),saveContext:input=>ipcRenderer.invoke('context:save',input),removeContext:id=>ipcRenderer.invoke('context:remove',id),previewContext:text=>ipcRenderer.invoke('context:preview',text),selectContextFile:()=>ipcRenderer.invoke('context:select-file'),importContext:items=>ipcRenderer.invoke('context:import',items),exportContext:format=>ipcRenderer.invoke('context:export',format),rememberActivity:value=>ipcRenderer.invoke('context:configure',value),clearActivity:()=>ipcRenderer.invoke('context:clear-activity'),contextFolder:()=>ipcRenderer.invoke('context:folder'),
 capture: () => ipcRenderer.invoke('capture'), clearCapture: () => ipcRenderer.invoke('capture:clear'),
 analyze: q => ipcRenderer.invoke('analyze', q), companion: v => ipcRenderer.invoke('companion', v),
 startTask: input=>ipcRenderer.invoke('task:start',input),stopTask:()=>ipcRenderer.invoke('task:stop'),approveTask:id=>ipcRenderer.invoke('task:approve',id),clearTask:()=>ipcRenderer.invoke('task:clear'),
 point: s => ipcRenderer.invoke('point', s), open: () => ipcRenderer.invoke('dashboard'), dismiss: () => ipcRenderer.invoke('point:hide'),
 onCapture: cb => ipcRenderer.on('capture:requested', cb), onPoint: cb => ipcRenderer.on('point:data', (_, data) => cb(data)),
 listen: () => ipcRenderer.invoke('voice:start'), stopListening: () => ipcRenderer.invoke('voice:stop'),
 finishListening: () => ipcRenderer.invoke('voice:finish'),
 voiceAudio: data => ipcRenderer.invoke('voice:audio',data), voiceRecorderReady: id => ipcRenderer.invoke('voice:ready',id), voiceRecorderError: data => ipcRenderer.invoke('voice:recorder-error',data),
 onVoiceRecord: cb => ipcRenderer.on('voice:record',(_,data)=>cb(data)), onVoiceCancel: cb => ipcRenderer.on('voice:cancel',cb), onVoiceFinish: cb => ipcRenderer.on('voice:finish',cb),
 nativeHealth: () => ipcRenderer.invoke('native:health'), onNative: cb => ipcRenderer.on('native:event', (_, event) => cb(event)),
 inspectForm: (remembered,windowId) => ipcRenderer.invoke('form:inspect', {remembered:!!remembered,windowId}), listFormWindows: () => ipcRenderer.invoke('form:windows'), fillForm: data => ipcRenderer.invoke('form:fill', data), submitForm: data => ipcRenderer.invoke('form:submit', data), practiceForm: () => ipcRenderer.invoke('form:practice'),
 openSpeechSettings: () => ipcRenderer.invoke('speech:settings'), holdCompanion: value => ipcRenderer.send('companion:hold', !!value), orbMenu: () => ipcRenderer.invoke('orb:menu'),
 openFormBrowser: (url,windowId) => ipcRenderer.invoke('form:browser',{url,windowId})
});
