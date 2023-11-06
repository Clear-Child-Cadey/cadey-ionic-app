<<<<<<<< HEAD:dist/assets/web-7c8efc96.js
import{W as o}from"./index-921dfcd9.js";class e extends o{constructor(){super(),this._lastWindow=null}async open(s){this._lastWindow=window.open(s.url,s.windowName||"_blank")}async close(){return new Promise((s,n)=>{this._lastWindow!=null?(this._lastWindow.close(),this._lastWindow=null,s()):n("No active window to close!")})}}const i=new e;export{i as Browser,e as BrowserWeb};
========
import{W as o}from"./index-4086be12.js";class e extends o{constructor(){super(),this._lastWindow=null}async open(s){this._lastWindow=window.open(s.url,s.windowName||"_blank")}async close(){return new Promise((s,n)=>{this._lastWindow!=null?(this._lastWindow.close(),this._lastWindow=null,s()):n("No active window to close!")})}}const i=new e;export{i as Browser,e as BrowserWeb};
>>>>>>>> 2.12.1:dist/assets/web-9f654f21.js
