---
id: info-lock-script
title: Info Cell Lock Script
---

#### Rules 1 - Verify if lock.args is consistent with info type and pool info 

```
let group_count = count(self.lock.group_inputs)

if group_count == 2 // ckb/sudt
    let info = group_inputs[0]
    let pool = group_inputs[1]

    if hash(ckb | pool.type_hash) != self.lock.args[0..32]
        || info.type_hash != self.lock.args[32..64]
        return fail

else if group_count == 3 // sudt/sudt
    let info = group_inputs[0]
    let pool_x = group_inputs[1]
    let pool_y = group_inputs[2]

    if hash(pool_x.type_hash | pool_y.type_hash) != self.lock.args[0..32]
        || info.type_hash != self.lock.args[32..64]
        return fail
else
    return fail

return success
```