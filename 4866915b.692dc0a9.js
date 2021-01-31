(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{107:function(e,t,r){"use strict";r.d(t,"a",(function(){return u})),r.d(t,"b",(function(){return d}));var n=r(0),a=r.n(n);function i(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function c(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){i(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var l=a.a.createContext({}),p=function(e){var t=a.a.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):c(c({},t),e)),r},u=function(e){var t=p(e.components);return a.a.createElement(l.Provider,{value:t},e.children)},b={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},f=a.a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,i=e.originalType,o=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),u=p(r),f=n,d=u["".concat(o,".").concat(f)]||u[f]||b[f]||i;return r?a.a.createElement(d,c(c({ref:t},l),{},{components:r})):a.a.createElement(d,c({ref:t},l))}));function d(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var i=r.length,o=new Array(i);o[0]=f;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c.mdxType="string"==typeof e?e:n,o[1]=c;for(var l=2;l<i;l++)o[l]=r[l];return a.a.createElement.apply(null,o)}return a.a.createElement.apply(null,r)}f.displayName="MDXCreateElement"},79:function(e,t,r){"use strict";r.r(t),r.d(t,"frontMatter",(function(){return o})),r.d(t,"metadata",(function(){return c})),r.d(t,"toc",(function(){return s})),r.d(t,"default",(function(){return p}));var n=r(3),a=r(7),i=(r(0),r(107)),o={id:"fee",title:"Fee Structure"},c={unversionedId:"product/fee",id:"product/fee",isDocsHomePage:!1,title:"Fee Structure",description:"Traders",source:"@site/docs/product/fee.md",slug:"/product/fee",permalink:"/gliaswap-docs/docs/product/fee",editUrl:"https://github.com/facebook/docusaurus/edit/master/website/docs/product/fee.md",version:"current",sidebar:"docs",previous:{title:"Gliaswap Overview",permalink:"/gliaswap-docs/docs/product/overview"},next:{title:"Cell Structure",permalink:"/gliaswap-docs/docs/tx-script/cell"}},s=[],l={toc:s};function p(e){var t=e.components,r=Object(a.a)(e,["components"]);return Object(i.b)("wrapper",Object(n.a)({},l,r,{components:t,mdxType:"MDXLayout"}),Object(i.b)("h4",{id:"traders"},"Traders"),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},"Swap Ethereum assets to CKB ",Object(i.b)("ul",{parentName:"li"},Object(i.b)("li",{parentName:"ul"},"0.3% swap fee paid in Ethereum assets"),Object(i.b)("li",{parentName:"ul"},"0 crosschain fee"),Object(i.b)("li",{parentName:"ul"},"0 tip fee "))),Object(i.b)("li",{parentName:"ul"},"Swap CKB to sUDT",Object(i.b)("ul",{parentName:"li"},Object(i.b)("li",{parentName:"ul"},"0.3% swap fee paid in CKB"),Object(i.b)("li",{parentName:"ul"},"0 tip fee"))),Object(i.b)("li",{parentName:"ul"},"Swap sUDT to CKB",Object(i.b)("ul",{parentName:"li"},Object(i.b)("li",{parentName:"ul"},"0.3% swap fee paid in sUDT"),Object(i.b)("li",{parentName:"ul"},"0 tip fee"))),Object(i.b)("li",{parentName:"ul"},"Swap Ethereum asset to its mirror asset on Nervos",Object(i.b)("ul",{parentName:"li"},Object(i.b)("li",{parentName:"ul"},"0 crosschain fee"))),Object(i.b)("li",{parentName:"ul"},"Swap Ethereum mirror asset back to Ethereum",Object(i.b)("ul",{parentName:"li"},Object(i.b)("li",{parentName:"ul"},"0.1% crosschain fee")))),Object(i.b)("h4",{id:"lps"},"LPs"),Object(i.b)("p",null,"The 0.3% swapping fees from traders are immediately deposited into liquidity reserves. This fee is split by liquidity providers proportional to their contribution to liquidity reserves. There are no platform fees."),Object(i.b)("h4",{id:"aggregators"},"Aggregators"),Object(i.b)("p",null,"Aggregators collect tip fees claimed in swap request and liquidity request. In the first version, all the tip fees are st to 0. Gliaswap will run a fee-matching aggregator."),Object(i.b)("h4",{id:"cross-chain-relayer"},"Cross-chain relayer"),Object(i.b)("p",null,"Cross-chain relayer collect the cross-chain fee claimed in swap request. In the first version, relay only charge a 0.1% crosschain fee when user want to cross mirror assets back to Ethereum."))}p.isMDXComponent=!0}}]);