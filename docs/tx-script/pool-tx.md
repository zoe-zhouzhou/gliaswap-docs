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

Creat a pool in Gliaswap is permissionless. In the first version, Gliaswap only support to creat sudt/CKB pool. 

Creat a pool actually is to creat two cell: 
* info cell used to store pool info, including reserve balance, Liquidity token balance and other ID info to indentify the pool
* pool cell used to store the real asset, including CKB and sudt

```
Input
    Alice cell
        capacity
            250 + 186 + tx fee
        data
            NONE
        type
            NONE
        lock
            Alice lock
        
Output
    Info cell
        capacity: 
            250
        data: 
            ckb_reserve: 0
            sudt_reserve: 0
            lp_token_balance: 0
            lp_token_type_hash
        type: 
            code: INFO_TYPE_CODE_HASH 
            args: type id 
        lock: 
            code: INFO_LOCK_CODE_HASH 
            args: hash(ckb | asset_sudt_type_hash) | info_type_hash 
                
     Pool cell
        capacity: 
            186
        data: 
            sudt_amount: 0
        type: 
            <sudt type> 
        lock: 
            <info cell lock> 
```
In this transaction,  Only info type script will be run to verify the tx, which leads to the third validation rule of info type script

### Info type script

**Rule 4 - If this is a creating pool transaction, verify that the Pool cell is created at the same time as the Info cell, and that the data filled in info cell and pool cell are correct.**

```
if none_of(input.type.code_hash) == INFO_TYPE_CODE_HASH // Info creation
    info_id_verification()

    if count(output.lock.code_hash == INFO_LOCK_CODE_HASH) != 2 // pool not found
        || info.lock.hash_type != 1
        || info.lock.args[0..32] != hash(ckb | pool.type_hash
        || info.lock.args[32..64] != info.type_hash
        || info.lock_hash != pool.lock_hash
        || pool.data.size < 16
        return fail
```

## 2. LPs submit add liquidity request

If a LP want to add liqidity to a pool, he/she needs to submit a add liquidity request firstly. For example，Alice want to add M CKB and N sUDT_A to pool:

```
Input
    Alice normal cell
        capacity
            <M + 142 + 142 + tx fee>
        data
            tokenA amount: N
        type
            <tokenA type>
        lock
            <user's lock>
        
Output
     Alice add liquidity request cell    
        capacity: 
            <M + 142 + 142>
        data: 
            sudt_amount: N
        type: 
            <tokenA type>
        lock:
            code: LIQUIDITY_REQ_LOCK_CODE_HASH 
            args: user_lock_hash | version | sudtMin | ckbMin | info_type_hash_32 | 0 | 0 | // tip and tip fee are 0 in current version
```

Notice that this transaction only validates regular SUDT rules constrained in sudt type script.

## 3. LPs submit remove liquidity request

If a LP want to remove liquidity from a pool, he/she needs to submit a remove liquidity request firstly. For example，Bob want to burn L Liquidity token and withdraw the 

```
Input
    Bob normal cell
        capacity
            <235 + tx fee>
        data
            Liquidity token amount: N
        type
            <Liquidity token type>
        lock
            <user's lock>
        
Output
     Bob remove liquidity request cell    
        capacity: 
            235
        data: 
            Liquidity token amount: L
        type: 
            <Liquidity token type>
        lock:
            code: LIQUIDITY_REQ_LOCK_CODE_HASH 
            args: user_lock_hash | version | sudtMin | ckbMin | info_type_hash_32 | 0 | 0 | // tip and tip fee are 0 in current version
```

Notice that this transaction only validates regular SUDT rules constrained in sudt type script.

## 4. Aggregators match liquidity request with pool 

Motivated by the Tip fee claimed in the liquidity request cell, aggregators will continually retrieve the liquidity request cells（including add liquidity request and remove liquidity request） and the pool cells and then compete to match them off-chain and submit matching transactions.

