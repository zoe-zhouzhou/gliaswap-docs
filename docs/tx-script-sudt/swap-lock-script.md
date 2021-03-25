---
id: swap-lock-script
title: Swap Request Cell Lock Script
---

The script code stays same with [sUDT/CKB swap request cell lock script](../tx-script/swap-lock-script).

#### 1. Rule 1 - verifity if the actual pay amount and receive amount satisfy the request amount in swap request cell.

#### 2. Rule2 - If one of input cell in the transaction use user's lock specified in liquidity request cell args and the corresponding witness is not 0, unlock the request cell directly.
