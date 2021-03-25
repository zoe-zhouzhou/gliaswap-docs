---
id: info-type-script
title: Info Cell Type Script
---


#### 1. Rule 1 - [TypeID rules](https://github.com/nervosnetwork/ckb/blob/master/script/src/type_id.rs)

#### 2. Rule 2 - If this is a matching transaction, the cell sequence in this tx should follow the rules blow:

```text

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

#### 3. Rule 3 - Intercept the swap request queue from inputs and outputs, and for each request cell，verifity if the actual pay amount and receive amount satisfy the request amount in swap request cell. And update the sudt_x_reserve and sudt_y_reserve for following verification.

```
let info = inputs[0]
let pool_x = inputs[1]
let pool_y = inputs[2]

let sudt_x_reserve = info_in.data.sudt_x_reserve
let sudt_y_reserve = info_in.data.sudt_y_reserve

for (let i = 0, j = 0; i < swap_inputs.length && j < swap_outputs.length; I = i + 1, j = j+ 2)
    let req_sudt = swap_inputs[i]
    let sudt_out = swap_outputs[j]
    let ckb_change = swap_outputs[j + 1]

    // ## Request input cell basic verification
    // Leave capacity verification to ckb change cell below
    if req_sudt.data.size < 16
        || (req_sudt.type_hash != pool_x.type_hash && req_sudt.type_hash != pool_y.type_hsh)
        return fail

    let sudt_out_type_hash = req_sudt.lock.args[0..32]
    // Swapped sudt not match
    if (sudt_out_type_hash != pool_x.type_hash && sudt_out_type_hash != pool_y.type_hash)
        return fail

    // Swap self
    if sudt_out_type_hash == req_sudt.type_hash
        return fail

    // ## Output cell basic verification
    let user_lock_hash = req_sudt.lock.args[32..64]
    let tips_ckb = req_sudt.lock.args[81..89]
    let tips_sudt = req_sudt.lock.args[90..105]

    if sudt_out.capacity != MIN_SUDT_CAPACITY
        || sudt_out.data.size < 16
        || sudt_out.type_hash != sudt_out_type_hash
        || sudt_out.lock_hash != user_lock_hash
        return fail

    if ckb_change.capacity != req_sudt.capacity - MIN_SUDT_CAPACITY - tips_ckb
        || ckb_change.data.size != 0
        || ckb_change.type != none
        || ckb_change.lock_hash != user_lock_hash
        return fail

    // ## Swap price verification
    let amount_in = req_sudt.data.amount - tips_sudt
    let amount_out = sudt_out.data.amount
    let amount_out_min = req_sudt.lock.args[65..81]

    if amount_out_min == 0
        || amount_out < amount_out_min
        return fail

    // sudt x => sudt y
    if sudt_out.type_hash == pool_y.type_hash
        let numerator = 997 * sudt_y_reserve * amount_in
        let denominator = sudt_x_reserve * 1000 + amount_in * 997

        if amount_out != (numerator / denominator) + 1
            return fail

        sudt_x_reserve = sudt_x_reserve + amount_in
        sudt_y_reserve = sudt_y_reserve - amount_out
    else
        let numerator = 997 * sudt_x_reserve * amount_in
        let denominator = sudt_y_reserve * 1000 + amount_in * 997

        if amount_out != (numerator / denominator) + 1
            return fail

        sudt_x_reserve = sudt_x_reserve - amount_out
        sudt_y_reserve = sudt_y_reserve + amount_in
    fi
endfor
```

#### 4. rule 4 - If this is a creating pool transaction, verify that two Pool cells is created at the same time as the Info cell, and that the data filled in info cell and pool cell are correct.

```
// Info creation
if count(input.type.code_hash == INFO_TYPE_CODE_HASH) == 0
    && count(output.type.code_hash == INFO_TYPE_CODE_HASH) == 1

    // For type deployment, the output.lock.code_hash is info lock dep cell's
    // type hash. So we must extract data hash from dep cell to be able to
    // verify it agains our hard code data hash, INFO_LOCK_CODE_HASH.
    if not_find(any(cell_dep).type_hash == output.lock.code_hash)
        return fail
    let info_lock_data_hash = hash(info_lock_cell_dep.data)
    let lock_count = count(info_lock_data_hash == INFO_LOCK_CODE_HASH)

    if lock_count == 3 // sudt/sudt
        let pool_x = outputs[1]
        let pool_y = outputs[2]

        // Same sudt
        if pool_x.type_hash == pool_y.type_hash
            return fail

        if info.lock.hash_type != 1
            || info.lock.args[0..32] != hash(pool_x.type_hash | pool_y.type_hash)
            || info.lock.args[32..64] != info.type_hash
            return fail

        if pool_x.capacity != POOL_BASE_CAPACITY
            || pool_x.data.size < 16
            || pool_x.lock_hash != info.lock_hash
            || pool_y.capacity != POOL_BASE_CAPACITY
            || pool_y.data.size < 16
            || pool_y.lock_hash != pool_x.lock_hash
            return fail
    else
        return fail
