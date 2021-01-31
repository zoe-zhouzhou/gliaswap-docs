---
id: info-type-script
title: Info Cell Type Script
---


#### 1. Rule 1 - [TypeID rules](https://github.com/nervosnetwork/ckb/blob/master/script/src/type_id.rs)

#### 2. Rule 2 - If this is a matching swap transaction, the cell sequence in this tx should follow the rules blow:

```text

info_in_cell                            info_out_cell
pool_in_cell                            pool_out_cell
                          ------->
matcher_in_cell                         matcher_out_cell
[swap_request_cell]                     [sudt_cell或者ckb_cell]

```

#### 3. Rule 3 - If this is a swap matching transaction, verify whether the data changes in the info cell is correct and corresponding to the actual increase or decrease in the amount of assets in the pool cell

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

#### 4. Rule 4  - If this is a creating pool transaction, verify that the Pool cell is created at the same time as the Info cell, and that the data filled in info cell and pool cell are correct.

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

#### 5. Rule 5 - If this is a matching liquidity transaction, the cell sequence in this tx should follow the rules blow:

```text

info_in_cell                            info_out_cell
pool_in_cell                            pool_out_cell
                          ------->
aggregator_in_cell                      aggregator_out_cell
[remove_liquidity_request_cell]         [sudt_cell]
[add_liquidity_request_cell]            [liquidity_cell + change_cell(sudt_cell or ckb_cell)]

```

#### 6. Rules 6 - If this is initially adding liquidity, verify if minting the correct amount Liquidity token for user, and verify if the data storaged in info cell and pool cell is correct.

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

#### 7. Rule 7 - If this is not initially adding liquidity, iterate through all request cell**
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