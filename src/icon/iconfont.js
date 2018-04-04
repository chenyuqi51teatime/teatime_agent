(function(window){var svgSprite='<svg><symbol id="icon-mima" viewBox="0 0 1024 1024"><path d="M798.362518 446.887027l-62.74095 0 0.188288-184.847985c0-109.983927-114.233718-199.095477-255.462253-199.095477-141.042293 0-255.462253 89.11155-255.462253 199.095477l-1.188058 184.847985-64.11525 0c-35.30611 0-62.49024 28.464285-62.49024 55.991222l-1.375324 399.971507c0 27.495214 29.933753 55.991222 65.240887 55.991222l638.905318 0c35.183314 0 62.364373-28.496008 62.364373-55.991222l1.375324-399.971507C863.602382 475.352335 833.545832 446.887027 798.362518 446.887027zM606.764805 446.887027 351.678106 446.887027 351.678106 254.915807c0-54.866608 58.366316-92.453668 128.669498-92.453668 70.364581 0 127.292128 37.586037 127.292128 92.453668L606.764805 446.887027z"  ></path></symbol><symbol id="icon-yonghu" viewBox="0 0 1024 1024"><path d="M501.041414 62.931285c125.654838 0 227.51269 100.19498 227.51269 223.775576 0 123.605156-101.856829 223.805252-227.51269 223.805252-125.650745 0-227.506551-100.199073-227.506551-223.805252C273.53384 163.097612 375.424438 62.931285 501.041414 62.931285L501.041414 62.931285 501.041414 62.931285zM501.041414 62.931285c125.654838 0 227.51269 100.19498 227.51269 223.775576 0 123.605156-101.856829 223.805252-227.51269 223.805252-125.650745 0-227.506551-100.199073-227.506551-223.805252C273.53384 163.097612 375.424438 62.931285 501.041414 62.931285L501.041414 62.931285 501.041414 62.931285zM415.730423 585.125461l189.629895 0c162.314783 0 293.880237 129.387859 293.880237 289.057395l0 18.622126c0 62.922075-131.593084 65.313541-293.880237 65.313541L415.730423 958.118524c-162.319899 0-293.880237-0.092098-293.880237-65.313541l0-18.622126C121.852232 714.51332 253.411547 585.125461 415.730423 585.125461L415.730423 585.125461 415.730423 585.125461z"  ></path></symbol><symbol id="icon-tanhao" viewBox="0 0 1060 1024"><path d="M535.116 48.552c-254.897 0-463.448 208.552-463.448 463.448s208.552 463.448 463.448 463.448c254.897 0 463.448-208.552 463.448-463.448 0-254.897-208.552-463.448-463.448-463.448v0M535.116 843.034c-36.413 0-66.207-29.793-66.207-66.207 0-36.413 29.793-66.207 66.207-66.207 36.413 0 66.207 29.793 66.207 66.207 0 36.413-29.793 66.207-66.207 66.207v0M621.185 343.172c0 0 0 3.31 0 0v0 0 0 0 0c0 3.31-56.276 264.828-56.276 264.828s3.31-19.862 0 0c-3.31 19.862-13.241 29.793-29.793 29.793-16.552 0-26.483-13.241-29.793-33.103-6.621-19.862-56.276-254.897-56.276-254.897 0 0 0 0 0 0v0c0 0 0 0 0 0v0 0c0 0 0 0 0 0v0 0 0c0 0 0 0 0 0v0c0 0 0 0 0 0s0 0 0 0v0c0 0 0 0 0 0v0 0 0 0 0 0 0c0 0 0 0 0 0 0-6.621-3.31-13.241-3.31-16.552 0-49.656 39.724-89.379 89.379-89.379 49.656 0 89.379 39.724 89.379 89.379 0 0-3.31 6.621-3.31 9.931v0M621.185 343.172z"  ></path></symbol><symbol id="icon-web__bitebiyoujiantou" viewBox="0 0 1024 1024"><path d="M552.18 353.31H65.583v325.46H552.18v183.778L960.744 512.06 552.18 161.576V353.31z m0 0"  ></path></symbol><symbol id="icon-shouye" viewBox="0 0 1024 1024"><path d="M422.63 891.821V623.712h178.74v268.109h223.424V534.342h134.054L512 132.179 65.152 534.342h134.054V891.82H422.63z"  ></path></symbol></svg>';var script=function(){var scripts=document.getElementsByTagName("script");return scripts[scripts.length-1]}();var shouldInjectCss=script.getAttribute("data-injectcss");var ready=function(fn){if(document.addEventListener){if(~["complete","loaded","interactive"].indexOf(document.readyState)){setTimeout(fn,0)}else{var loadFn=function(){document.removeEventListener("DOMContentLoaded",loadFn,false);fn()};document.addEventListener("DOMContentLoaded",loadFn,false)}}else if(document.attachEvent){IEContentLoaded(window,fn)}function IEContentLoaded(w,fn){var d=w.document,done=false,init=function(){if(!done){done=true;fn()}};var polling=function(){try{d.documentElement.doScroll("left")}catch(e){setTimeout(polling,50);return}init()};polling();d.onreadystatechange=function(){if(d.readyState=="complete"){d.onreadystatechange=null;init()}}}};var before=function(el,target){target.parentNode.insertBefore(el,target)};var prepend=function(el,target){if(target.firstChild){before(el,target.firstChild)}else{target.appendChild(el)}};function appendSvg(){var div,svg;div=document.createElement("div");div.innerHTML=svgSprite;svgSprite=null;svg=div.getElementsByTagName("svg")[0];if(svg){svg.setAttribute("aria-hidden","true");svg.style.position="absolute";svg.style.width=0;svg.style.height=0;svg.style.overflow="hidden";prepend(svg,document.body)}}if(shouldInjectCss&&!window.__iconfont__svg__cssinject__){window.__iconfont__svg__cssinject__=true;try{document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>")}catch(e){console&&console.log(e)}}ready(appendSvg)})(window)