fi
```

#### 5. Rule 5 - If this is initially adding liquidity, verify if minting the correct amount Liquidity token for user, and verify if the data storaged in info cell and pool cell is correct.

```

let info = inputs[0]
let pool_x = inputs[1]
let pool_y = inputs[2]

let sudt_x_reserve = swap_updated_sudt_x_reserve
let sudt_y_reserve = swap_updated_sudt_y_reserve
let total_liquidity = info_in.data.total_liquidity

fn verify_genesis_liquidity()
    // Wrong cell number
    if inputs.len() != 6 || outputs.len() != 6
        return fail

    // Not genesis
    if sudt_x_reserve != 0
        || sudt_y_reserve != 0
        || total_liquidity != 0
        return fail

    let req_sudt_x = inputs[4]
    let req_sudt_y = inputs[5]
    let sudt_lp = outputs[4]
    let ckb_change = outputs[5]

    // ## Request input cell basic verification
    // Capacity verification is done by output ckb change cell below
    if req_sudt_x.data.size < 16
        || req_sudt_x.type_hash != pool_x.type_hash
        || req_sudt_y.data.size < 16
        || req_sudt_y.type_hash != pool_y.type_hash
        return fail

    // Info cell not match
    if req_sudt_x.lock.args[0..32] != info.type_hash
        || req_sudt_y.lock.args[0..32] != info.type_hash
        return fail

    // Req user lock hash not match
    let user_lock_hash = req_sudt_x.lock.args[32..64]
    if req_sudt_y.lock.args[32..64] != user_lock_hash
        return fail

    // Req cell not match
    if req_sudt_y.lock.args[64..96] != req_sudt_x.lock_hash
        return fail

    // ## Output cell basic verification
    let tips_ckb = req_sudt_x.lock.args[97..105]
    let tips_sudt_x = req_sudt_x.lock.args[105..121]
    let tips_sudt_y = req_sudt_x.lock.args[121..137]

    if sudt_lp.capacity != MIN_SUDT_CAPACITY
        || sudt_lp.data.size < 16
        || sudt_lp.type_hash != info.data.sudt_lp_type_hash
        || sudt_lp.lock_hash != user_lock_hash
        reutrn fail

    if ckb_change.capacity != req_sudt_x.capacity + req_sudt_y.capacity - MIN_SUDT_CAPACITY - tips_ckb
        || ckb_change.data.size != 0
        || ckb_change.type != none
        || ckb_change.lock_hash != user_lock_hash
        return fail

    // ## Genesis liquidity price verification
    let amount_x_in = req_sudt_x.data.amount - tips_sudt_x
    let amount_y_in = req_sudt_y.data.amount - tips_sudt_y
    let amount_lp = sudt_lp.data.amount

    if amount_lp != (amount_x_in * amount_y_in).sqrt();
        return fail

    sudt_x_reserve = amount_x_in
    sudt_y_reserve = amount_y_in
    total_liquidity = amount_lp
endfn