```
Input
    Info cell
        capacity: 
            250
        data: 
            ckb_reserve: X
            sudt_reserve: Y
            lp_token_balance: Z
            lp_token_type_hash
        type: 
            code: INFO_TYPE_CODE_HASH 
            args: type id 
        lock: 
            code: INFO_LOCK_CODE_HASH 
            args: hash(ckb | asset_sudt_type_hash) | info_type_hash 
                
     Pool cell
        capacity: 
            186 + X
        data: 
            sudt_amount: Y
        type: 
            <sudt type> 
        lock: 
            <info cell lock>  
    
     Deal-miner cell
     
     Bob remove liquidity request cell
        capacity: 
            235
        data: 
            Liquidity token amount: l
        type: 
            <Liquidity token type>
        lock:
            code: LIQUIDITY_REQ_LOCK_CODE_HASH 
            args: user_lock_hash | version | sudtMin | ckbMin | info_type_hash_32 | 0 | 0 | // tip and tip fee are 0 in current version
        
     Alice add liquidity request cell    
        capacity: 
            <M + 142 + 142>
        data: 
            sudt_amount: N
        type: 
            <tokenA type>
        lock:
            code: LIQUIDITY_REQ_LOCK_CODE_HASH 
            args: user_lock_hash | version | sudtMin | ckbMin | info_type_hash_32 | 0 | 0 | // tip and tip fee are 0 in current version
            
Output
    Info cell
        capacity: 
            214
        data: 
            ckb_reserve: X - l*X/L + M
            sudt_reserve: Y - l*Y/L + N
            LP_token_balance: L - l + M*L/X
            LP_token_type_hash20
        type: 
            code: Info_TYPE_CODE_HASH 
            args: type id 
        lock: 
            code: INFO_LOCK_CODE_HASH 
            args: hash(ckb | asset_sudt_type_hash) | info_type_hash20 
                
     Pool cell
        capacity: 
            162 + X - l*X/L + M
        data: 
            sudt_amount: Y - l*Y/L + N
        type: 
            <sudt type> 
        lock: 
            <info cell lock> 
    
     Deal-miner cell
     
     Bob normal cell
        capacity: 
            184 + l*X/L
        data: 
            sudt_amount: l*Y/L
        type: 
            <sudt type>
        lock:
            <Bob normal lock>
        
     Alice Liquidity token cell    
        capacity: 
            142
        data: 
            sudt_amount: M*L/X
        type: 
            <LP type>
        lock:
            <Alice normal lock>
            
     Alice change cell
        capacity:
            142
        data:
            sudt_amount: n 
        type
            <sudtA_type>
        lock
            <Alice normal lock>
```

In this transaction, four types of script will be run to verify the tx:

### Info type script 

**Rule 5 - If this is a matching liquidity transaction, the cell sequence in this tx should follow the rules blow:**

```text

info_in_cell                            info_out_cell
pool_in_cell                            pool_out_cell
                          ------->
aggregator_in_cell                      aggregator_out_cell
[remove_liquidity_request_cell]         [sudt_cell]
[add_liquidity_request_cell]            [liquidity_cell + change_cell(sudt_cell or ckb_cell)]

```

**Rules 6 - If this is initially adding liquidity, verify if minting the correct amount Liquidity token for user, and verify if the data storaged in info cell and pool cell is correct.**

Notice：In pseudo code blow，total_liqidity is the Liquidity token balance in info cell, and liquidity_sudt_type_hash is Liquidity token type hash.

```

let info_in = inputs[0]
let pool_in = inputs[1]
let matcher_in = inputs[2]
let info_out = outputs[0]
let pool_out = outputs[1]
let matcher_out = outputs[2]

let ckb_reserve = info_in.data.ckb_reserve
let sudt_reserve = info_in.data.sudt_reserve
let total_liquidity = info_in.data.total_liquidity

let pool_ckb_paid = 0
let pool_sudt_paid = 0
let ckb_collected = 0
let sudt_collected = 0
let user_liquidity_added = 0
let user_liquidity_removed = 0

fn verify_genesis_add_liquidity()
    if ckb_reserve != 0
        || sudt_reserve != 0
        || total_liquidity != 0
        return fail

    let liquidity = outputs[req_index_in_inputs]
    let user_lock_hash = req.lock.args[0..32]
    if liquidity.type_hash != info.data.liquidity_sudt_type_hash
        || liquidity.lock_hash != user_lock_hash
        reutrn fail

    let sudt_injected = BigUint::from(req.data.amount)
    let ckb_injected = BigUint::from(req.capacity - SUDT_CAPACITY)

    let user_liquidity = BigUint::from(liquidity.data.amount)
    let added_liquidity: u128 = (sudt_injected * ckb_injected).sqrt().try_into().unwrap();
    if user_liquidity != added_liquidity
        return fail

    ckb_collected += ckb_injected
    sudt_collected += req.data.amount
    user_liquidity_added += user_liquidity
endfn
```

