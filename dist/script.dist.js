(()=>{var kt=Object.create;var Oe=Object.defineProperty;var Ct=Object.getOwnPropertyDescriptor;var St=Object.getOwnPropertyNames;var Tt=Object.getPrototypeOf,Mt=Object.prototype.hasOwnProperty;var ae=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports);var Bt=(t,e,n,l)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of St(e))!Mt.call(t,s)&&s!==n&&Oe(t,s,{get:()=>e[s],enumerable:!(l=Ct(e,s))||l.enumerable});return t};var Et=(t,e,n)=>(n=t!=null?kt(Tt(t)):{},Bt(e||!t||!t.__esModule?Oe(n,"default",{value:t,enumerable:!0}):n,t));var tt=ae((_n,et)=>{"use strict";var Ut="bold|bolder|lighter|[1-9]00",Ot="italic|oblique",Lt="small-caps",Nt="ultra-condensed|extra-condensed|condensed|semi-condensed|semi-expanded|expanded|extra-expanded|ultra-expanded",jt="px|pt|pc|in|cm|mm|%|em|ex|ch|rem|q",Ze=`'([^']+)'|"([^"]+)"|[\\w\\s-]+`,Ht=new RegExp(`(${Ut}) +`,"i"),Wt=new RegExp(`(${Ot}) +`,"i"),zt=new RegExp(`(${Lt}) +`,"i"),qt=new RegExp(`(${Nt}) +`,"i"),Ft=new RegExp(`([\\d\\.]+)(${jt}) *((?:${Ze})( *, *(?:${Ze}))*)`),we={},Gt=16;et.exports=t=>{if(we[t])return we[t];let e=Ft.exec(t);if(!e)return;let n={weight:"normal",style:"normal",stretch:"normal",variant:"normal",size:parseFloat(e[1]),unit:e[2],family:e[3].replace(/["']/g,"").replace(/ *, */g,",")},l,s,a,f,v=t.substring(0,e.index);switch((l=Ht.exec(v))&&(n.weight=l[1]),(s=Wt.exec(v))&&(n.style=s[1]),(a=zt.exec(v))&&(n.variant=a[1]),(f=qt.exec(v))&&(n.stretch=f[1]),n.unit){case"pt":n.size/=.75;break;case"pc":n.size*=16;break;case"in":n.size*=96;break;case"cm":n.size*=96/2.54;break;case"mm":n.size*=96/25.4;break;case"%":break;case"em":case"rem":n.size*=Gt/.75;break;case"q":n.size*=96/25.4/4;break}return we[t]=n}});var nt=ae(re=>{var Vt=tt();re.parseFont=Vt;re.createCanvas=function(t,e){return Object.assign(document.createElement("canvas"),{width:t,height:e})};re.createImageData=function(t,e,n){switch(arguments.length){case 0:return new ImageData;case 1:return new ImageData(t);case 2:return new ImageData(t,e);default:return new ImageData(t,e,n)}};re.loadImage=function(t,e){return new Promise(function(n,l){let s=Object.assign(document.createElement("img"),e);function a(){s.onload=null,s.onerror=null}s.onload=function(){a(),n(s)},s.onerror=function(){a(),l(new Error('Failed to load the image "'+t+'"'))},s.src=t})}});var ot=ae((at,fe)=>{var rt=function(){if(typeof self=="object"&&self)return self;if(typeof window=="object"&&window)return window;throw new Error("Unable to resolve global `this`")},Jt=function(){if(typeof globalThis=="object"&&globalThis)return globalThis;try{Object.defineProperty(Object.prototype,"__global__",{get:function(){return this},configurable:!0})}catch{return rt()}try{return __global__||rt()}finally{delete Object.prototype.__global__}},xe=function(){let t=Jt();return typeof t.process<"u"&&t.process.versions&&t.process.versions.node};(function(t,e){"use strict";typeof define=="function"&&define.amd?define([],e):typeof fe=="object"&&fe.exports?fe.exports=e():t.resemble=e()})(at,function(){"use strict";var t,e,n;xe()?(e=nt(),t=e.Image,n=e.loadImage):t=Image;function l(m,o){if(xe())return e.createCanvas(m,o);var _=document.createElement("canvas");return _.width=m,_.height=o,_}var s={},a=s,f=function(m){var o=1,_={red:255,green:0,blue:255,alpha:255},y={r:0,g:0,b:0,a:0},g={flat:function(r,i){r[i]=_.red,r[i+1]=_.green,r[i+2]=_.blue,r[i+3]=_.alpha},movement:function(r,i,u,c){r[i]=(c.r*(_.red/255)+_.red)/2,r[i+1]=(c.g*(_.green/255)+_.green)/2,r[i+2]=(c.b*(_.blue/255)+_.blue)/2,r[i+3]=c.a},flatDifferenceIntensity:function(r,i,u,c){r[i]=_.red,r[i+1]=_.green,r[i+2]=_.blue,r[i+3]=ge(u,c)},movementDifferenceIntensity:function(r,i,u,c){var d=ge(u,c)/255*.8;r[i]=(1-d)*(c.r*(_.red/255))+d*_.red,r[i+1]=(1-d)*(c.g*(_.green/255))+d*_.green,r[i+2]=(1-d)*(c.b*(_.blue/255))+d*_.blue,r[i+3]=c.a},diffOnly:function(r,i,u,c){r[i]=c.r,r[i+1]=c.g,r[i+2]=c.b,r[i+3]=c.a}},p=g.flat,C,b,T,E,R=1200,W=!0,D={},S=[],F=[],x={red:16,green:16,blue:16,alpha:16,minBrightness:16,maxBrightness:240},H=!1,X=!1,de=!1,z=!1,Se;function ge(r,i){return(Math.abs(r.r-i.r)+Math.abs(r.g-i.g)+Math.abs(r.b-i.b))/3}function Te(r,i,u,c,d){return r>(d.left||0)&&r<(d.right||u)&&i>(d.top||0)&&i<(d.bottom||c)}function dt(r,i,u,c,d){var k=!0,B,I,A,M,P;if(b instanceof Array){for(M=!1,B=0;B<b.length;B++)if(I=b[B],Te(r,i,u,c,I)){M=!0;break}}if(T instanceof Array){for(P=!0,B=0;B<T.length;B++)if(A=T[B],Te(r,i,u,c,A)){P=!1;break}}return E?ge(d,E)!==0:M===void 0&&P===void 0?!0:M===!1&&P===!0?!1:((M===!0||P===!0)&&(k=!0),(M===!1||P===!1)&&(k=!1),k)}function he(){var r=F.length,i;for(i=0;i<r;i++)typeof F[i]=="function"&&F[i](D)}function Me(r,i,u){var c,d;for(c=0;c<r;c++)for(d=0;d<i;d++)u(c,d)}function gt(r,i,u){var c=0,d=0,k=0,B=0,I=0,A=0,M=0,P=0;Me(i,u,function(j,G){var Q=(G*i+j)*4,q=r[Q],N=r[Q+1],L=r[Q+2],ee=r[Q+3],U=Ae(q,N,L);q===N&&q===L&&ee&&(q===0?P++:q===255&&M++),c++,d+=q/255*100,k+=N/255*100,B+=L/255*100,I+=(255-ee)/255*100,A+=U/255*100}),D.red=Math.floor(d/c),D.green=Math.floor(k/c),D.blue=Math.floor(B/c),D.alpha=Math.floor(I/c),D.brightness=Math.floor(A/c),D.white=Math.floor(M/c*100),D.black=Math.floor(P/c*100),he()}function Be(r,i){var u=r.width,c=r.height;de&&S.length===1&&(u=S[0].width,c=S[0].height);var d=l(u,c),k;d.getContext("2d").drawImage(r,0,0,u,c),k=d.getContext("2d").getImageData(0,0,u,c),S.push(k),i(k,u,c)}function _e(r,i){var u,c=new t;c.setAttribute||(c.setAttribute=function(){}),W&&c.setAttribute("crossorigin","anonymous"),c.onerror=function(d){c.onload=null,c.onerror=null;let k=d?d+"":"Unknown error";S.push({error:`Failed to load image '${r}'. ${k}`}),i()},c.onload=function(){c.onload=null,c.onerror=null,Be(c,i)},typeof r=="string"?(c.src=r,!xe()&&c.complete&&c.naturalWidth>0&&c.onload()):typeof r.data<"u"&&typeof r.width=="number"&&typeof r.height=="number"?(S.push(r),i(r,r.width,r.height)):typeof Buffer<"u"&&r instanceof Buffer?n(r).then(function(d){c.onload=null,c.onerror=null,Be(d,i)}).catch(function(d){S.push({error:d?d+"":"Image load error."}),i()}):(u=new FileReader,u.onload=function(d){c.src=d.target.result},u.readAsDataURL(r))}function Y(r,i,u){var c=Math.abs(r-i);return typeof r>"u"||typeof i>"u"?!1:r===i?!0:c<x[u]}function Ee(r,i){var u=Y(r.a,i.a,"alpha"),c=Y(r.brightness,i.brightness,"minBrightness");return c&&u}function Ae(r,i,u){return .3*r+.59*i+.11*u}function ht(r,i){var u=r.r===i.r,c=r.g===i.g,d=r.b===i.b;return u&&c&&d}function _t(r,i){var u=Y(r.r,i.r,"red"),c=Y(r.g,i.g,"green"),d=Y(r.b,i.b,"blue"),k=Y(r.a,i.a,"alpha");return u&&c&&d&&k}function pt(r,i){return Math.abs(r.brightness-i.brightness)>x.maxBrightness}function mt(r,i,u){var c=r/255,d=i/255,k=u/255,B=Math.max(c,d,k),I=Math.min(c,d,k),A,M;if(B===I)A=0;else switch(M=B-I,B){case c:A=(d-k)/M+(d<k?6:0);break;case d:A=(k-c)/M+2;break;case k:A=(c-d)/M+4;break;default:A/=6}return A}function De(r,i,u,c,d,k){var B,I=1,A,M,P=0,j=0,G=0;for($e(r),A=I*-1;A<=I;A++)for(M=I*-1;M<=I;M++)if(!(A===0&&M===0)){if(B=((c+M)*k+(d+A))*4,!pe(y,i,B,u))continue;if(Z(y),$e(y),pt(r,y)&&P++,ht(r,y)&&G++,Math.abs(y.h-r.h)>.3&&j++,j>1||P>1)return!0}return G<2}function vt(r,i,u){C!=="diffOnly"&&(r[i]=u.r,r[i+1]=u.g,r[i+2]=u.b,r[i+3]=u.a*o)}function Ie(r,i,u){C!=="diffOnly"&&(r[i]=u.brightness,r[i+1]=u.brightness,r[i+2]=u.brightness,r[i+3]=u.a*o)}function pe(r,i,u){return i.length>u?(r.r=i[u],r.g=i[u+1],r.b=i[u+2],r.a=i[u+3],!0):!1}function Z(r){r.brightness=Ae(r.r,r.g,r.b)}function $e(r){r.h=mt(r.r,r.g,r.b)}function bt(r,i,u,c){var d=r.data,k=i.data,B,I,A,M;z||(B=l(u,c),I=B.getContext("2d"),A=I.createImageData(u,c),M=A.data);var P=0,j={top:c,left:u,bottom:0,right:0},G=function(U,O){j.left=Math.min(U,j.left),j.right=Math.max(U,j.right),j.top=Math.min(O,j.top),j.bottom=Math.max(O,j.bottom)},Q=Date.now(),q;!!R&&H&&(u>R||c>R)&&(q=6);var N={r:0,g:0,b:0,a:0},L={r:0,g:0,b:0,a:0},ee=!1;Me(u,c,function(U,O){if(!ee&&!(q&&(O%q===0||U%q===0))){var V=(O*u+U)*4;if(!(!pe(N,d,V,1)||!pe(L,k,V,2))){var ve=dt(U,O,u,c,L);if(X){Z(N),Z(L),Ee(N,L)||!ve?z||Ie(M,V,L):(z||p(M,V,N,L),P++,G(U,O));return}if(_t(N,L)||!ve?z||vt(M,V,N):H&&(Z(N),Z(L),De(N,d,1,O,U,u)||De(L,k,2,O,U,u))&&(Ee(N,L)||!ve)?z||Ie(M,V,L):(z||p(M,V,N,L),P++,G(U,O)),z){var xt=P/(c*u)*100;xt>Se&&(ee=!0)}}}}),D.rawMisMatchPercentage=P/(c*u)*100,D.misMatchPercentage=D.rawMisMatchPercentage.toFixed(2),D.diffBounds=j,D.analysisTime=Date.now()-Q,D.getImageDataUrl=function(U){if(z)throw Error("No diff image available - ran in compareOnly mode");var O=0;return U&&(O=yt(U,I,B)),I.putImageData(A,0,O),B.toDataURL("image/png")},!z&&B.toBuffer&&(D.getBuffer=function(U){if(U){var O=B.width+2;B.width=O*3,I.putImageData(r,0,0),I.putImageData(i,O,0),I.putImageData(A,O*2,0)}else I.putImageData(A,0,0);return B.toBuffer()})}function yt(r,i,u){var c=2;i.font="12px sans-serif";var d=i.measureText(r).width+c*2,k=22;return d>u.width&&(u.width=d),u.height+=k,i.fillStyle="#666",i.fillRect(0,0,u.width,k-4),i.fillStyle="#fff",i.fillRect(0,k-4,u.width,4),i.fillStyle="#fff",i.textBaseline="top",i.font="12px sans-serif",i.fillText(r,c,1),k}function Re(r,i,u){var c,d;return r.height<u||r.width<i?(c=l(i,u),d=c.getContext("2d"),d.putImageData(r,0,0),d.getImageData(0,0,i,u)):r}function me(r){var i;if(r.errorColor)for(i in r.errorColor)r.errorColor.hasOwnProperty(i)&&(_[i]=r.errorColor[i]===void 0?_[i]:r.errorColor[i]);r.errorType&&g[r.errorType]&&(p=g[r.errorType],C=r.errorType),r.errorPixel&&typeof r.errorPixel=="function"&&(p=r.errorPixel),o=isNaN(Number(r.transparency))?o:r.transparency,r.largeImageThreshold!==void 0&&(R=r.largeImageThreshold),r.useCrossOrigin!==void 0&&(W=r.useCrossOrigin),r.boundingBox!==void 0&&(b=[r.boundingBox]),r.ignoredBox!==void 0&&(T=[r.ignoredBox]),r.boundingBoxes!==void 0&&(b=r.boundingBoxes),r.ignoredBoxes!==void 0&&(T=r.ignoredBoxes),r.ignoreAreasColoredWith!==void 0&&(E=r.ignoreAreasColoredWith)}function wt(r,i){a!==s&&me(a);function u(){var c,d;if(S.length===2){if(S[0].error||S[1].error){D={},D.error=S[0].error?S[0].error:S[1].error,he();return}c=S[0].width>S[1].width?S[0].width:S[1].width,d=S[0].height>S[1].height?S[0].height:S[1].height,S[0].width===S[1].width&&S[0].height===S[1].height?D.isSameDimensions=!0:D.isSameDimensions=!1,D.dimensionDifference={width:S[0].width-S[1].width,height:S[0].height-S[1].height},bt(Re(S[0],c,d),Re(S[1],c,d),c,d),he()}}S=[],_e(r,u),_e(i,u)}function Pe(r){var i,u=typeof r=="function";u||(i=r);var c={setReturnEarlyThreshold:function(d){return d&&(z=!0,Se=d),c},scaleToSameSize:function(){return de=!0,u&&r(),c},useOriginalSize:function(){return de=!1,u&&r(),c},ignoreNothing:function(){return x.red=0,x.green=0,x.blue=0,x.alpha=0,x.minBrightness=0,x.maxBrightness=255,H=!1,X=!1,u&&r(),c},ignoreLess:function(){return x.red=16,x.green=16,x.blue=16,x.alpha=16,x.minBrightness=16,x.maxBrightness=240,H=!1,X=!1,u&&r(),c},ignoreAntialiasing:function(){return x.red=32,x.green=32,x.blue=32,x.alpha=32,x.minBrightness=64,x.maxBrightness=96,H=!0,X=!1,u&&r(),c},ignoreColors:function(){return x.alpha=16,x.minBrightness=16,x.maxBrightness=240,H=!1,X=!0,u&&r(),c},ignoreAlpha:function(){return x.red=16,x.green=16,x.blue=16,x.alpha=255,x.minBrightness=16,x.maxBrightness=240,H=!1,X=!1,u&&r(),c},repaint:function(){return u&&r(),c},outputSettings:function(d){return me(d),c},onComplete:function(d){F.push(d);var k=function(){wt(m,i)};return k(),Pe(k)},setupCustomTolerance:function(d){for(var k in x)!d.hasOwnProperty(k)||(x[k]=d[k])}};return c}var Ue={onComplete:function(r){F.push(r),_e(m,function(i,u,c){gt(i.data,u,c)})},compareTo:function(r){return Pe(r)},outputSettings:function(r){return me(r),Ue}};return Ue};function v(m){return a=m,f}function w(m,o,_){switch(o){case"nothing":m.ignoreNothing();break;case"less":m.ignoreLess();break;case"antialiasing":m.ignoreAntialiasing();break;case"colors":m.ignoreColors();break;case"alpha":m.ignoreAlpha();break;default:throw new Error("Invalid ignore: "+o)}m.setupCustomTolerance(_)}return f.compare=function(m,o,_,y){var g,p;typeof _=="function"?(g=_,p={}):(g=y,p=_||{});var C=f(m),b;p.output&&C.outputSettings(p.output),b=C.compareTo(o),p.returnEarlyThreshold&&b.setReturnEarlyThreshold(p.returnEarlyThreshold),p.scaleToSameSize&&b.scaleToSameSize();var T=p.tolerance||{};typeof p.ignore=="string"?w(b,p.ignore,T):p.ignore&&p.ignore.forEach&&p.ignore.forEach(function(E){w(b,E,T)}),b.onComplete(function(E){E.error?g(E.error):g(null,E)})},f.outputSettings=v,f})});var lt=ae((mn,it)=>{var Kt=ot();it.exports=function(e,n,l){return new Promise((s,a)=>{Kt.compare(e,n,l,(f,v)=>{f?a(f):s(v)})})}});var ce,$,ze,At,te,Le,Dt,ie={},qe=[],It=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;function J(t,e){for(var n in e)t[n]=e[n];return t}function Fe(t){var e=t.parentNode;e&&e.removeChild(t)}function h(t,e,n){var l,s,a,f={};for(a in e)a=="key"?l=e[a]:a=="ref"?s=e[a]:f[a]=e[a];if(arguments.length>2&&(f.children=arguments.length>3?ce.call(arguments,2):n),typeof t=="function"&&t.defaultProps!=null)for(a in t.defaultProps)f[a]===void 0&&(f[a]=t.defaultProps[a]);return oe(t,f,l,s,null)}function oe(t,e,n,l,s){var a={type:t,props:e,key:n,ref:l,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:s??++ze};return s==null&&$.vnode!=null&&$.vnode(a),a}function ue(t){return t.children}function K(t,e){this.props=t,this.context=e}function ne(t,e){if(e==null)return t.__?ne(t.__,t.__.__k.indexOf(t)+1):null;for(var n;e<t.__k.length;e++)if((n=t.__k[e])!=null&&n.__e!=null)return n.__e;return typeof t.type=="function"?ne(t):null}function Ge(t){var e,n;if((t=t.__)!=null&&t.__c!=null){for(t.__e=t.__c.base=null,e=0;e<t.__k.length;e++)if((n=t.__k[e])!=null&&n.__e!=null){t.__e=t.__c.base=n.__e;break}return Ge(t)}}function Ne(t){(!t.__d&&(t.__d=!0)&&te.push(t)&&!le.__r++||Le!==$.debounceRendering)&&((Le=$.debounceRendering)||setTimeout)(le)}function le(){for(var t;le.__r=te.length;)t=te.sort(function(e,n){return e.__v.__b-n.__v.__b}),te=[],t.some(function(e){var n,l,s,a,f,v;e.__d&&(f=(a=(n=e).__v).__e,(v=n.__P)&&(l=[],(s=J({},a)).__v=a.__v+1,be(v,a,s,n.__n,v.ownerSVGElement!==void 0,a.__h!=null?[f]:null,l,f??ne(a),a.__h),Xe(l,a),a.__e!=f&&Ge(a)))})}function Ve(t,e,n,l,s,a,f,v,w,m){var o,_,y,g,p,C,b,T=l&&l.__k||qe,E=T.length;for(n.__k=[],o=0;o<e.length;o++)if((g=n.__k[o]=(g=e[o])==null||typeof g=="boolean"?null:typeof g=="string"||typeof g=="number"||typeof g=="bigint"?oe(null,g,null,null,g):Array.isArray(g)?oe(ue,{children:g},null,null,null):g.__b>0?oe(g.type,g.props,g.key,g.ref?g.ref:null,g.__v):g)!=null){if(g.__=n,g.__b=n.__b+1,(y=T[o])===null||y&&g.key==y.key&&g.type===y.type)T[o]=void 0;else for(_=0;_<E;_++){if((y=T[_])&&g.key==y.key&&g.type===y.type){T[_]=void 0;break}y=null}be(t,g,y=y||ie,s,a,f,v,w,m),p=g.__e,(_=g.ref)&&y.ref!=_&&(b||(b=[]),y.ref&&b.push(y.ref,null,g),b.push(_,g.__c||p,g)),p!=null?(C==null&&(C=p),typeof g.type=="function"&&g.__k===y.__k?g.__d=w=Je(g,w,t):w=Ke(t,g,y,T,p,w),typeof n.type=="function"&&(n.__d=w)):w&&y.__e==w&&w.parentNode!=t&&(w=ne(y))}for(n.__e=C,o=E;o--;)T[o]!=null&&Qe(T[o],T[o]);if(b)for(o=0;o<b.length;o++)Ye(b[o],b[++o],b[++o])}function Je(t,e,n){for(var l,s=t.__k,a=0;s&&a<s.length;a++)(l=s[a])&&(l.__=t,e=typeof l.type=="function"?Je(l,e,n):Ke(n,l,l,s,l.__e,e));return e}function Ke(t,e,n,l,s,a){var f,v,w;if(e.__d!==void 0)f=e.__d,e.__d=void 0;else if(n==null||s!=a||s.parentNode==null)e:if(a==null||a.parentNode!==t)t.appendChild(s),f=null;else{for(v=a,w=0;(v=v.nextSibling)&&w<l.length;w+=1)if(v==s)break e;t.insertBefore(s,a),f=a}return f!==void 0?f:s.nextSibling}function $t(t,e,n,l,s){var a;for(a in n)a==="children"||a==="key"||a in e||se(t,a,null,n[a],l);for(a in e)s&&typeof e[a]!="function"||a==="children"||a==="key"||a==="value"||a==="checked"||n[a]===e[a]||se(t,a,e[a],n[a],l)}function je(t,e,n){e[0]==="-"?t.setProperty(e,n):t[e]=n==null?"":typeof n!="number"||It.test(e)?n:n+"px"}function se(t,e,n,l,s){var a;e:if(e==="style")if(typeof n=="string")t.style.cssText=n;else{if(typeof l=="string"&&(t.style.cssText=l=""),l)for(e in l)n&&e in n||je(t.style,e,"");if(n)for(e in n)l&&n[e]===l[e]||je(t.style,e,n[e])}else if(e[0]==="o"&&e[1]==="n")a=e!==(e=e.replace(/Capture$/,"")),e=e.toLowerCase()in t?e.toLowerCase().slice(2):e.slice(2),t.l||(t.l={}),t.l[e+a]=n,n?l||t.addEventListener(e,a?We:He,a):t.removeEventListener(e,a?We:He,a);else if(e!=="dangerouslySetInnerHTML"){if(s)e=e.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if(e!=="href"&&e!=="list"&&e!=="form"&&e!=="tabIndex"&&e!=="download"&&e in t)try{t[e]=n??"";break e}catch{}typeof n=="function"||(n==null||n===!1&&e.indexOf("-")==-1?t.removeAttribute(e):t.setAttribute(e,n))}}function He(t){this.l[t.type+!1]($.event?$.event(t):t)}function We(t){this.l[t.type+!0]($.event?$.event(t):t)}function be(t,e,n,l,s,a,f,v,w){var m,o,_,y,g,p,C,b,T,E,R,W,D,S,F,x=e.type;if(e.constructor!==void 0)return null;n.__h!=null&&(w=n.__h,v=e.__e=n.__e,e.__h=null,a=[v]),(m=$.__b)&&m(e);try{e:if(typeof x=="function"){if(b=e.props,T=(m=x.contextType)&&l[m.__c],E=m?T?T.props.value:m.__:l,n.__c?C=(o=e.__c=n.__c).__=o.__E:("prototype"in x&&x.prototype.render?e.__c=o=new x(b,E):(e.__c=o=new K(b,E),o.constructor=x,o.render=Pt),T&&T.sub(o),o.props=b,o.state||(o.state={}),o.context=E,o.__n=l,_=o.__d=!0,o.__h=[],o._sb=[]),o.__s==null&&(o.__s=o.state),x.getDerivedStateFromProps!=null&&(o.__s==o.state&&(o.__s=J({},o.__s)),J(o.__s,x.getDerivedStateFromProps(b,o.__s))),y=o.props,g=o.state,_)x.getDerivedStateFromProps==null&&o.componentWillMount!=null&&o.componentWillMount(),o.componentDidMount!=null&&o.__h.push(o.componentDidMount);else{if(x.getDerivedStateFromProps==null&&b!==y&&o.componentWillReceiveProps!=null&&o.componentWillReceiveProps(b,E),!o.__e&&o.shouldComponentUpdate!=null&&o.shouldComponentUpdate(b,o.__s,E)===!1||e.__v===n.__v){for(o.props=b,o.state=o.__s,e.__v!==n.__v&&(o.__d=!1),o.__v=e,e.__e=n.__e,e.__k=n.__k,e.__k.forEach(function(H){H&&(H.__=e)}),R=0;R<o._sb.length;R++)o.__h.push(o._sb[R]);o._sb=[],o.__h.length&&f.push(o);break e}o.componentWillUpdate!=null&&o.componentWillUpdate(b,o.__s,E),o.componentDidUpdate!=null&&o.__h.push(function(){o.componentDidUpdate(y,g,p)})}if(o.context=E,o.props=b,o.__v=e,o.__P=t,W=$.__r,D=0,"prototype"in x&&x.prototype.render){for(o.state=o.__s,o.__d=!1,W&&W(e),m=o.render(o.props,o.state,o.context),S=0;S<o._sb.length;S++)o.__h.push(o._sb[S]);o._sb=[]}else do o.__d=!1,W&&W(e),m=o.render(o.props,o.state,o.context),o.state=o.__s;while(o.__d&&++D<25);o.state=o.__s,o.getChildContext!=null&&(l=J(J({},l),o.getChildContext())),_||o.getSnapshotBeforeUpdate==null||(p=o.getSnapshotBeforeUpdate(y,g)),F=m!=null&&m.type===ue&&m.key==null?m.props.children:m,Ve(t,Array.isArray(F)?F:[F],e,n,l,s,a,f,v,w),o.base=e.__e,e.__h=null,o.__h.length&&f.push(o),C&&(o.__E=o.__=null),o.__e=!1}else a==null&&e.__v===n.__v?(e.__k=n.__k,e.__e=n.__e):e.__e=Rt(n.__e,e,n,l,s,a,f,w);(m=$.diffed)&&m(e)}catch(H){e.__v=null,(w||a!=null)&&(e.__e=v,e.__h=!!w,a[a.indexOf(v)]=null),$.__e(H,e,n)}}function Xe(t,e){$.__c&&$.__c(e,t),t.some(function(n){try{t=n.__h,n.__h=[],t.some(function(l){l.call(n)})}catch(l){$.__e(l,n.__v)}})}function Rt(t,e,n,l,s,a,f,v){var w,m,o,_=n.props,y=e.props,g=e.type,p=0;if(g==="svg"&&(s=!0),a!=null){for(;p<a.length;p++)if((w=a[p])&&"setAttribute"in w==!!g&&(g?w.localName===g:w.nodeType===3)){t=w,a[p]=null;break}}if(t==null){if(g===null)return document.createTextNode(y);t=s?document.createElementNS("http://www.w3.org/2000/svg",g):document.createElement(g,y.is&&y),a=null,v=!1}if(g===null)_===y||v&&t.data===y||(t.data=y);else{if(a=a&&ce.call(t.childNodes),m=(_=n.props||ie).dangerouslySetInnerHTML,o=y.dangerouslySetInnerHTML,!v){if(a!=null)for(_={},p=0;p<t.attributes.length;p++)_[t.attributes[p].name]=t.attributes[p].value;(o||m)&&(o&&(m&&o.__html==m.__html||o.__html===t.innerHTML)||(t.innerHTML=o&&o.__html||""))}if($t(t,y,_,s,v),o)e.__k=[];else if(p=e.props.children,Ve(t,Array.isArray(p)?p:[p],e,n,l,s&&g!=="foreignObject",a,f,a?a[0]:n.__k&&ne(n,0),v),a!=null)for(p=a.length;p--;)a[p]!=null&&Fe(a[p]);v||("value"in y&&(p=y.value)!==void 0&&(p!==t.value||g==="progress"&&!p||g==="option"&&p!==_.value)&&se(t,"value",p,_.value,!1),"checked"in y&&(p=y.checked)!==void 0&&p!==t.checked&&se(t,"checked",p,_.checked,!1))}return t}function Ye(t,e,n){try{typeof t=="function"?t(e):t.current=e}catch(l){$.__e(l,n)}}function Qe(t,e,n){var l,s;if($.unmount&&$.unmount(t),(l=t.ref)&&(l.current&&l.current!==t.__e||Ye(l,null,e)),(l=t.__c)!=null){if(l.componentWillUnmount)try{l.componentWillUnmount()}catch(a){$.__e(a,e)}l.base=l.__P=null,t.__c=void 0}if(l=t.__k)for(s=0;s<l.length;s++)l[s]&&Qe(l[s],e,n||typeof t.type!="function");n||t.__e==null||Fe(t.__e),t.__=t.__e=t.__d=void 0}function Pt(t,e,n){return this.constructor(t,n)}function ye(t,e,n){var l,s,a;$.__&&$.__(t,e),s=(l=typeof n=="function")?null:n&&n.__k||e.__k,a=[],be(e,t=(!l&&n||e).__k=h(ue,null,[t]),s||ie,ie,e.ownerSVGElement!==void 0,!l&&n?[n]:s?null:e.firstChild?ce.call(e.childNodes):null,a,!l&&n?n:s?s.__e:e.firstChild,l),Xe(a,t)}ce=qe.slice,$={__e:function(t,e,n,l){for(var s,a,f;e=e.__;)if((s=e.__c)&&!s.__)try{if((a=s.constructor)&&a.getDerivedStateFromError!=null&&(s.setState(a.getDerivedStateFromError(t)),f=s.__d),s.componentDidCatch!=null&&(s.componentDidCatch(t,l||{}),f=s.__d),f)return s.__E=s}catch(v){t=v}throw t}},ze=0,At=function(t){return t!=null&&t.constructor===void 0},K.prototype.setState=function(t,e){var n;n=this.__s!=null&&this.__s!==this.state?this.__s:this.__s=J({},this.state),typeof t=="function"&&(t=t(J({},n),this.props)),t&&J(n,t),t!=null&&this.__v&&(e&&this._sb.push(e),Ne(this))},K.prototype.forceUpdate=function(t){this.__v&&(this.__e=!0,t&&this.__h.push(t),Ne(this))},K.prototype.render=ue,te=[],le.__r=0,Dt=0;var ft=Et(lt());var Xt=document.querySelector("#container"),ke=class extends K{constructor(e){super(e),this.setState({color:e.colors[0],radius:e.radii[0]})}componentDidUpdate(){this.props.updater(this.state.color,this.state.radius)}render(){let e=[];for(let a of this.props.colors)e.push(h("td",{class:"pr-1"},h("div",{onClick:()=>{this.setState({color:a})},class:"rounded-md",style:{width:"60px",height:"60px",backgroundColor:a,border:this.state.color==a?"2px solid red":"2px solid black",cursor:"pointer"}})));let n=[];n.push(h("td",{class:"pr-1"},h("div",{onClick:()=>{let a=document.querySelector("#canvas"),f=a.getContext("2d");f.rect(0,0,a.getAttribute("width"),a.getAttribute("height")),f.fillStyle=this.state.color,f.fill()},class:"flex items-center justify-center rounded-md",style:{width:"60px",height:"60px",backgroundColor:this.state.color,border:"1px solid black",cursor:"pointer"}},h("svg",{width:"40",height:"40",viewBox:"-1 0 16 16",xmlns:"http://www.w3.org/2000/svg"},h("path",{fill:"#fff",stroke:"#000","stroke-width":"0.5",d:"M6.192 2.78c-.458-.677-.927-1.248-1.35-1.643a2.972 2.972 0 0 0-.71-.515c-.217-.104-.56-.205-.882-.02c-.367.213-.427.63-.43.896c-.003.304.064.664.173 1.044c.196.687.556 1.528 1.035 2.402L.752 8.22c-.277.277-.269.656-.218.918c.055.283.187.593.36.903c.348.627.92 1.361 1.626 2.068c.707.707 1.441 1.278 2.068 1.626c.31.173.62.305.903.36c.262.05.64.059.918-.218l5.615-5.615c.118.257.092.512.05.939c-.03.292-.068.665-.073 1.176v.123h.003a1 1 0 0 0 1.993 0H14v-.057a1.01 1.01 0 0 0-.004-.117c-.055-1.25-.7-2.738-1.86-3.494a4.322 4.322 0 0 0-.211-.434c-.349-.626-.92-1.36-1.627-2.067c-.707-.707-1.441-1.279-2.068-1.627c-.31-.172-.62-.304-.903-.36c-.262-.05-.64-.058-.918.219l-.217.216zM4.16 1.867c.381.356.844.922 1.311 1.632l-.704.705c-.382-.727-.66-1.402-.813-1.938a3.283 3.283 0 0 1-.131-.673c.091.061.204.15.337.274zm.394 3.965c.54.852 1.107 1.567 1.607 2.033a.5.5 0 1 0 .682-.732c-.453-.422-1.017-1.136-1.564-2.027l1.088-1.088c.054.12.115.243.183.365c.349.627.92 1.361 1.627 2.068c.706.707 1.44 1.278 2.068 1.626c.122.068.244.13.365.183l-4.861 4.862a.571.571 0 0 1-.068-.01c-.137-.027-.342-.104-.608-.252c-.524-.292-1.186-.8-1.846-1.46c-.66-.66-1.168-1.32-1.46-1.846c-.147-.265-.225-.47-.251-.607a.573.573 0 0 1-.01-.068l3.048-3.047zm2.87-1.935a2.44 2.44 0 0 1-.241-.561c.135.033.324.11.562.241c.524.292 1.186.8 1.846 1.46c.45.45.83.901 1.118 1.31a3.497 3.497 0 0 0-1.066.091a11.27 11.27 0 0 1-.76-.694c-.66-.66-1.167-1.322-1.458-1.847z"})))));for(let a of this.props.radii)n.push(h("td",null,h("div",{class:`rounded-md flex items-center cursor-pointer justify-center ${this.state.radius==a?"bg-green-200":"bg-grey-200"}`,style:{minWidth:"60px",minHeight:"60px"},onClick:()=>{this.setState({radius:a})}},h("div",{style:{width:`${a*2}px`,height:`${a*2}px`,backgroundColor:this.state.color,border:"2px solid black",borderRadius:"100000px"}}))));return h("div",{class:"flex flex-col items-center"},h("div",null,h("table",{class:"mt-1"},h("tbody",null,h("tr",null,e)))),h("div",null,h("table",{class:"mt-1"},h("tbody",null,h("tr",null,n)))))}};function Yt(t){let e=t.colors,n=!1,l=null;e=e.map(C=>`#${C}`);let s=e[0],a=[5,10,25],f=a[0],v=t.width,w=t.height,m=null,o=(C,b)=>{C.beginPath(),C.arc(b.x,b.y,b.radius,0,2*Math.PI,!1),C.fillStyle=b.color,C.fill()},_=C=>{let b=C.target;C.stopPropagation(),C.preventDefault();let T=b.getContext("2d");l=b.getBoundingClientRect();let E=C.x-l.x,R=C.y-l.y;o(T,{x:E,y:R,radius:f,color:s}),m=[E,R],n=!0},y=C=>{if(!n)return;C.stopPropagation(),C.preventDefault();let b=null,T=null;if(C instanceof TouchEvent){let W=C.targetTouches[0];b=W.clientX-l.x,T=W.clientY-l.y}else b=C.x-l.x,T=C.y-l.y;let R=C.target.getContext("2d");m!==null&&(R.beginPath(),R.moveTo(m[0],m[1]),R.lineTo(b,T),R.lineWidth=f*2,R.strokeStyle=s,R.stroke()),o(R,{x:b,y:T,radius:f,color:s}),m=[b,T]},g=C=>{n=!1};return document.body.addEventListener("mouseup",g),document.body.addEventListener("touchend",g),h("div",{class:"mt-2"},h("canvas",{width:v,height:w,id:"canvas",style:"border: 1px solid black; margin: 0 auto;",onMouseDown:_,onMouseMove:y,onTouchStart:_,onTouchMove:y}),h(ke,{colors:e,radii:a,updater:(C,b)=>{s=C,f=b}}))}async function Qt(t,e,n){let l=new Image;l.src=`/compare-flags/${t}-flag-150px.png`,await l.decode();let s=document.createElement("canvas");s.width=l.width,s.height=l.height,s.getContext("2d").drawImage(l,0,0);let f=await(0,ft.default)(s.toDataURL(),e.toDataURL(),{scaleToSameSize:!0,tolerance:{alpha:100}});return{name:t,similarityPercent:100-f.misMatchPercentage}}function Zt(t){function e(){let n=Math.sin(t++)*1e4;return n-Math.floor(n)}return e}function en(t){var e=0,n,l;if(t.length===0)return e;for(n=0;n<t.length;n++)l=t.charCodeAt(n),e=(e<<5)-e+l,e|=0;return e}function tn(t){let e=Object.keys(t),n=new Date,l=en(n.toDateString()),s=Zt(l),a=Math.floor(s()*e.length);return e[a]}async function nn(t){let e=t.map(a=>[a,`/data/${a}/flag.svg`]),n=document.querySelector("#canvas"),l=[];for(let[a,f]of e)l.push(Qt(a,n,f));let s=await Promise.all(l);return s=s.sort((a,f)=>f.similarityPercent-a.similarityPercent),s}var Ce=class extends K{constructor(e){super(e),this.state={status:"none"}}render(){let e=null;return this.state.status==="checking"?e=h("p",null,"Checking..."):e=h("button",{class:"btn btn-outline btn-secondary",onClick:async()=>{this.setState({status:"checking"}),await fn(this.props.data,this.props.country,this.props.countryData),this.setState({status:"none"})}},"Submit"),h("div",{class:"mt-2"},e)}},rn=["Oopsie doopsie","Not quite","Whoopsie daisy!"],an=["Great job"];function st(t){return t[Math.floor(Math.random()*t.length)]}function on(t){let e=[];e.push(h("tr",null,h("td",null,h("div",{class:"mr-4"},"Name")),h("td",null,t.name?"\u2714\uFE0F":t.name===null?"\u2754":"\u274C"))),e.push(h("tr",null,h("td",null,h("div",{class:"mr-4"},"Capital")),h("td",null,t.capital?"\u2714\uFE0F":t.capital===null?"\u2754":"\u274C"))),e.push(h("tr",null,h("td",null,h("div",{class:"mr-4"},"Flag")),h("td",null,t.flag?"\u2714\uFE0F":t.flag===null?"\u2754":"\u274C")));let n=null,l=t.name&&t.flag&&t.capital;l?n=`How about that! I guessed right after ${t.num_attempts} ${t.num_attempts===1?"try":"tries"} on today's Coucapag!`:n=`Uh oh! I'm stumped after ${t.num_attempts} ${t.num_attempts===1?"try":"tries"} on today's Coucapag! Maybe you can help me?`;let s=null;l||(s=h("button",{onClick:()=>{ln()},class:"btn mt-4"},"Try Again"));let a=(m,o)=>o!==1?m+"s":m,f=null,v=new Date().toLocaleDateString();l?f=`Correct in ${t.num_attempts} ${a("attempt",t.num_attempts)} on ${v}!`:f=`${t.num_attempts} ${a("attempt",t.num_attempts)} so far on ${v} :(`;let w=h("div",{class:"py-10 flex flex-col items-center justify-center w-80 max-w-md bg-slate-700 text-center text-white border-2 rounded-lg shadow-2xl drop-shadow-2xl"},h("div",null,h("span",{style:"font-family: Helvetica, sans-serif",class:"mt-10 bg-slate-100 p-2 text-black text-4xl rounded-xl"},st(l?an:rn),"!")),h("div",{class:"mt-4"},f),h("div",{class:"mt-4"},h("table",null,h("tbody",null,e))),h("div",null,s),h("div",null,h("button",{onClick:()=>{cn(n+`

https://coucapags.whatscookin.biz/`)},class:"btn mt-4"},h("svg",{xmlns:"http://www.w3.org/2000/svg",width:"32",height:"32",viewBox:"0 0 16 16"},h("g",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"1.5"},h("circle",{cx:"4",cy:"8",r:"2.25"}),h("circle",{cx:"12",cy:"12",r:"2.25"}),h("circle",{cx:"12",cy:"4",r:"2.25"}),h("path",{d:"m6 9l4 2M6 7l4-2"})))," ",l?"Share":"Give Up")));ye(w,document.querySelector("#error-modal"))}function ln(){document.querySelector("#error-modal").innerHTML=""}function sn(t){var e=document.createElement("textarea");e.value=t,e.style.top="0",e.style.left="0",e.style.position="fixed",document.body.appendChild(e),e.focus(),e.select();try{var n=document.execCommand("copy"),l=n?"successful":"unsuccessful"}catch(s){console.error(s)}document.body.removeChild(e)}function cn(t){let e="https://coucapags.whatscookin.biz/";navigator.share?navigator.share({title:e,text:t}).then(()=>console.log("Successful share")).catch(n=>console.log("Error sharing",n)):(console.log("Sharing",e),sn(t),alert("Copied to clipboard!"))}function un(t,e){let n=[" ","'","\u02BB","."];t=t.toLowerCase(),e=e.toLowerCase();for(let s of n)t=t.replaceAll(s,""),e=e.replaceAll(s,"");let l={\u00E9:["e"],\u00F3:["o"],\u0103:["a"],\u0219:["s"],\u00ED:["i"]};if(t.length!==e.length)return!1;for(let s=0;s<t.length;s++){let a=t.charAt(s),f=e.charAt(s);if(a!==f){let v=l[a];if(!v||!v.includes(f))return!1}}return!0}function ct(t,e){for(let n of e)if(un(t,n))return!0;return!1}function ut(){return`num_attempts_${new Date().toLocaleDateString()}`}async function fn(t,e,n){let l=Object.keys(t),s=document.querySelector("#country-name").value,a=document.querySelector("#country-capital").value,f=localStorage.getItem(ut());f==null&&(f=0),f=parseInt(f);let v=f+1;localStorage.setItem(ut(),v);let w={name:null,capital:null,flag:null,num_attempts:v};if(w.name=ct(s,n.names),w.capital=ct(a,n.capitals),w.name&&w.capital){let m=await nn(l),_=m.slice(0,4).map(g=>g.name).includes(e)?e:m[0].name;console.log(m.slice(0,10).map(g=>g.name));let y=m.slice(0,4).map(g=>g.name).includes(e);w.flag=y}on(w)}async function dn(){let e=await(await fetch("/data/countries.json")).json(),l=await(await fetch("/colors.json")).json(),s=tn(l),a=l[s],f=new Image;f.src=`/data/${s}/flag.svg`,f.onload=()=>{let v=f.height,w=f.width,o=150/v;v=v*o,w=w*o,ye(h("div",{class:"flex justify-center flex-col items-center"},h("img",{class:"noselect w-60",src:`/data/${s}/outline.svg`}),h("div",{class:"w-full flex items-center flex-col px-4"},h("div",{class:"mb-2 w-full"},h("span",{class:"font-bold block"},"Name"),h("input",{class:"mt-2 input input-bordered input-primary w-full",type:"text",id:"country-name"})),h("div",{class:"mb-2 w-full"},h("span",{class:"font-bold block"},"Capital"),h("input",{class:"mt-2 input input-bordered input-primary w-full",type:"text",id:"country-capital"}))),h("div",{class:"w-full"},h("span",{class:"px-4 font-bold block"},"The Flag")),h("div",null,Yt({width:w,height:v,colors:a})),h(Ce,{data:l,country:s,countryData:e[s]})),Xt)}}dn();})();
