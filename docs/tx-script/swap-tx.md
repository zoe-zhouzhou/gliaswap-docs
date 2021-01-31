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

(1) When using CKB to buy sUDT,  a swap request transaction may looks like the following:

```
Inputs:
    User's Normal cell
        Capacity:
             <X + 146 + tx fee>
        Data:
            null
        Type
            null
        Lock
            <user's lock>
        
Outputs:
    Swap Request Cell
        Capacity:
             <X + 146>
        Data:
            null
        Type:
            null 
        Lock:
            code_hash: order lock script
            args: user_lock_hash | version | min_amount_out: Y | sudt_type_hash | 0 | 0|
```

* X = Pay is the CKB amount users need to pay, including the 0.3% trading fees
* Y = Receive(1-s) is the sUDT minimum amount user will receive. s is the sliapage rate users set by themselves.
* They satisfy this formula: Receive = 997 * Pay * Rr/ (997 * Pay + 1000 * Pr)，Rr is Receive asset reserve ，Pr is Pay asset reserve 。

(2) When using Y sUDT to buy X CKB at P price, a swap request transaction may looks like the following:

```
Inputs:
    User's Normal cell
        Capacity:
            <227 + tx fee>
        Data:
            sudt_amount: <Y>
        Type
            <sUDT type>
        Lock
            <user's lock>
            
Outputs:
    Swap Request Cell:
        Capacity:
            <227>
        Data:
            sudt_amount: <Y> 
        Type:
            <sUDT type> 
        Lock:
            code_hash: SWAP_ORDER_CODE_HASH
            args: user_lock_hash | version | min_amount_out: X | byte32(0x00) | 0 | 0|
```

* Y is the sUDT amount users need to pay containing the 0.3% trading fees
* X = Receive(1-s) is the CKB amount user will receive. s is the sliapage rate.
* They satisfy this formula: Receive = 997 * Pay * Rr / (997 * Pay + 1000 * Pr)，Rr is Receive asset reserve ，Pr is Pay asset reserve 。

Notice that the swap request transaction only validates regular SUDT rules constrained in sudt type script.

## 2. Deal-miners match swap request with pool cells

