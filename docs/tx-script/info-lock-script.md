---
id: info-lock-script
title: Info Cell Lock Script
---

#### Rules 1 - Verify if lock.args is consistent with info type

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