<<<<<<<< HEAD:dist/assets/status-tap-0c2f61ec.js
import{r as a,f as i,b as c,w as d,s as l}from"./index-921dfcd9.js";/*!
========
import{r as a,f as i,b as c,w as d,s as l}from"./index-4086be12.js";/*!
>>>>>>>> 2.12.1:dist/assets/status-tap-26a118bf.js
 * (C) Ionic http://ionicframework.com - MIT License
 */const m=()=>{const e=window;e.addEventListener("statusTap",()=>{a(()=>{const o=e.innerWidth,s=e.innerHeight,n=document.elementFromPoint(o/2,s/2);if(!n)return;const t=i(n);t&&new Promise(r=>c(t,r)).then(()=>{d(async()=>{t.style.setProperty("--overflow","hidden"),await l(t,300),t.style.removeProperty("--overflow")})})})})};export{m as startStatusTap};