```

**6. rule 6 - Intercept the liquidity request queue from inputs and outputs, and for each request cell，verifity if the actual pay amount and receive amount satisfy the request amount in the request cell. And update the sudt_x_reserve and sudt_y_reserve for following verification.**

* If it is add liquidity request cell, verify if minting the correct amount Liquidity token for user, and add up the CKB amount, sUDT amount and Liquidity token amount for verifying info cell and pool cell later.
* If it is remove liquidity request cell, verify if withdraw the correct CKB amount and sudt amount for user, update the CKB amount, sUDT amount and Liquidity token amount for verifying info cell and pool cell later.
* Verify if the data changed in info cell and pool cell is correct 


```
// verify add liquidity request
fn verify_add_liquidity()
    // Wait genesis liquidity
    if total_liquidity == 0
        return fail

    for(let i = 0, j = 0; i < add_inputs.length && j < add_inputs.length, i = i + 2, j = j + 3)
        let req_sudt_x = add_inputs[i]
        let req_sudt_y = add_inputs[i + 1]
        let sudt_lp = add_outputs[j]
        let sudt_change = add_outputs[j + 1]
        let ckb_change = add_outputs[j + 2]

        // ## Request input cell basic verification
        // Capacity verification is done by output ckb change cell below
        if req_sudt_x.data.size < 16
            || req_sudt_x.type_hash != pool_x.type_hash
            || req_sudt_y.data.size < 16
            || req_sudt_y.type_hash != pool_y.type_hash
            return fail

        // info cell not match
        if req_sudt_x.lock_hash[0..32] != info.type_hash
            || req_sudt_y.lock_hash[0..32] != info.type_hash
            return fail

        // Req use lock hash not match
        let user_lock_hash = req_sudt_x.lock.args[32..64]
        if req_sudt_y.lock.args[32..64] != user_lock_hash
            return fail

        // req cell not match
        if req_sudt_y.lock.args[64..96] != req_sudt_x.lock_hash
            return fail

        // ## Output cell basic verification
        let tips_ckb = req_sudt_x.lock.args[97..105]
        let tips_sudt_x = req_sudt_x.lock.args[105..121]
        let tips_sudt_y = req_sudt_y.lock.args[121..137]

        if sudt_lp.capacity != MIN_SUDT_CAPACITY
            || sudt_lp.data.size < 16
            || sudt_lp.type_hash != info.data.sudt_lp_type_hash
            || sudt_lp.lock_hash != user_lock_hash
            reutrn fail

        if sudt_change.capacity != MIN_SUDT_CAPACITY
            || sudt_change.data.size < 16
            || (sudt_change.type_hash != req_sudt_x.type_hash && sudt_change != req_sudt_y.type_hash)
            || sudt_change.lock_hash != user_lock_hash
            return fail

        if ckb_change.capacity != req_sudt_x.capacity + req_sudt_y.capacity - 2 * MIN_SUDT_CAPACITY - tips_ckb
            || ckb_change.data.size != 0
            || ckb_change.type != none
            || ckb_change.lock_hash != user_lock_hash
            return fail

        // ## Add liquidity price verification
        let amount_x = req_sudt_x.data.amount - tips_sudt_x
        let amount_y = req_sudt_y.data.amount - tips_sudt_y
        let amount_x_min = req_sudt_x.lock.args[65..81]
        let amount_y_min = req_sudt_y.lock.args[81..97]
        let amount_change = sudt_change.data.amount
        let amount_lp = sudt_lp.data.amount

        // Check sudt x exhaustion
        if sudt_change.type_hash == req_sudt_y.type_hash
            let amount_y_in = amount_y - amount_change
            if amount_y_min == 0 || amount_y_in < amount_y_min
                return fail

            if amount_y_in != (amount_x * sudt_y_reserve / sudt_x_reserve) + 1
                return fail

            if amount_lp != amount_x * total_liquidity / sudt_x_reserve + 1
                return fail

            sudt_x_reserve = sudt_x_reserve + amount_x
            sudt_y_reserve = sudt_y_reserve + amount_y_in

        // Check sudt y exhaustion
        else
            let amount_x_in = amount_x - amount_change
            if amount_x_min == 0 || amount_x_in < amount_x_min
                return fail

            if amount_x_in != (amount_y * sudt_x_reserve / sudt_y_reserve) + 1
                return fail

            if amount_lp != amount_y * total_liquidity / sudt_y_reserve + 1
                return fail

            sudt_x_reserve = sudt_x_reserve + amount_x_in
            sudt_y_reserve = sudt_y_reserve + amount_y
        fi

        total_liquidity = total_liquidity + amount_lp
    endfor
endfn
```

```
//verify remove liquidity request
fn verify_remove_liquidity()
    // Wait genesis liquidity
    if total_liquidity == 0
        return fail

    for(let i = 0, j = 0; i < remove_inputs.length && j < remove_inputs.length, i = i + 1, j = j + 2)
        let req_sudt_lp = remove_inputs[i]
        let sudt_x = remove_outputs[j]
        let sudt_y = remove_outputs[j + 1]

        // ## Request input cell basic verification
        if req_sudt_lp.capacity < MIN_SUDT_CAPACITY * 2
            || req_sudt_lp.data.size < 16
            return fail

        // info cell sudt type hash not match
        if req_sudt_lp.type_hash != info.data.sudt_lp_type_hash
            return fail

        // info cell not match
        if req_sudt_lp.lock_hash[0..32] != info.type_hash
            return fail

        // ## Output cell basic verification
        let user_lock_hash = req_sudt_lp.lock.args[32..64]
        let tips_sudt_lp = req_sudt_lp.lock.args[105..121]

        if sudt_x.capacity != MIN_SUDT_CAPACITY
            || sudt_x.data.size < 16
            || sudt_x.type_hash != pool_x.type_hash
            || sudt_x.lock_hash != user_lock_hash
            return fail

        if sudt_y.capacity != MIN_SUDT_CAPACITY
            || sudt_y.data.size < 16
            || sudt_y.type_hash != pool_y.type_hash
            || sudt_y.lock_hash != user_lock_hash
            return fail

        // ## Remove liquidity price verification
        let amount_lp = req_sudt_lp.data.amount - tips_sudt_lp
        let amount_x_out = sudt_x.data.amount
        let amount_y_out = sudt_y.data.amount
        let amount_x_out_min = sudt_x.lock.args[65..81]
        let amount_y_out_min = sudt_y.lock.args[81..97]

        if amount_x_out_min == 0
            || amount_x_out < amount_x_out_min
            return fail

        if amount_y_out_min == 0
            || amount_y_out < amount_y_out_min
            return fail

        if amount_x_out != amount_lp * sudt_x_reserve / total_liquidity + 1
            return fail

        if amount_y_out != amount_lp * sudt_y_reserve / total_liquidity + 1
            return fail

        sudt_x_reserve = sudt_x_reserve - amount_x_out
        sudt_y_reserve = sudt_y_reserve - amount_y_out
    endfor
