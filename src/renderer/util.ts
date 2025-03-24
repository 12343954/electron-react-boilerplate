import { IPC } from "../main/constants";

function IpcSendMessageToMain(action:string, value:any){
  window.electron.ipcRenderer.sendMessage('ipc-example', {action, value})
}

export function IpcRender_InitLanguage(lang:string){
  console.log('Sent initial language to main process:', lang);
  IpcSendMessageToMain(IPC.Action.language.init, lang);
}
export function IpcRender_ChangeLanguage(lang:string){
  console.log('Sent change language to main process:', lang);
  IpcSendMessageToMain(IPC.Action.language.change, lang);
}
