---
id: swap-tx
sidebar_label: Swap
title: Swap Transaction Structure
---

A swap operation might be involved in 3 transactions:

1. Traders submit swap request
2. Aggregators match swap request with pool to help traders to complete swap
3. Traders cancel swap request

## 1. Traders submit swap request

```

any_free_ckb_cell    ------->    swap_request_cell

```

## 2. Deal-miners match swap request with pool cells

After traders submit the swap request, Aggregators will help traders to complete the swap. Motivated by the Tip fee claimed in the swap request cell (tip fee currently is 0), aggregators will continually retrieve the swap request cells and the pool cells on chain and then compete to match them off-chain and submit matching transactions. We open sourced a simple aggregators software for basic use. Information on how to deploy it can be found on [GitHub](https://github.com/glias/glia-sudt-swap-matcher). This software is a starting point for you to develop your own solution. You can maximize earnings by identifying and implementing your optimization strategies.

The matching transaction may looks like:

```
info_in_cell                            info_out_cell
pool_x_in_cell                          pool_x_out_cell
pool_y_in_cell                          pool_y_out_cell
                          ------->
matcher_in_cell                         matcher_out_ckb_cell

[swap_request_cell]                     [sudt_swapped_cell
                                       + ckb_change_cell]

[ add_liquidity_x_cell                  [sudt_lp_cell
+ add_liquidity_y_cell                 + sudt_change_cell
                                       + ckb_change_cell]

[remove_liquidity_cell]                 [sudt_x_cell
                                       + sudt_y_cell]

```   

In this transaction, three types of script will be run to verify the tx:

### Swap request lock script - rule 1

Rule 1 - verifity if the actual pay amount and receive amount satisfy the request amount in swap request cell.


### Info type script

Rule 1 - [TypeID rules](https://github.com/nervosnetwork/ckb/blob/master/script/src/type_id.rs)

Rule 2 - If this is a matching transaction, the cell sequence in this tx should follow the rules above.

Rule 3 - Intercept the swap request queue from inputs and outputs, and for each request cell，verifity if the actual pay amount and receive amount satisfy the request amount in swap request cell. And update the sudt_x_reserve and sudt_y_reserve for following verification.

### Info lock script

Rules 1 - Verify if lock.args is consistent with info type

## 3. Traders can cancel their own swap request

```

swap_request_cell   ------->    sUDT normal_cell 

```

This transaction leads to another rule of swap request lock script

### Swap request lock script - rule 2

Rule2 - If one of input cell in the transaction use user's lock specified in liquidity request cell args and the corresponding witness is not 0, unlock the request cell directly.