endfn
```

```
// Verify if the data changed in info cell and pool cell is correct 
if info_creation?
    return info_creation_verification()
fi

let info_in = inputs[0]
let pool_x_in = inputs[1]
let pool_y_in = inputs[2]

let info_out = outputs[0]
let pool_x_out = outputs[1]
let pool_y_out = outputs[2]

// ## Input info, pool basic verification
// Leave info type hash verification to outputs below
if info_in.capacity != INFO_CAPACITY
    || info_in.data.size != 80
    || info_in.data.sudt_x_reserve != pool_x_in.data.amount
    || info_in.data.sudt_y_reserve != pool_y_in.data.amount
    || info_in.lock.args[0..32] != hash(pool_x_in.type_hash | pool_y_in.type_hash)
    || info_in.lock.args[32..64] != info.type_hash
    return fail

// poox_x_in type hash is alredy verified above
if pool_x_in.capacity != POOL_CAPACITY
    || pool_x_in.data.size < 16
    || pool_x_in.lock_hash != info_in.lock_hash
    return fail

// poox_y_in type hash is alredy verified above
if pool_y_in.capacity != POOL_CAPACITY
    || pool_y_in.data.size < 16
    || pool_y_in.lock_hash != info_in.lock_hash
    return fail

// ## Output info, pool basic verification
if info_out.capacity != info_in.capacity
    || info_out.data.size != info_out.data.size
    || info_out.data.sudt_x_reserve != pool_x_out.data.amount
    || info_out.data.sudt_y_reserve != pool_y_out.data.amount
    || info_out.type_hash != info_in.type_hash
    || info_out.lock_hash != info_out.lock_hash
    return fail

if pool_x_out.capacity != pool_x_in.capacity
    || pool_x_out.data.size != pool_x_in.data.size
    || pool_x_out.type_hash != pool_x_in.type_hash
    || pool_x_out.lock_hash != pool_x_in.lock_hash
    return fail

if pool_y_out.capacity != pool_y_in.capacity
    || pool_y_out.data.size != pool_y_in.data.size
    || pool_y_out.type_hash != pool_y_in.type_hash
    || pool_y_out.lock_hash != pool_y_in.lock_hash
    return fail

// ## Transaction verification
let sudt_x_reserve = info_in.data.sudt_x_reserve
let sudt_y_reserve = info_in.data.sudt_y_reserve
let total_liquidity = info_in.data.total_liquidity

let swap_size = WitnessArgs.type_input.swap_size
let add_liquidity_size = WitnessArgs.type_input.add_liquidity_size

let swap_inputs = inputs[4..4 + swap_size]
let swap_outputs = outputs[4..4 + swap_size * 2]
do_swap_verification(swap_inputs, swap_outputs, sudt_x_reserve, sudt_y_reserve)

let add_inputs = inputs[4 + swap_size..4 + swap_size + add_size * 2]
let add_ouputs = outpus[4 + swap_size * 2.. 4 + swap_size * 2 + add_size * 3]
do_add_liquidity_verification(add_inputs, add_ouputs, sudt_x_reserve, sudt_y_reserve, total_liquidity)

let remove_inputs = inputs[4 + swap_size + add_size * 2..]
let remove_ouputs = outputs[4 + swap_size * 2 + add_size * 3..]
do_remove_liquidity_verification(remove_inputs, remove_outputs, sudt_x_reserve, sudt_y_reserve, total_liquidity)

if sudt_x_reserve != info_out.data.sudt_x_reserve
    || sudt_y_reserve != info_out.data.sudt_y_reserve
    || total_liquidity != info_out.data.total_liquidity
    return fail
```