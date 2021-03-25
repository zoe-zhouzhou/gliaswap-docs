---
id: liquidity-lock-script
title: Liquidity Request Cell Lock Script
---

#### 1. Rule 1 - verifity input index[1] is info cell

```
// First input cell must be info cell
let info_type_hash = self.lock.args[57..89]
if inputs[0].type_hash[0..32] == info_type_hash
    return success

reuturn fail
```

#### 2. Rule 2 - If one of input cell in the transaction use user's lock specified in liquidity request cell args and the corresponding witness is not 0, unlock the request cell directly.

```
let user_lock_hash = self.lock.args[0..32]
if one_of(input.lock_hash) == user_lock_hash
    // Check witness for anyone can pay lock compatibility
    let witness = load_witness_args(this_lock_index, Source::Input).unwrap()
    if witness.total_size() != 0
        return success
```