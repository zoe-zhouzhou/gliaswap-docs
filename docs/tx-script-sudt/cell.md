---
id: cell
title: Cell Structure
---

The cell structure of swapping sUDT/sUDT is almost same with swapping sUDT/CKB with minor changes.

## Swap Request Cell

Swap request cell is used for selling or buying assets.

```
cell capacity - 227 bytes
{
  capacity: - 8 bytes
  data: - 16 bytes for sell
      sudt_amount: u128
  type: sudt_type for sell - 65 bytes
  lock: - 138 bytes
      code: SWAP_REQ_LOCK_CODE_HASH - 32 bytes + 1 byte
      args: sudt_type_hash (32 bytes, 0..32) | 
		  version (u8, 1 byte, 32..33) | 
		  amountOutMin (u128, 16 bytes, 33..49) | 
		  user_lock_hash (32 bytes, 49..81) | 
		  tips (8 bytes, 81..89) | 
		  tips_sudt (16 bytes, 89..105)
}
```

**Field description :** 

Same with [sUDT/CKB swap request cell](../tx-script/cell#swap-request-cell)

## Liquidity Request Cell

Liquidity request cell is used for add liquidity to liquidity pool or remove liquidity from liquidity pool by liquidity provider.

```
{
capacity: - 8 bytes
data: - 16 bytes
    sudt_amount: u128
type: sudt_x_type - 65 bytes
lock: - 170 bytes
    code: LIQUIDITY_LOCK_CODE_HASH - 32 bytes + 1 byte
    args: info_type_hash (32 bytes, 0..32)
        | user_lock_hash (32 bytes, 32..64)
        | version (u8, 1 byte, 64..65)
        | sudt_x_min (u128, 16 bytes, 65..81)
        | sudt_y_min (u128, 16 bytes, 81..97)
        | tips_ckb(8 bytes, 97..105)
        | tips_sudt_x/tips_sudt_lp (16 bytes, 105..121)
        | tips_sudt_y (16 bytes, 121..137) 
}
```

**Field description :** (total size: 235 bytes)

Same with [sUDT/CKB liquidity request cell](../tx-script/cell#liquidity-request-cell)

## Info Cell

Info cell represents the current state of liquidity pool.

```
cell capacity: 250 bytes
{
capacity: - 8 bytes
data: - 80 bytes
    sudt_x_reserve: u128
    sudt_y_reserve: u128
    total_liquidity: u128
    sudt_lp_type_hash: 32 bytes
type: - 65 bytes
    code: INFO_TYPE_CODE_HASH - 32 bytes + 1 byte
    args: id - 32 bytes
lock: - 97 bytes
    code: INFO_TYPE_CODE_HASH - 32 bytes + 1 byte
    args: hash(sudt_x_type_hash | sudt_y_type_hash) - 32 bytes
        | info_type_hash - 32 bytes
}
```

**Field description :**（total size: 250 bytes) 

- `lock script`
    - `hash(ckb | asset_sudt_type_hash)`(size: 32 bytes): The order of sUDT in here follows dictionary order

## Pool Cell

Pool cell is used for fund custody.

```
cell size - 186 bytes
{
capacity: - 8 bytes
data: - 16 bytes
    sudt_amount
type: sudt_type - 65 bytes
lock: info_lock - 97 bytes
}
```

**Field description :** （total size: 186 bytes) 

- `capacity`

- `data`: The amount of sUDT in liquidity pool.

- `type script`: sUDT type.

- `lock script`: Same with info cell lock. 

## Liquidty Token Cell

```
cell size - 142 bytes
{
capacity: - 8 bytes
data: amount: u128 - 16 bytes
type: - 65 bytes
    code: sudt_type_script
    args: info_cell_lock_hash
lock: user_lock - 53 bytes
}
```

