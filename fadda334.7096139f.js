(window.webpackJsonp=window.webpackJsonp||[]).push([[33],{101:function(e,t,a){"use strict";a.r(t),a.d(t,"frontMatter",(function(){return l})),a.d(t,"metadata",(function(){return i})),a.d(t,"toc",(function(){return s})),a.d(t,"default",(function(){return p}));var n=a(3),r=a(7),o=(a(0),a(107)),l={id:"faq",title:"FAQ",sidebar_label:"FAQ"},i={unversionedId:"ref/faq",id:"ref/faq",isDocsHomePage:!1,title:"FAQ",description:"Wallet",source:"@site/docs/ref/faq.md",slug:"/ref/faq",permalink:"/gliaswap-docs/docs/ref/faq",editUrl:"https://github.com/facebook/docusaurus/edit/master/website/docs/ref/faq.md",version:"current",sidebar_label:"FAQ",sidebar:"docs",previous:{title:"Liquidity Request Cell Lock Script",permalink:"/gliaswap-docs/docs/tx-script/liquidity-lock-script"}},s=[{value:"Wallet",id:"wallet",children:[{value:"What wallets are supported on Gliaswap?",id:"what-wallets-are-supported-on-gliaswap",children:[]},{value:"Do I need to deposit my assets into Gliaswap?",id:"do-i-need-to-deposit-my-assets-into-gliaswap",children:[]},{value:"How do I get Test Token so I can start trading?",id:"how-do-i-get-test-token-so-i-can-start-trading",children:[]}]},{value:"Swap",id:"swap",children:[{value:"Why lock my addtional CKB when I make a swap?",id:"why-lock-my-addtional-ckb-when-i-make-a-swap",children:[]}]}],c={toc:s};function p(e){var t=e.components,a=Object(r.a)(e,["components"]);return Object(o.b)("wrapper",Object(n.a)({},c,a,{components:t,mdxType:"MDXLayout"}),Object(o.b)("h2",{id:"wallet"},"Wallet"),Object(o.b)("h3",{id:"what-wallets-are-supported-on-gliaswap"},"What wallets are supported on Gliaswap?"),Object(o.b)("p",null,"Although it is a Dapp on CKB, powered by ",Object(o.b)("a",Object(n.a)({parentName:"p"},{href:"https://github.com/lay2dev/pw-core"}),"pw-core"),", Gliaswap can supports many mainstream wallets built specially for the other chain, including all kinds of Ethereum Wallets, Tron Wallets and so on. "),Object(o.b)("p",null,"Currently, Gliaswap supports several Ethereum wallets below and we are actively working on more wallets."),Object(o.b)("p",null,Object(o.b)("a",Object(n.a)({parentName:"p"},{href:"https://metamask.io/"}),"MetaMask"),"- A desktop wallet that allows you to manage your tokens via a convenient browser extension. Learn how to install MetaMask and create a wallet ",Object(o.b)("a",Object(n.a)({parentName:"p"},{href:"https://metamask.zendesk.com/hc/en-us/articles/360015489531-Getting-Started-With-MetaMask-Part-1-"}),"here"),"."),Object(o.b)("p",null,Object(o.b)("a",Object(n.a)({parentName:"p"},{href:"https://walletconnect.org/"}),"WalletConnect")," - WalletConnect allows you to use Gliaswap with a growing list of mobile wallets, including imToken, Trust Wallet, and MetaMask Mobile. Go ",Object(o.b)("a",Object(n.a)({parentName:"p"},{href:"https://walletconnect.org/wallets/"}),"here")," for the full list of WalletConnect-integrated wallets."),Object(o.b)("h3",{id:"do-i-need-to-deposit-my-assets-into-gliaswap"},"Do I need to deposit my assets into Gliaswap?"),Object(o.b)("p",null,"Short answer: No you don't!"),Object(o.b)("p",null,"Gliaswap operates in a non-custodial manner which means that you trade directly from your wallet. We do not require you to deposit your assets into a third party as would happen when using a centralized exchange, such as Binance or Coinbase."),Object(o.b)("p",null,"On Gliaswap, just connect the wallets and enjoy the free trade!"),Object(o.b)("h3",{id:"how-do-i-get-test-token-so-i-can-start-trading"},"How do I get Test Token so I can start trading?"),Object(o.b)("p",null,"You can get some Test Token from ",Object(o.b)("a",Object(n.a)({parentName:"p"},{href:"https://gliaswap-faucet.ckbapp.dev/"}),"Gliaswap Testnet"),"."),Object(o.b)("h2",{id:"swap"},"Swap"),Object(o.b)("h3",{id:"why-lock-my-addtional-ckb-when-i-make-a-swap"},"Why lock my addtional CKB when I make a swap?"),Object(o.b)("p",null,'When you try to make a swap, you will see a notion in review pages about "Placing this order will addtional lock you ** CKB". '),Object(o.b)("p",null,"Don't worry, these CKB are not used to pay for any fees or transfered to any third pairties. These CKB are only used to host the request cell you are submitting on chain, and after the swap is completed or canceled, these CKB will be back to your wallet.  "))}p.isMDXComponent=!0},107:function(e,t,a){"use strict";a.d(t,"a",(function(){return u})),a.d(t,"b",(function(){return w}));var n=a(0),r=a.n(n);function o(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?l(Object(a),!0).forEach((function(t){o(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},o=Object.keys(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var c=r.a.createContext({}),p=function(e){var t=r.a.useContext(c),a=t;return e&&(a="function"==typeof e?e(t):i(i({},t),e)),a},u=function(e){var t=p(e.components);return r.a.createElement(c.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.a.createElement(r.a.Fragment,{},t)}},b=r.a.forwardRef((function(e,t){var a=e.components,n=e.mdxType,o=e.originalType,l=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),u=p(a),b=n,w=u["".concat(l,".").concat(b)]||u[b]||d[b]||o;return a?r.a.createElement(w,i(i({ref:t},c),{},{components:a})):r.a.createElement(w,i({ref:t},c))}));function w(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var o=a.length,l=new Array(o);l[0]=b;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:n,l[1]=i;for(var c=2;c<o;c++)l[c]=a[c];return r.a.createElement.apply(null,l)}return r.a.createElement.apply(null,a)}b.displayName="MDXCreateElement"}}]);