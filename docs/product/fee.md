---
id: fee
title: Fee Structure
---

#### Traders

* Swap Ethereum assets to CKB 
  * 0.3% swap fee paid in Ethereum assets
  * 0 crosschain fee
  * 0 tip fee 
* Swap CKB to sUDT
  * 0.3% swap fee paid in CKB
  * 0 tip fee
* Swap sUDT to CKB
  * 0.3% swap fee paid in sUDT
  * 0 tip fee
* Swap Ethereum asset to its mirror asset on Nervos
  * 0 crosschain fee
* Swap Ethereum mirror asset back to Ethereum
  * 0.1% crosschain fee

#### LPs

The 0.3% swapping fees from traders are immediately deposited into liquidity reserves. This fee is split by liquidity providers proportional to their contribution to liquidity reserves. There are no platform fees.

#### Aggregators

Aggregators collect tip fees claimed in swap request and liquidity request. In the first version, all the tip fees are st to 0. Gliaswap will run a fee-matching aggregator.

#### Cross-chain relayer

Cross-chain relayer collect the cross-chain fee claimed in swap request. In the first version, relay only charge a 0.1% crosschain fee when user want to cross mirror assets back to Ethereum.
