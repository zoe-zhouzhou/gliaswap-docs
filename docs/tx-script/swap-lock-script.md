---
id: swap-lock-script
title: Swap Request Cell Lock Script
---

#### 1. Rule 1 - verifity if the actual pay amount and receive amount satisfy the request amount in swap request cell.

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

#### 2. Rule2 - If one of input cell in the transaction use user's lock specified in liquidity request cell args and the corresponding witness is not 0, unlock the request cell directly.

```
let user_lock_hash = self.lock.args[0..32]
if one_of(input.lock_hash) == user_lock_hash
    // Check witness for anyone can pay lock compatibility
    let witness = load_witness_args(this_lock_index, Source::Input).unwrap()
    if witness.total_size() != 0
        return success
```