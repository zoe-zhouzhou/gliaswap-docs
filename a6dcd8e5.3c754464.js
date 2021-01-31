(window.webpackJsonp=window.webpackJsonp||[]).push([[24],{107:function(e,t,n){"use strict";n.d(t,"a",(function(){return p})),n.d(t,"b",(function(){return y}));var r=n(0),i=n.n(r);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function u(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var s=i.a.createContext({}),l=function(e){var t=i.a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},p=function(e){var t=l(e.components);return i.a.createElement(s.Provider,{value:t},e.children)},f={inlineCode:"code",wrapper:function(e){var t=e.children;return i.a.createElement(i.a.Fragment,{},t)}},d=i.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,a=e.parentName,s=u(e,["components","mdxType","originalType","parentName"]),p=l(n),d=r,y=p["".concat(a,".").concat(d)]||p[d]||f[d]||o;return n?i.a.createElement(y,c(c({ref:t},s),{},{components:n})):i.a.createElement(y,c({ref:t},s))}));function y(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,a=new Array(o);a[0]=d;var c={};for(var u in t)hasOwnProperty.call(t,u)&&(c[u]=t[u]);c.originalType=e,c.mdxType="string"==typeof e?e:r,a[1]=c;for(var s=2;s<o;s++)a[s]=n[s];return i.a.createElement.apply(null,a)}return i.a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},92:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return a})),n.d(t,"metadata",(function(){return c})),n.d(t,"toc",(function(){return u})),n.d(t,"default",(function(){return l}));var r=n(3),i=n(7),o=(n(0),n(107)),a={id:"swap-lock-script",title:"Swap Request Cell Lock Script"},c={unversionedId:"tx-script/swap-lock-script",id:"tx-script/swap-lock-script",isDocsHomePage:!1,title:"Swap Request Cell Lock Script",description:"1. Rule 1 - verifity if the actual pay amount and receive amount satisfy the request amount in swap request cell.",source:"@site/docs/tx-script/swap-lock-script.md",slug:"/tx-script/swap-lock-script",permalink:"/gliaswap-docs/docs/tx-script/swap-lock-script",editUrl:"https://github.com/facebook/docusaurus/edit/master/website/docs/tx-script/swap-lock-script.md",version:"current",sidebar:"docs",previous:{title:"Info Cell Lock Script",permalink:"/gliaswap-docs/docs/tx-script/info-lock-script"},next:{title:"Liquidity Request Cell Lock Script",permalink:"/gliaswap-docs/docs/tx-script/liquidity-lock-script"}},u=[],s={toc:u};function l(e){var t=e.components,n=Object(i.a)(e,["components"]);return Object(o.b)("wrapper",Object(r.a)({},s,n,{components:t,mdxType:"MDXLayout"}),Object(o.b)("h4",{id:"1-rule-1---verifity-if-the-actual-pay-amount-and-receive-amount-satisfy-the-request-amount-in-swap-request-cell"},"1. Rule 1 - verifity if the actual pay amount and receive amount satisfy the request amount in swap request cell."),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{}),"let pool = inputs[1]\nfor order in group_inputs[..] // QueryIter::new(load_input, Source::GroupInput).collect()\n  let order = inputs[order_index_in_inputs]\n  let output = outputs[order_index_in_inputs]\n\n  let user_lock_hash = order.lock.args[0..32]\n  let amount_in = BigUint::from(order.lock.args[33..49])\n  let min_amount_out = BigUint::from(order.lock.args[49..65])\n  let order_type = order.lcok.args[65..66]\n\n  if output.lock_hash != user_lock_hash\n      return fail\n  if amount_in == 0\n      return fail\n\n  if order_type == SellCKB\n      if output.type_hash != pool.type_hash\n          return fail\n\n      if order.capacity <= output.capacity\n          || order.capacity - output.capacity != amount_in\n          return fail\n\n      if output.data.sudt_amount < min_amount_out\n          return fail\n  else if order_type == BuyCKB\n      if output.type_hash.is_some()\n          return fail\n\n      if output.capacity < order.capacity + min_amount_out\n          return fail\n\n      if output.data.size != 0\n          return fail\n  else\n      return fail\n  fi\nendfor\n")),Object(o.b)("h4",{id:"2-rule2---if-one-of-input-cell-in-the-transaction-use-users-lock-specified-in-liquidity-request-cell-args-and-the-corresponding-witness-is-not-0-unlock-the-request-cell-directly"},"2. Rule2 - If one of input cell in the transaction use user's lock specified in liquidity request cell args and the corresponding witness is not 0, unlock the request cell directly."),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{}),"let user_lock_hash = self.lock.args[0..32]\nif one_of(input.lock_hash) == user_lock_hash\n    // Check witness for anyone can pay lock compatibility\n    let witness = load_witness_args(this_lock_index, Source::Input).unwrap()\n    if witness.total_size() != 0\n        return success\n")))}l.isMDXComponent=!0}}]);