**Rule 7 - If this is not initially adding liquidity, iterate through all request cell**
* If it is add liquidity request cell, verify if minting the correct amount Liquidity token for user, and add up the CKB amount, sUDT amount and Liquidity token amount for verifying info cell and pool cell later.
* If it is remove liquidity request cell, verify if withdraw the correct CKB amount and sudt amount for user, and add up the CKB amount, sUDT amount and Liquidity token amount for verifying info cell and pool cell later.
* Verify if the data storaged in info cell and pool cell is correct 

```
fn verify_add_liquidity()
    if total_liquidity == 0
        return fail

    let liquidity = outputs[req_index_in_inputs * 2]
    let change = outputs[req_index_in_inputs * 2 + 1]

    let user_lock_hash = req.lock.args[0..32]
    if liquidity.type_hash != info.data.liquidity_sudt_type_hash
        || liquidity.lock_hash != user_lock_hash
       Outdated doc. reutrn fail

    let user_liquidity = BigUint::from(liquidity.data.amount)

    // Check sudt exhaustion
    if change.data.size == 0
      if !change.type.is_none()
          || change.lock_hash != user_lock_hash
          return fail

      let sudt_injected = BigUint::from(req.data.amount)
      let ckb_injected = BigUint::from(req.capacity - SUDT_CAPACITY - change.capacity) // SUDT_CAPACITY for liquidity cell

      if ckb_injected != (sudt_injected * ckb_reserve / sudt_reserve) + 1
          return fail

      // Check ckb_injected > min_ckb_injected
      let min_ckb_injected = BigUint::from(req.lock.args[49..57])
      if min_ckb_injected == 0
          || ckb_injected < min_ckb_injected
          return fail

      if user_liquidity != sudt_injected * total_liquidity / sudt_reserve
          return fail

    // Check ckb exhaustion
    else if change.data.size >= 16
      if change.type_hash != pool.type_hash
          || change.lock_hash != user_lock_hash
          return fail

      let sudt_injected = BigUint::from(req.data.amount - change.data.amount)
      let ckb_injected = BigUint::from(req.capacity - SUDT_CAPACITY * 2) // Two SUDT_CAPACITY for liquidity cell and sudt change cell

      if sudt_injected != (ckb_injected * sudt_reserve / ckb_reserve) + 1
          return fail

      // Check sudt_injected > min_sudt_injected
      let min_sudt_injected = BigUint::from(req.lock.args[33..49])
      if min_sudt_injected == 0
          || sudt_injected < min_sudt_injected
          return fail

      if user_liquidity != ckb_injected * total_liquidity / ckb_reserve
          return fail

    else
        return fail
    fi

    ckb_collected += ckb_injected
    sudt_collected += sudt_injected
    user_liquidity_added += user_liquidity
endfn

fn verify_remove_liquidity()
    if total_liquidity == 0
        return fail

    if req.data.amount == 0
        return fail

    let output_a = outputs[req_index_in_inputs];
    let output_b = outputs[req_index_in_inputs + 1];
    if output_a.type.is_none() && output_b.type.is_some()
        let ckb_out = output_a;
        let sudt_out = output_b;
    else if output_a.type.is_some() && output_b.type.is_none()
        let ckb_out = output_b;
        let sudt_out = output_a;
    else
        return fail
    fi

    if sudt_out.capacity != SUDT_CAPACITY
        return fail

    if ckb_out.data.size != 0
        || sudt_out.data.size < 16
        return fail

    let user_lock_hash = req.lock.args[0..32]
    if sudt_out.type_hash != pool.type_hash
        || sudt_out.lock_hash != user_lock_hash
        || ckb_out.lock_hash != user_lock_hash
        return fail

    let user_ckb_got = BigUint::from(ckb_out.capacity - req.capacity)
    let user_sudt_got = BigUint::from(sudt_out.data.amount)
    let removed_liquidity = BigUint::from(req.data.amount)

    // Check user_ckb_got >= min_ckb_got
    let min_ckb_got = req.lock.args[49..57]
    if min_ckb_got == 0
        || user_ckb_got < min_ckb_got
        return fail

    // Check user_sudt_got >= min_sudt_got
    let min_sudt_got = req.lock.args[33..49]
    if min_sudt_got == 0
        || user_sudt_got < min_sudt_got
        return fail

    if user_ckb_got != removed_liquidity * ckb_reserve / total_liquidity
        return fail

    if user_sudt_got != removed_liquidity * sudt_reserve / total_liquidity
        return fail

    pool_ckb_paid += user_ckb_got
    pool_sudt_paid += user_sudt_got
    user_liquidity_removed += removed_liquidity

    assert(pool_ckb_paid < ckb_reserve)
    assert(pool_sudt_paid < sudt_reserve)
    assert(user_liquidity_removed < total_liquidity)
endfn

for req in inputs[3..]
    let version = req.lock.args[32..33]
    if INFO_req_VERSION != version
        return fail

    let req_info_type_hash = req.lock.args[57..89]
    if req.data.size < 16
        || req_info_type_hash != info.type_hash
        return fail

    if info.data.total_liquidity == 0
        // Only allow on req to provide genesis liquidity
        if count(inputs) - 3 != 1
          return fail

        verify_genesis_add_liquidity()
        break

    match req.type_hash
        info.data.liquidity_sudt_type_hash => verify_remove_liquidity(req)
        pool.type_hash => verify_add_liquidity(req)
        _ => return fail // unknown liquidity req
endfor

if info_out.capacity != INFO_CAPACITY
    || info_out.data.ckb_reserve != info_in.data.ckb_reserve - pool_ckb_paid + ckb_collected
    || info_out.data.sudt_reserve != info_in.data.sudt_reserve - pool_sudt_paid + token_collected
    || BigUint::from(info_out.data.total_liquidity) !=
        BigUint::from(info_in.data.total_liquidity) - user_liquidity_removed +  user_liquidity_added
    return fail

if pool_out.capacity != pool_in.capacity + info_out.data.ckb_reserve - info_in.data.ckb_reserve
    || pool_out.data.amount != info_out.data.sudt_reserve
    return fail

return success
```