After traders submit the swap request, Aggregators will help traders to complete the swap. Motivated by the Tip fee claimed in the swap request cell (tip fee currently is 0), aggregators will continually retrieve the swap request cells and the pool cells on chain and then compete to match them off-chain and submit matching transactions. We open sourced a simple aggregators software for basic use. Information on how to deploy it can be found on [GitHub](https://github.com/glias/glia-swap-matcher). This software is a starting point for you to develop your own solution. You can maximize earnings by identifying and implementing your optimization strategies.

The matching transaction may looks like:

```
Input
    Info cell
        capacity: 
            250
        data: 
            ckb_reserve: M
            sudt_reserve: N
            LP_token_balance: L
            LP_type_hash
        type: 
            code_hash: INFO_TYPE_CODE_HASH 
            args: type id 
        lock: 
            code_hash: INFO_LOCK_CODE_HASH 
            args: hash(ckb | asset_sudt_type_hash) | info_type_hash
                
     Pool cell
        capacity: 
            186 + M
        data: 
            sudt_amount: N
        type: 
            <sudt type> 
        lock: 
            <info lock> 
    
     Aggregator cell
     
     Bob swap request cell_00
        Capacity
        Data:
            sudt_amount 
        Type:
            <sUDT type> 
        Lock:
            code_hash: SWAP_ORDER_CODE_HASH
            args: user_lock_hash | version | amount_in | min_amount_out | order_type: 00

        
     Alice swap request cell_00  

Output
    Info cell
        capacity: 
            250
        data: 
            ckb_reserve: M2
            sudt_reserve: N2
            lp_token_balance: L
            lp_token_type_hash
        type: 
            code_hash: Info_TYPE_CODE_HASH 
            args: type id 
        lock: 
            code_hash: INFO_LOCK_CODE_HASH 
            args: hash(ckb | asset_sudt_type_hash) | info_type_hash
                
     Pool cell
        capacity: 
            186 + M2
        data: 
            sudt_amount: N2
        type: 
            <sudt type> 
        lock: 
            <info cell lock> 
    
     Aggregator cell
     
     Bob normal cell
        Capacity
        Data:
            sudt_amount 
        Type:
            <sUDT type> 
        Lock:
            <user normal lock>
  
     Alice normal cell 
```   

In this transaction, three types of script will be run to verify the tx:

### Swap request lock script

**Rule 1 - verifity if the actual pay amount and receive amount satisfy the request amount in swap request cell.**

```
let pool = inputs[1]
for order in group_inputs[..] // QueryIter::new(load_input, Source::GroupInput).collect()
  let order = inputs[order_index_in_inputs]
  let output = outputs[order_index_in_inputs]

  let user_lock_hash = order.lock.args[0..32]
  let amount_in = BigUint::from(order.lock.args[33..49])
  let min_amount_out = BigUint::from(order.lock.args[49..65])
  let order_type = order.lcok.args[65..66]

  if output.lock_hash != user_lock_hash
      return fail
  if amount_in == 0
      return fail

  if order_type == SellCKB
      if output.type_hash != pool.type_hash
          return fail

      if order.capacity <= output.capacity
          || order.capacity - output.capacity != amount_in
          return fail

      if output.data.sudt_amount < min_amount_out
          return fail
  else if order_type == BuyCKB
      if output.type_hash.is_some()
          return fail

      if output.capacity < order.capacity + min_amount_out
          return fail

      if output.data.size != 0
          return fail
  else
      return fail
  fi
endfor
```

### Info type script

**Rule 1 - [TypeID rules](https://github.com/nervosnetwork/ckb/blob/master/script/src/type_id.rs)**

**Rule 2 - If this is a matching swap transaction, the cell sequence in this tx should follow the rules blow:**

```text

info_in_cell                            info_out_cell
pool_in_cell                            pool_out_cell
                          ------->
matcher_in_cell                         matcher_out_cell
[swap_request_cell]                     [sudt_cell或者ckb_cell]

```

**Rule 3 - If this is a swap matching transaction, verify whether the data changes in the info cell is correct and corresponding to the actual increase or decrease in the amount of assets in the pool cell**

Notice：In pseudo code blow，total_liqidity is the Liquidity token balance in info cell, and liquidity_sudt_type_hash is Liquidity token type hash.

```
let info_in = inputs[0]
let pool_in = inputs[1]
let info_out = outputs[0]
let pool_out = outputs[1]

if info_out.capacity != INFO_CAPACITY
    || info_out.data.total_liquidity != info_in.data.total_liquidity
    return fail

let ckb_got = BigInt::from(info_out.data.ckb_reserve) - info_in.data.ckb_reserve
let sudt_got = BigInt::from(info_out.data.sudt_reserve) - info_in.data.sudt_reserve

let ckb_reserve = info_in.data.ckb_reserve
let sudt_reserve = info_in.data.sudt_reserve

if ckb_got > 0 && sudt_got < 0 // tx buy sudt
    let sudt_paid = info_in.data.sudt_reserve - info_out.data.sudt_reserve

    if ckb_got != (1000 * ckb_reserve * sudt_paid) / (997 * (sudt_reserve - sudt_paid))
        return fail
else if ckb_got < 0 && sudt_got > 0 // tx sell sudt
    let ckb_paid = info_in.data.ckb_reserve - info_out.data.ckb_reserve

    if sudt_got != (1000 * sudt_reserve * ckb_paid) / (997 * (ckb_reserve - ckb_paid))
        return fail
else
    return fail
fi

if pool_out.capacity != pool_in.capacity + ckb_got
    || pool_out.data.amount != pool_in.data.amount + sudt_got
    return fail

return success
```

### Info lock script

**Rules 1 - Verify if lock.args is consistent with info type**

```
if count(self.lock.group_inputs) != 2
    return fail

let info = group_inputs[0]
let pool = group_inputs[1]
if hash(ckb | pool.type_hash) != self.lock.args[0..32]
    || info.type_hash != self.lock.args[32..64]
    return fail

return success
```

## 3. Traders can cancel their own swap request

Normally your will swap successfully soon after you submit the swap request, but if the price fluctuates above the slippage, your request will be pending until the pool price fluctuates back to the price you submitted.

So we provide the cancel option for traders. Traders can send a transaction to cancel their own liquidity request.

For example, if Alice want to cancel his swap request:

```
Inputs:
    Swap request cell:
        Capacity:
             <X + 146>
        Data:
            null
        Type:
            null 
        Lock:
            code_hash: order lock script
            args: Alice_lock_hash | version | min_amount_out: Y | sudt_type_hash | 0 | 0|
    Alice Normal cell(used to pay the tx fee)

Outputs:
    Alice's Normal cell
        Capacity:
             <X + 146>
        Data:
            null
        Type
            null
        Lock
            <Alice's lock>
```

This transaction leads to another rule of swap request lock script

### Swap request lock script

**Rule2 - If one of input cell in the transaction use user's lock specified in liquidity request cell args and the corresponding witness is not 0, unlock the request cell directly.**

```
let user_lock_hash = self.lock.args[0..32]
if one_of(input.lock_hash) == user_lock_hash
    // Check witness for anyone can pay lock compatibility
    let witness = load_witness_args(this_lock_index, Source::Input).unwrap()
    if witness.total_size() != 0
        return success
```