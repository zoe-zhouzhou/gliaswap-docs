---
id: pool-tx
sidebar_label: Pool
title: Pool transaction structure
---

In pool page，when Liquidity Providers（LPs) mananger their liquidity, 5 types of transaction may be involved:

1. Anyone can creat a pool
2. Liquidity Providers（LPs) submit add liquidity request
3. Liquidity Providers（LPs) submit remove liquidity request
4. Aggregators match liquidity request with pool to help LP to manager their liquidity sucessfully
5. Liquidity Providers（LPs) cancel liquidity request

## 1. Creat a pool

Creat a pool actually is to creat info cell and pool cell: 
* info cell used to store pool info, including reserve balance, Liquidity token balance and other ID info to indentify the pool
* pool cell used to store the real asset

```
                                 info_cell
any_free_ckb_cell    ------->    pool_x_cell
                                 pool_y_cell
                                 change_cell
```
In this transaction,  Only info type script will be run to verify the tx.

### Info type script

Rule 4 - If this is a creating pool transaction, verify that two Pool cells is created at the same time as the Info cell, and that the data filled in info cell and pool cell are correct.

## 2. LPs submit add liquidity request

If a LP want to add liqidity to a pool, he/she needs to submit a add liquidity request firstly. For example，Alice want to add M CKB and N sUDT_A to pool:

```

sUDT_A normal_cell   ------->   sUDT_A liquidity_request_cell
sUDT_B normal_cell              sUDT_B liquidity_request_cell

```

Notice that this transaction only validates regular SUDT rules constrained in sudt type script.

## 3. LPs submit remove liquidity request

If a LP want to remove liquidity from a pool, he/she needs to submit a remove liquidity request firstly. For example，Bob want to burn L Liquidity token and withdraw the 

```
Bob liquidity token cell   ---->   Bob remove liquidity request cell    
```

Notice that this transaction only validates regular SUDT rules constrained in sudt type script.

## 4. Aggregators match liquidity request with pool 

Motivated by the Tip fee claimed in the liquidity request cell, aggregators will continually retrieve the liquidity request cells（including add liquidity request and remove liquidity request） and the pool cells and then compete to match them off-chain and submit matching transactions.

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

In this transaction, four types of script will be run to verify the tx:

### Info type script 

Rule 5 - If this is initially adding liquidity, verify if minting the correct amount Liquidity token for user, and verify if the data storaged in info cell and pool cell is correct.

Rule 6 - Intercept the liquidity request queue from inputs and outputs, and for each request cell，verifity if the actual pay amount and receive amount satisfy the request amount in the request cell. And update the sudt_x_reserve and sudt_y_reserve for following verification.

* If it is add liquidity request cell, verify if minting the correct amount Liquidity token for user, and add up the sUDT amount and Liquidity token amount for verifying info cell and pool cell later.
* If it is remove liquidity request cell, verify if withdraw the correct sudt amount for user, update the sUDT amount and Liquidity token amount for verifying info cell and pool cell later.
* Verify if the data changed in info cell and pool cell is correct 

### Info lock script

 Rules 1 - Verify if lock.args is consistent with info type and pool info 

### Liquidity request lock script

Rule 1 - verifity input index[1] is info cell

```
// First input cell must be info cell
let info_type_hash = self.lock.args[57..89]
if inputs[0].type_hash[0..32] == info_type_hash
    return success

reuturn fail
```

### sUDT type script

[sUDT proposal](https://talk.nervos.org/t/rfc-simple-udt-draft-spec/4333)


## 5. LPs can cancel their own liquidity request

Normally your will add liquidity or remove liquidity successfully soon after you submit the liquidity request, but if the price fluctuates above the slippage, your request will be pending until the pool price fluctuates back to the price you submitted.

So we provide the cancel option for LPs. LPs can send a transaction to cancel their own liquidity request.

For example, if Bob want to cancel his remove liqidity request:

```
Bob remove liquidity request cell    ---->   Bob liquidity token cell

```

This transaction leads to another rule of LIQUIDITY_REQ_LOCK

### Liquidity request lock script

Rule 2 - If one of input cell in the transaction use user's lock specified in liquidity request cell args and the corresponding witness is not 0, unlock the request cell directly.


