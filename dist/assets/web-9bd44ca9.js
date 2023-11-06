<<<<<<<< HEAD:dist/assets/web-4c42e762.js
import{W as a}from"./index-921dfcd9.js";class n extends a{async canShare(){return typeof navigator>"u"||!navigator.share?{value:!1}:{value:!0}}async share(e){if(typeof navigator>"u"||!navigator.share)throw this.unavailable("Share API not available in this browser");return await navigator.share({title:e.title,text:e.text,url:e.url}),{}}}export{n as ShareWeb};
========
import{W as a}from"./index-4086be12.js";class n extends a{async canShare(){return typeof navigator>"u"||!navigator.share?{value:!1}:{value:!0}}async share(e){if(typeof navigator>"u"||!navigator.share)throw this.unavailable("Share API not available in this browser");return await navigator.share({title:e.title,text:e.text,url:e.url}),{}}}export{n as ShareWeb};
>>>>>>>> 2.12.1:dist/assets/web-9bd44ca9.js
