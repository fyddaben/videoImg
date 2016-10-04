(function e(b,g,d){function c(m,j){if(!g[m]){if(!b[m]){var i=typeof require=="function"&&require;
if(!j&&i){return i(m,!0)}if(a){return a(m,!0)}var k=new Error("Cannot find module '"+m+"'");
throw k.code="MODULE_NOT_FOUND",k}var h=g[m]={exports:{}};b[m][0].call(h.exports,function(l){var o=b[m][1][l];
return c(o?o:l)},h,h.exports,e,b,g,d)}return g[m].exports}var a=typeof require=="function"&&require;
for(var f=0;f<d.length;f++){c(d[f])}return c})({1:[function(d,f,b){var g=d("./ac-browser/BrowserData");
var a=/applewebkit/i;var h=d("./ac-browser/IE");var c=g.create();c.isWebKit=function(i){var j=i||window.navigator.userAgent;
return j?!!a.test(j):false};c.lowerCaseUserAgent=navigator.userAgent.toLowerCase();
if(c.name==="IE"){c.IE={documentMode:h.getDocumentMode()}}f.exports=c},{"./ac-browser/BrowserData":2,"./ac-browser/IE":3}],2:[function(b,c,a){b("@marcom/ac-polyfills/Array/prototype.filter");
b("@marcom/ac-polyfills/Array/prototype.some");var d=b("./data");function f(){}f.prototype={__getBrowserVersion:function(h,i){var g;
if(!h||!i){return}var j=d.browser.filter(function(k){return k.identity===i});j.some(function(m){var k=m.versionSearch||i;
var l=h.indexOf(k);if(l>-1){g=parseFloat(h.substring(l+k.length+1));return true
}});return g},__getName:function(g){return this.__getIdentityStringFromArray(g)
},__getIdentity:function(g){if(g.string){return this.__matchSubString(g)}else{if(g.prop){return g.identity
}}},__getIdentityStringFromArray:function(g){for(var k=0,h=g.length,j;k<h;k++){j=this.__getIdentity(g[k]);
if(j){return j}}},__getOS:function(g){return this.__getIdentityStringFromArray(g)
},__getOSVersion:function(i,l){if(!i||!l){return}var k=d.os.filter(function(m){return m.identity===l
})[0];var g=k.versionSearch||l;var j=new RegExp(g+" ([\\d_\\.]+)","i");var h=i.match(j);
if(h!==null){return h[1].replace(/_/g,".")}},__matchSubString:function(h){var g=h.subString;
if(g){var i=g.test?!!g.test(h.string):h.string.indexOf(g)>-1;if(i){return h.identity
}}}};f.create=function(){var g=new f();var h={};h.name=g.__getName(d.browser);h.version=g.__getBrowserVersion(d.versionString,h.name);
h.os=g.__getOS(d.os);h.osVersion=g.__getOSVersion(d.versionString,h.os);return h
};c.exports=f},{"./data":4,"@marcom/ac-polyfills/Array/prototype.filter":45,"@marcom/ac-polyfills/Array/prototype.some":49}],3:[function(b,c,a){c.exports={getDocumentMode:function(){var d;
if(document.documentMode){d=parseInt(document.documentMode,10)}else{d=5;if(document.compatMode){if(document.compatMode==="CSS1Compat"){d=7
}}}return d}}},{}],4:[function(b,c,a){c.exports={browser:[{string:window.navigator.userAgent,subString:"Edge",identity:"Edge"},{string:window.navigator.userAgent,subString:"Chrome",identity:"Chrome"},{string:window.navigator.userAgent,subString:/silk/i,identity:"Silk"},{string:window.navigator.userAgent,subString:"OmniWeb",versionSearch:"OmniWeb/",identity:"OmniWeb"},{string:window.navigator.userAgent,subString:/mobile\/[^\s]*\ssafari\//i,identity:"Safari Mobile",versionSearch:"Version"},{string:window.navigator.vendor,subString:"Apple",identity:"Safari",versionSearch:"Version"},{prop:window.opera,identity:"Opera",versionSearch:"Version"},{string:window.navigator.vendor,subString:"iCab",identity:"iCab"},{string:window.navigator.vendor,subString:"KDE",identity:"Konqueror"},{string:window.navigator.userAgent,subString:"Firefox",identity:"Firefox"},{string:window.navigator.vendor,subString:"Camino",identity:"Camino"},{string:window.navigator.userAgent,subString:"Netscape",identity:"Netscape"},{string:window.navigator.userAgent,subString:"MSIE",identity:"IE",versionSearch:"MSIE"},{string:window.navigator.userAgent,subString:"Trident",identity:"IE",versionSearch:"rv"},{string:window.navigator.userAgent,subString:"Gecko",identity:"Mozilla",versionSearch:"rv"},{string:window.navigator.userAgent,subString:"Mozilla",identity:"Netscape",versionSearch:"Mozilla"}],os:[{string:window.navigator.platform,subString:"Win",identity:"Windows",versionSearch:"Windows NT"},{string:window.navigator.platform,subString:"Mac",identity:"OS X"},{string:window.navigator.userAgent,subString:"iPhone",identity:"iOS",versionSearch:"iPhone OS"},{string:window.navigator.userAgent,subString:"iPad",identity:"iOS",versionSearch:"CPU OS"},{string:window.navigator.userAgent,subString:/android/i,identity:"Android"},{string:window.navigator.platform,subString:"Linux",identity:"Linux"}],versionString:window.navigator.userAgent||window.navigator.appVersion||undefined}
},{}],5:[function(c,d,a){d.exports=function b(f){f=f||window.event;if(f.preventDefault){f.preventDefault()
}else{f.returnValue=false}}},{}],6:[function(b,c,a){c.exports=function d(i,g,h,f){if(i.addEventListener){i.addEventListener(g,h,!!f)
}else{i.attachEvent("on"+g,h)}return i}},{}],7:[function(b,c,a){c.exports=8},{}],8:[function(b,c,a){c.exports=11
},{}],9:[function(b,c,a){c.exports=9},{}],10:[function(b,c,a){c.exports=1},{}],11:[function(b,c,a){c.exports=3
},{}],12:[function(c,d,b){var f=c("./internal/validate");d.exports=function a(g,h){f.insertNode(g,true,"insertFirstChild");
f.parentNode(h,true,"insertFirstChild");if(!h.firstChild){return h.appendChild(g)
}return h.insertBefore(g,h.firstChild)}},{"./internal/validate":14}],13:[function(b,c,a){var d=b("../isNode");
c.exports=function f(h,g){if(!d(h)){return false}if(typeof g==="number"){return(h.nodeType===g)
}return(g.indexOf(h.nodeType)!==-1)}},{"../isNode":17}],14:[function(g,d,j){var b=g("./isNodeType");
var c=g("../COMMENT_NODE");var k=g("../DOCUMENT_FRAGMENT_NODE");var i=g("../ELEMENT_NODE");
var h=g("../TEXT_NODE");var m=[i,h,c,k];var f=" must be an Element, TextNode, Comment, or Document Fragment";
var p=[i,h,c];var l=" must be an Element, TextNode, or Comment";var n=[i,k];var o=" must be an Element, or Document Fragment";
var a=" must have a parentNode";d.exports={parentNode:function(q,t,s,r){r=r||"target";
if((q||t)&&!b(q,n)){throw new TypeError(s+": "+r+o)}},childNode:function(q,t,s,r){r=r||"target";
if(!q&&!t){return}if(!b(q,p)){throw new TypeError(s+": "+r+l)}},insertNode:function(q,t,s,r){r=r||"node";
if(!q&&!t){return}if(!b(q,m)){throw new TypeError(s+": "+r+f)}},hasParentNode:function(q,s,r){r=r||"target";
if(!q.parentNode){throw new TypeError(s+": "+r+a)}}}},{"../COMMENT_NODE":7,"../DOCUMENT_FRAGMENT_NODE":8,"../ELEMENT_NODE":10,"../TEXT_NODE":11,"./isNodeType":13}],15:[function(c,d,b){var g=c("./internal/isNodeType");
var a=c("./DOCUMENT_FRAGMENT_NODE");d.exports=function f(h){return g(h,a)}},{"./DOCUMENT_FRAGMENT_NODE":8,"./internal/isNodeType":13}],16:[function(c,d,b){var g=c("./internal/isNodeType");
var a=c("./ELEMENT_NODE");d.exports=function f(h){return g(h,a)}},{"./ELEMENT_NODE":10,"./internal/isNodeType":13}],17:[function(b,c,a){c.exports=function d(f){return !!(f&&f.nodeType)
}},{}],18:[function(c,d,b){var f=c("./internal/validate");d.exports=function a(g){f.childNode(g,true,"remove");
if(!g.parentNode){return g}return g.parentNode.removeChild(g)}},{"./internal/validate":14}],19:[function(b,d,a){var f=b("./internal/validate");
d.exports=function c(g,h){f.insertNode(g,true,"insertFirstChild","newNode");f.childNode(h,true,"insertFirstChild","oldNode");
f.hasParentNode(h,"insertFirstChild","oldNode");return h.parentNode.replaceChild(g,h)
}},{"./internal/validate":14}],20:[function(b,c,a){c.exports=window.Element?(function(d){return d.matches||d.matchesSelector||d.webkitMatchesSelector||d.mozMatchesSelector||d.msMatchesSelector||d.oMatchesSelector
}(Element.prototype)):null},{}],21:[function(g,c,i){g("@marcom/ac-polyfills/Array/prototype.indexOf");
var o=g("@marcom/ac-dom-nodes/isNode");var b=g("@marcom/ac-dom-nodes/COMMENT_NODE");
var k=g("@marcom/ac-dom-nodes/DOCUMENT_FRAGMENT_NODE");var j=g("@marcom/ac-dom-nodes/DOCUMENT_NODE");
var h=g("@marcom/ac-dom-nodes/ELEMENT_NODE");var f=g("@marcom/ac-dom-nodes/TEXT_NODE");
var a=function(r,q){if(!o(r)){return false}if(typeof q==="number"){return(r.nodeType===q)
}return(q.indexOf(r.nodeType)!==-1)};var m=[h,j,k];var n=" must be an Element, Document, or Document Fragment";
var p=[h,f,b];var l=" must be an Element, TextNode, or Comment";var d=" must be a string";
c.exports={parentNode:function(q,t,s,r){r=r||"node";if((q||t)&&!a(q,m)){throw new TypeError(s+": "+r+n)
}},childNode:function(q,t,s,r){r=r||"node";if(!q&&!t){return}if(!a(q,p)){throw new TypeError(s+": "+r+l)
}},selector:function(q,t,s,r){r=r||"selector";if((q||t)&&typeof q!=="string"){throw new TypeError(s+": "+r+d)
}}}},{"@marcom/ac-dom-nodes/COMMENT_NODE":7,"@marcom/ac-dom-nodes/DOCUMENT_FRAGMENT_NODE":8,"@marcom/ac-dom-nodes/DOCUMENT_NODE":9,"@marcom/ac-dom-nodes/ELEMENT_NODE":10,"@marcom/ac-dom-nodes/TEXT_NODE":11,"@marcom/ac-dom-nodes/isNode":17,"@marcom/ac-polyfills/Array/prototype.indexOf":47}],22:[function(d,f,c){var g=d("@marcom/ac-dom-nodes/isElement");
var i=d("./internal/validate");var a=d("./internal/nativeMatches");var h=d("./shims/matchesSelector");
f.exports=function b(k,j){i.selector(j,true,"matchesSelector");if(!g(k)){return false
}if(!a){return h(k,j)}return a.call(k,j)}},{"./internal/nativeMatches":20,"./internal/validate":21,"./shims/matchesSelector":26,"@marcom/ac-dom-nodes/isElement":16}],23:[function(c,d,b){var f=c("@marcom/ac-dom-nodes/isElement");
var a=c("./matchesSelector");var h=c("./internal/validate");d.exports=function g(j,i){h.childNode(j,true,"nextSibling");
h.selector(i,false,"nextSibling");if(j.nextElementSibling&&!i){return j.nextElementSibling
}while(j=j.nextSibling){if(f(j)){if(!i||a(j,i)){return j}}}return null}},{"./internal/validate":21,"./matchesSelector":22,"@marcom/ac-dom-nodes/isElement":16}],24:[function(c,d,a){var h=c("./internal/validate");
var b=c("./shims/querySelector");var g=("querySelector" in document);d.exports=function f(i,j){j=j||document;
h.parentNode(j,true,"querySelector","context");h.selector(i,true,"querySelector");
if(!g){return b(i,j)}return j.querySelector(i)}},{"./internal/validate":21,"./shims/querySelector":27}],25:[function(b,c,a){b("@marcom/ac-polyfills/Array/prototype.slice");
var h=b("./internal/validate");var g=b("./shims/querySelectorAll");var f=("querySelectorAll" in document);
c.exports=function d(i,j){j=j||document;h.parentNode(j,true,"querySelectorAll","context");
h.selector(i,true,"querySelectorAll");if(!f){return g(i,j)}return Array.prototype.slice.call(j.querySelectorAll(i))
}},{"./internal/validate":21,"./shims/querySelectorAll":28,"@marcom/ac-polyfills/Array/prototype.slice":48}],26:[function(c,d,b){var f=c("../querySelectorAll");
d.exports=function a(l,g){var k=l.parentNode||document;var h=f(g,k);var j;for(j=0;
j<h.length;j++){if(h[j]===l){return true}}return false}},{"../querySelectorAll":25}],27:[function(b,c,a){var d=b("./querySelectorAll");
c.exports=function f(h,i){var g=d(h,i);return g.length?g[0]:null}},{"./querySelectorAll":28}],28:[function(c,b,f){c("@marcom/ac-polyfills/Array/prototype.indexOf");
var j=c("@marcom/ac-dom-nodes/isElement");var h=c("@marcom/ac-dom-nodes/isDocumentFragment");
var k=c("@marcom/ac-dom-nodes/remove");var d="_ac_qsa_";var i=function(n,l){var m;
if(l===document){return true}m=n;while((m=m.parentNode)&&j(m)){if(m===l){return true
}}return false};var g=function(l){if("recalc" in l){l.recalc(false)}else{document.recalc(false)
}window.scrollBy(0,0)};b.exports=function a(l,n){var p=document.createElement("style");
var q=d+(Math.random()+"").slice(-6);var m=[];var o;n=n||document;document[q]=[];
if(h(n)){n.appendChild(p)}else{document.documentElement.firstChild.appendChild(p)
}p.styleSheet.cssText="*{display:recalc;}"+l+'{ac-qsa:expression(document["'+q+'"] && document["'+q+'"].push(this));}';
g(n);while(document[q].length){o=document[q].shift();o.style.removeAttribute("ac-qsa");
if(m.indexOf(o)===-1&&i(o,n)){m.push(o)}}document[q]=null;k(p);g(n);return m}},{"@marcom/ac-dom-nodes/isDocumentFragment":15,"@marcom/ac-dom-nodes/isElement":16,"@marcom/ac-dom-nodes/remove":18,"@marcom/ac-polyfills/Array/prototype.indexOf":47}],29:[function(b,c,a){c.exports=function d(g){var f;
return function(){if(typeof f==="undefined"){f=g.apply(this,arguments)}return f
}}},{}],30:[function(b,c,a){c.exports={getWindow:function(){return window},getDocument:function(){return document
},getNavigator:function(){return navigator}}},{}],31:[function(c,d,b){var g=c("./helpers/globals");
var f=c("@marcom/ac-function/once");function a(){var h=g.getDocument();return !!h.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image","1.1")
}d.exports=f(a);d.exports.original=a},{"./helpers/globals":30,"@marcom/ac-function/once":29}],32:[function(c,d,b){var g=c("./helpers/globals");
var f=c("@marcom/ac-function/once");function a(){var j=g.getWindow();var h=g.getDocument();
var i=g.getNavigator();return !!(("ontouchstart" in j)||(j.DocumentTouch&&h instanceof j.DocumentTouch)||(i.maxTouchPoints>0)||(i.msMaxTouchPoints>0))
}d.exports=f(a);d.exports.original=a},{"./helpers/globals":30,"@marcom/ac-function/once":29}],33:[function(b,c,a){var f=b("./extend");
c.exports=function d(h,g){if(typeof h!=="object"){throw new TypeError("defaults: must provide a defaults object")
}g=g||{};if(typeof g!=="object"){throw new TypeError("defaults: options must be a typeof object")
}return f({},h,g)}},{"./extend":34}],34:[function(c,d,b){c("@marcom/ac-polyfills/Array/prototype.forEach");
var a=Object.prototype.hasOwnProperty;d.exports=function f(){var h;var g;if(arguments.length<2){h=[{},arguments[0]]
}else{h=[].slice.call(arguments)}g=h.shift();h.forEach(function(j){if(j!=null){for(var i in j){if(a.call(j,i)){g[i]=j[i]
}}}});return g}},{"@marcom/ac-polyfills/Array/prototype.forEach":46}],35:[function(d,c,h){d("@marcom/ac-polyfills/Function/prototype.bind");
var f=d("@marcom/ac-object/defaults");var l=d("@marcom/ac-dom-traversal/querySelector");
var a=d("@marcom/ac-dom-traversal/querySelectorAll");var g=d("@marcom/ac-dom-traversal/nextSibling");
var j=d("./internal/CheckboxMenu");var b={className:"footer"};function k(n,m){m=f(b,m||{});
this.el=n;this._selectors={wrapper:"."+m.className,directory:m.directorySelector||"."+m.className+"-directory",mini:m.miniSelector||"."+m.className+"-mini"};
this._initializeDirectory();this._initializeLangLink()}var i=k.prototype;i._initializeDirectory=function(){this._directory=l(this._selectors.directory,this.el);
if(!this._directory){return}var p=a(this._selectors.directory+"-column-section-state",this.directory);
var q;var m;var o;for(var n=0;n<p.length;n++){q=g(p[n]);m=l(this._selectors.directory+"-column-section-anchor-open",q);
o=l(this._selectors.directory+"-column-section-anchor-close",q);j.create(p[n],m,o)
}};i._initializeLangLink=function(){var n;var o;var m;this._langLink=l(this._selectors.mini+"-locale-lang",this.el);
if(!this._langLink){return}n=window.location.pathname;o=this._langLink.getAttribute("data-locale-current");
m=this._langLink.pathname;if(n.indexOf(o)!==-1){n=n.replace(o,m);if(n.charAt(0)!=="/"){n="/"+n
}this._langLink.href=n}};c.exports=k},{"./internal/CheckboxMenu":36,"@marcom/ac-dom-traversal/nextSibling":23,"@marcom/ac-dom-traversal/querySelector":24,"@marcom/ac-dom-traversal/querySelectorAll":25,"@marcom/ac-object/defaults":33,"@marcom/ac-polyfills/Function/prototype.bind":51}],36:[function(d,f,b){d("@marcom/ac-polyfills/Function/prototype.bind");
var a=d("@marcom/ac-dom-events/utils/addEventListener");var c=d("@marcom/ac-dom-events/preventDefault");
function h(j,i,k){this.el=j;this.anchorOpen=i;this.anchorClose=k;this._lastOpen=this.el.checked;
a(this.el,"change",this.update.bind(this));a(this.anchorOpen,"click",this._anchorOpenClick.bind(this));
a(this.anchorClose,"click",this._anchorCloseClick.bind(this));if(window.location.hash==="#"+j.id){window.location.hash=""
}}h.create=function(j,i,k){return new h(j,i,k)};var g=h.prototype;g.update=function(){var i=this.isOpen();
if(i!==this._lastOpen){this._lastOpen=i}};g.isOpen=function(){return this.el.checked
};g.toggle=function(){if(this.isOpen()){this.close()}else{this.open()}};g.open=function(){if(!this.el.checked){this.el.checked=true;
this.update()}};g.close=function(){if(this.el.checked){this.el.checked=false;this.update()
}};g._anchorOpenClick=function(i){c(i);this.open();this.anchorClose.focus()};g._anchorCloseClick=function(i){c(i);
this.close();this.anchorOpen.focus()};f.exports=h},{"@marcom/ac-dom-events/preventDefault":5,"@marcom/ac-dom-events/utils/addEventListener":6,"@marcom/ac-polyfills/Function/prototype.bind":51}],37:[function(b,d,a){var g=b("@marcom/ac-classlist/add");
var h=b("@marcom/ac-classlist/remove");var i=b("@marcom/ac-object/extend");var c=function(j,k){this._target=j;
this._tests={};this.addTests(k)};var f=c.prototype;f.addTests=function(j){this._tests=i(this._tests,j||{})
};f._supports=function(j){if(typeof this._tests[j]==="undefined"){return false}if(typeof this._tests[j]==="function"){this._tests[j]=this._tests[j]()
}return this._tests[j]};f._addClass=function(k,j){j=j||"no-";if(this._supports(k)){g(this._target,k)
}else{g(this._target,j+k)}};f.htmlClass=function(){var j;h(this._target,"no-js");
g(this._target,"js");for(j in this._tests){if(this._tests.hasOwnProperty(j)){this._addClass(j)
}}};d.exports=c},{"@marcom/ac-classlist/add":38,"@marcom/ac-classlist/remove":43,"@marcom/ac-object/extend":44}],38:[function(b,c,a){b("@marcom/ac-polyfills/Array/prototype.slice");
b("@marcom/ac-polyfills/Element/prototype.classList");var d=b("./className/add");
c.exports=function f(){var j=Array.prototype.slice.call(arguments);var h=j.shift(j);
var g;if(h.classList&&h.classList.add){h.classList.add.apply(h.classList,j);return
}for(g=0;g<j.length;g++){d(h,j[g])}}},{"./className/add":39,"@marcom/ac-polyfills/Array/prototype.slice":48,"@marcom/ac-polyfills/Element/prototype.classList":50}],39:[function(b,c,a){var d=b("./contains");
c.exports=function f(h,g){if(!d(h,g)){h.className+=" "+g}}},{"./contains":40}],40:[function(b,c,a){var f=b("./getTokenRegExp");
c.exports=function d(h,g){return f(g).test(h.className)}},{"./getTokenRegExp":41}],41:[function(b,c,a){c.exports=function d(f){return new RegExp("(\\s|^)"+f+"(\\s|$)")
}},{}],42:[function(c,d,b){var f=c("./contains");var g=c("./getTokenRegExp");d.exports=function a(i,h){if(f(i,h)){i.className=i.className.replace(g(h),"$1").trim()
}}},{"./contains":40,"./getTokenRegExp":41}],43:[function(d,f,c){d("@marcom/ac-polyfills/Array/prototype.slice");
d("@marcom/ac-polyfills/Element/prototype.classList");var b=d("./className/remove");
f.exports=function a(){var j=Array.prototype.slice.call(arguments);var h=j.shift(j);
var g;if(h.classList&&h.classList.remove){h.classList.remove.apply(h.classList,j);
return}for(g=0;g<j.length;g++){b(h,j[g])}}},{"./className/remove":42,"@marcom/ac-polyfills/Array/prototype.slice":48,"@marcom/ac-polyfills/Element/prototype.classList":50}],44:[function(b,c,a){arguments[4][34][0].apply(a,arguments)
},{"@marcom/ac-polyfills/Array/prototype.forEach":46,dup:34}],45:[function(b,c,a){if(!Array.prototype.filter){Array.prototype.filter=function d(l,k){var j=Object(this);
var f=j.length>>>0;var h;var g=[];if(typeof l!=="function"){throw new TypeError(l+" is not a function")
}for(h=0;h<f;h+=1){if(h in j&&l.call(k,j[h],h,j)){g.push(j[h])}}return g}}},{}],46:[function(b,c,a){if(!Array.prototype.forEach){Array.prototype.forEach=function d(k,j){var h=Object(this);
var f;var g;if(typeof k!=="function"){throw new TypeError("No function object passed to forEach.")
}for(f=0;f<this.length;f+=1){g=h[f];k.call(j,g,f,h)}}}},{}],47:[function(b,c,a){if(!Array.prototype.indexOf){Array.prototype.indexOf=function d(g,h){var i=h||0;
var f=0;if(i<0){i=this.length+h-1;if(i<0){throw"Wrapped past beginning of array while looking up a negative start index."
}}for(f=0;f<this.length;f++){if(this[f]===g){return f}}return(-1)}}},{}],48:[function(b,c,a){(function(){var d=Array.prototype.slice;
try{d.call(document.documentElement)}catch(f){Array.prototype.slice=function(n,j){j=(typeof j!=="undefined")?j:this.length;
if(Object.prototype.toString.call(this)==="[object Array]"){return d.call(this,n,j)
}var l,h=[],k,g=this.length;var o=n||0;o=(o>=0)?o:g+o;var m=(j)?j:g;if(j<0){m=g+j
}k=m-o;if(k>0){h=new Array(k);if(this.charAt){for(l=0;l<k;l++){h[l]=this.charAt(o+l)
}}else{for(l=0;l<k;l++){h[l]=this[o+l]}}}return h}}}())},{}],49:[function(b,c,a){if(!Array.prototype.some){Array.prototype.some=function d(k,j){var g=Object(this);
var f=g.length>>>0;var h;if(typeof k!=="function"){throw new TypeError(k+" is not a function")
}for(h=0;h<f;h+=1){if(h in g&&k.call(j,g[h],h,g)===true){return true}}return false
}}},{}],50:[function(b,c,a){
/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/
if("document" in self){if(!("classList" in document.createElement("_"))){(function(n){if(!("Element" in n)){return
}var d="classList",j="prototype",q=n.Element[j],f=Object,o=String[j].trim||function(){return this.replace(/^\s+|\s+$/g,"")
},g=Array[j].indexOf||function(u){var t=0,s=this.length;for(;t<s;t++){if(t in this&&this[t]===u){return t
}}return -1},r=function(s,t){this.name=s;this.code=DOMException[s];this.message=t
},k=function(t,s){if(s===""){throw new r("SYNTAX_ERR","An invalid or illegal string was specified")
}if(/\s/.test(s)){throw new r("INVALID_CHARACTER_ERR","String contains an invalid character")
}return g.call(t,s)},h=function(w){var v=o.call(w.getAttribute("class")||""),u=v?v.split(/\s+/):[],t=0,s=u.length;
for(;t<s;t++){this.push(u[t])}this._updateClassName=function(){w.setAttribute("class",this.toString())
}},i=h[j]=[],m=function(){return new h(this)};r[j]=Error[j];i.item=function(s){return this[s]||null
};i.contains=function(s){s+="";return k(this,s)!==-1};i.add=function(){var w=arguments,v=0,t=w.length,u,s=false;
do{u=w[v]+"";if(k(this,u)===-1){this.push(u);s=true}}while(++v<t);if(s){this._updateClassName()
}};i.remove=function(){var x=arguments,w=0,t=x.length,v,s=false,u;do{v=x[w]+"";
u=k(this,v);while(u!==-1){this.splice(u,1);s=true;u=k(this,v)}}while(++w<t);if(s){this._updateClassName()
}};i.toggle=function(t,u){t+="";var s=this.contains(t),v=s?u!==true&&"remove":u!==false&&"add";
if(v){this[v](t)}if(u===true||u===false){return u}else{return !s}};i.toString=function(){return this.join(" ")
};if(f.defineProperty){var p={get:m,enumerable:true,configurable:true};try{f.defineProperty(q,d,p)
}catch(l){if(l.number===-2146823252){p.enumerable=false;f.defineProperty(q,d,p)
}}}else{if(f[j].__defineGetter__){q.__defineGetter__(d,m)}}}(self))}else{(function(){var f=document.createElement("_");
f.classList.add("c1","c2");if(!f.classList.contains("c2")){var g=function(i){var h=DOMTokenList.prototype[i];
DOMTokenList.prototype[i]=function(l){var k,j=arguments.length;for(k=0;k<j;k++){l=arguments[k];
h.call(this,l)}}};g("add");g("remove")}f.classList.toggle("c3",false);if(f.classList.contains("c3")){var d=DOMTokenList.prototype.toggle;
DOMTokenList.prototype.toggle=function(h,i){if(1 in arguments&&!this.contains(h)===!i){return i
}else{return d.call(this,h)}}}f=null}())}}},{}],51:[function(b,c,a){if(!Function.prototype.bind){Function.prototype.bind=function(d){if(typeof this!=="function"){throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable")
}var i=Array.prototype.slice.call(arguments,1);var h=this;var f=function(){};var g=function(){return h.apply((this instanceof f&&d)?this:d,i.concat(Array.prototype.slice.call(arguments)))
};f.prototype=this.prototype;g.prototype=new f();return g}}},{}],52:[function(c,d,b){if(!String.prototype.trim){String.prototype.trim=function a(){return this.replace(/^\s+|\s+$/g,"")
}}},{}],53:[function(b,c,a){b("@marcom/ac-polyfills/String/prototype.trim");var f=b("./ac-globalfooter/GlobalFooter");
var d=document.getElementById("ac-globalfooter");if(d){c.exports=new f(d)}},{"./ac-globalfooter/GlobalFooter":54,"@marcom/ac-polyfills/String/prototype.trim":52}],54:[function(c,b,d){c("@marcom/ac-polyfills/Function/prototype.bind");
var l=c("@marcom/ac-footer/Footer");var n=c("@marcom/ac-headjs/FeatureDetect");
var p=c("./featureDetectTests");var o=c("@marcom/ac-dom-traversal/querySelector");
var a=c("@marcom/ac-dom-traversal/querySelectorAll");var h=c("@marcom/ac-dom-events/utils/addEventListener");
var j=c("@marcom/ac-dom-events/preventDefault");var f=c("@marcom/ac-dom-nodes/insertFirstChild");
var i=c("@marcom/ac-dom-nodes/replace");var k=function(r){var q=new n(r,p);q.htmlClass();
l.call(this,r,{className:"ac-gf",miniSelector:".ac-gf-footer"});this._initializeBuyStrip();
this._initializeChatLink()};var m=l.prototype;var g=k.prototype=Object.create(m);
k.prototype.constructor=k;g._initializeBuyStrip=function(){var q;var r;this._buystrip=o(".ac-gf-buystrip");
if(!this._buystrip){return}q=a(".ac-gf-buystrip-info-content",this._buystrip);for(r=0;
r<q.length;r++){this._makeBlockLink(q[r])}};g._initializeChatLink=function(){var q;
if(this._buystrip){this._chatLink=o(".ac-gf-buystrip-info-cta-chat",this._buystrip);
if(this._chatLink){q=this._chatLink.parentNode;if(q.href){this._chatLink=q}this._onChatLinkClick=this._onChatLinkClick.bind(this);
h(this._chatLink,"click",this._onChatLinkClick)}}};g._onChatLinkClick=function(q){j(q);
window.open(this._chatLink.href,"chat","width=375,height=773")};g._makeBlockLink=function(r){var t;
var q;var u;var s;t=a("a",r);if(!t.length){return}t=t[0];u=document.createElement("a");
u.className="ac-gf-block";u.href=t.href;q=document.createElement("span");q.className=t.className+" ac-gf-block-link";
q.innerHTML=t.innerHTML;t.parentNode.className+=" with-cta";i(q,t);f(u,r);while(r.childNodes.length>1){s=r.childNodes[1];
if(s.href){break}u.appendChild(s)}};b.exports=k},{"./featureDetectTests":55,"@marcom/ac-dom-events/preventDefault":5,"@marcom/ac-dom-events/utils/addEventListener":6,"@marcom/ac-dom-nodes/insertFirstChild":12,"@marcom/ac-dom-nodes/replace":19,"@marcom/ac-dom-traversal/querySelector":24,"@marcom/ac-dom-traversal/querySelectorAll":25,"@marcom/ac-footer/Footer":35,"@marcom/ac-headjs/FeatureDetect":37,"@marcom/ac-polyfills/Function/prototype.bind":51}],55:[function(d,f,c){var g=d("@marcom/ac-browser");
var a=d("@marcom/ac-feature/touchAvailable");var b=d("@marcom/ac-feature/svgAvailable");
f.exports={touch:a,svg:b,ie7:(g.IE&&g.IE.documentMode===7),ie8:(g.IE&&g.IE.documentMode===8)}
},{"@marcom/ac-browser":1,"@marcom/ac-feature/svgAvailable":31,"@marcom/ac-feature/touchAvailable":32}]},{},[53]);