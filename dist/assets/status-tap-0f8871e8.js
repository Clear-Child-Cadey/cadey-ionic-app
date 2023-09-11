<<<<<<<< HEAD:dist/assets/status-tap-67eecd3d.js
import{r as a,f as i,b as c,w as d,s as l}from"./index-470a7e28.js";/*!
========
import{r as a,f as i,b as c,w as d,s as l}from"./index-9fa113a4.js";/*!
>>>>>>>> 2.7.0-->-Articles:dist/assets/status-tap-0f8871e8.js
 * (C) Ionic http://ionicframework.com - MIT License
 */const m=()=>{const e=window;e.addEventListener("statusTap",()=>{a(()=>{const o=e.innerWidth,s=e.innerHeight,n=document.elementFromPoint(o/2,s/2);if(!n)return;const t=i(n);t&&new Promise(r=>c(t,r)).then(()=>{d(async()=>{t.style.setProperty("--overflow","hidden"),await l(t,300),t.style.removeProperty("--overflow")})})})})};export{m as startStatusTap};