### Info lock script

[Rule 1](./swap-tx##info-lock-script)

### Liquidity request lock script

**Rule 1 - verifity input index[1] is info cell**

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
Input
     Bob remove liquidity request cell    
        capacity: 
            235
        data: 
            Liquidity token amount: L
        type: 
            <Liquidity token type>
        lock:
            code: LIQUIDITY_REQ_LOCK_CODE_HASH 
            args: user_lock_hash | version | sudtMin | ckbMin | info_type_hash_32 | 0 | 0 | // tip and tip fee are 0 in current version

    Bob normal cell (used to pay the tx fee)
        
Output
    Bob normal cell
        capacity
            <235>
        data
            Liquidity token amount: N
        type
            <Liquidity token type>
        lock
            <user's lock>

```

This transaction leads to another rule of LIQUIDITY_REQ_LOCK

### Liquidity request lock script

**Rule 2 - If one of input cell in the transaction use user's lock specified in liquidity request cell args and the corresponding witness is not 0, unlock the request cell directly.**

```
let user_lock_hash = self.lock.args[0..32]
if one_of(input.lock_hash) == user_lock_hash
    // Check witness for anyone can pay lock compatibility
    let witness = load_witness_args(this_lock_index, Source::Input).unwrap()
    if witness.total_size() != 0
        return success
```

