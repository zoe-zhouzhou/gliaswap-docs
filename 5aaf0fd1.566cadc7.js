(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{106:function(e,t,a){"use strict";a.d(t,"a",(function(){return u})),a.d(t,"b",(function(){return w}));var n=a(0),r=a.n(n);function o(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function i(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function l(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?i(Object(a),!0).forEach((function(t){o(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):i(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},o=Object.keys(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var c=r.a.createContext({}),p=function(e){var t=r.a.useContext(c),a=t;return e&&(a="function"==typeof e?e(t):l(l({},t),e)),a},u=function(e){var t=p(e.components);return r.a.createElement(c.Provider,{value:t},e.children)},b={inlineCode:"code",wrapper:function(e){var t=e.children;return r.a.createElement(r.a.Fragment,{},t)}},d=r.a.forwardRef((function(e,t){var a=e.components,n=e.mdxType,o=e.originalType,i=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),u=p(a),d=n,w=u["".concat(i,".").concat(d)]||u[d]||b[d]||o;return a?r.a.createElement(w,l(l({ref:t},c),{},{components:a})):r.a.createElement(w,l({ref:t},c))}));function w(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var o=a.length,i=new Array(o);i[0]=d;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:n,i[1]=l;for(var c=2;c<o;c++)i[c]=a[c];return r.a.createElement.apply(null,i)}return r.a.createElement.apply(null,a)}d.displayName="MDXCreateElement"},80:function(e,t,a){"use strict";a.r(t),a.d(t,"frontMatter",(function(){return i})),a.d(t,"metadata",(function(){return l})),a.d(t,"toc",(function(){return s})),a.d(t,"default",(function(){return p}));var n=a(3),r=a(7),o=(a(0),a(106)),i={id:"intro",title:"Introduction",sidebar_label:"Introduction",slug:"/"},l={unversionedId:"start/intro",id:"start/intro",isDocsHomePage:!1,title:"Introduction",description:"What is Gliaswap?",source:"@site/docs/start/intro.md",slug:"/",permalink:"/gliaswap-docs/docs/",editUrl:"https://github.com/facebook/docusaurus/edit/master/website/docs/start/intro.md",version:"current",sidebar_label:"Introduction",sidebar:"docs",next:{title:"Cell Structure",permalink:"/gliaswap-docs/docs/tx-script/cell"}},s=[{value:"What is Gliaswap?",id:"what-is-gliaswap",children:[]},{value:"Why Gliaswap?",id:"why-gliaswap",children:[]},{value:"What can I do with Gliaswap?",id:"what-can-i-do-with-gliaswap",children:[{value:"As a trader",id:"as-a-trader",children:[]},{value:"As a LP",id:"as-a-lp",children:[]},{value:"As a Aggregator",id:"as-a-aggregator",children:[]}]}],c={toc:s};function p(e){var t=e.components,a=Object(r.a)(e,["components"]);return Object(o.b)("wrapper",Object(n.a)({},c,a,{components:t,mdxType:"MDXLayout"}),Object(o.b)("h2",{id:"what-is-gliaswap"},"What is Gliaswap?"),Object(o.b)("p",null,"Gliaswap is a AMM DEX on Nervos, designed for multi-chain assets swap."),Object(o.b)("p",null,"Gliaswap adopted Glia Protocol, which is an open protocol for decentralized exchange on the Nervos blockchain. You can swap your cryptocurrencies, while you can also be an automated liquidity provider to earn trade fees on Gliaswap. And the most special on Gliaswap, we do not have a centralized matching contract or parties, so anyone can be a aggregator. Simply install a matching software, then you can start to gain risk-free profit by collecting trade fees."),Object(o.b)("p",null,"There is one magic thing that Gliaswap is able to run in Ethereum wallet although it is a Dapp on Nervos. Powered by pw-sdk, you can directly connect your existing Ethereum Wallet on Gliaswap instead of installing a Nervos exclusive wallet. And Gliaswap operates in a non-custodial manner which only works as a user-interface to help people assemble transactions. You as a user on Gliaswap will totally control your assets and trade freely."),Object(o.b)("p",null,"And most importantly, Gliaswap also supports one-step cross-chain swaps between Ethereum and CKB which means you only need to sign once when trading your ETH to CKB. This works in a decentralized way with the help of Force Bridge cross-chain protocol. Imagine how magic it is, just connect your Metamask on Gliaswap, and you can use your ETH to buy CKB in one trade!"),Object(o.b)("h2",{id:"why-gliaswap"},"Why Gliaswap?"),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},Object(o.b)("p",{parentName:"li"},"Gliaswap can supports many mainstream wallets built specially for the other chain, including all kinds of Ethereum Wallets, Tron Wallets and so on. Currently, Gliaswap supports several Ethereum wallets below and we are actively working on more wallets.")),Object(o.b)("li",{parentName:"ul"},Object(o.b)("p",{parentName:"li"},"You can use your ETH to buy CKB in one transaction. Of course, not only ETH.")),Object(o.b)("li",{parentName:"ul"},Object(o.b)("p",{parentName:"li"},"All permissionless."))),Object(o.b)("h2",{id:"what-can-i-do-with-gliaswap"},"What can I do with Gliaswap?"),Object(o.b)("h3",{id:"as-a-trader"},"As a trader"),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},Object(o.b)("p",{parentName:"li"},"You can use ETH assets to buy CKB assets in one transaction")),Object(o.b)("li",{parentName:"ul"},Object(o.b)("p",{parentName:"li"},"You can trade CKB assets freely")),Object(o.b)("li",{parentName:"ul"},Object(o.b)("p",{parentName:"li"},"You can cross your ETH assets to Nervos "))),Object(o.b)("h3",{id:"as-a-lp"},"As a LP"),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},Object(o.b)("p",{parentName:"li"},"You can create a pool with their own tokens")),Object(o.b)("li",{parentName:"ul"},Object(o.b)("p",{parentName:"li"},"You can earn profit by providing liquidity"))),Object(o.b)("h3",{id:"as-a-aggregator"},"As a Aggregator"),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},"You can earn profit by matching trades' request with pool")))}p.isMDXComponent=!0}}]);