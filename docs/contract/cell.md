---
id: cell
title: Cell Structure
---

# Cell Structure

The structures of cells in different types are as follows.

## Liquidity Request Cell

Liquidity request cell is used for add liquidity to liquidity pool or remove liquidity from liquidity pool by liquidity provider.

```
{
  "capacity": -,
  "data": sudt_amount,
  "type": asset_sudt_type or liquidity_sudt_type,
  "lock": {
    "code_hash": LIQUIDITY_REQ_LOCK_CODE_HASH,
    "args": user_lock_hash | version | sudtMin |ckbMin |info_type_hash_32 |tips |   
            tips_sudt  ( "|" refers to bytes concatenation),
    "hash_type": -,
  },
  
}
```

**Filed description :** (total size: 235 bytes)

- `capacity`(size: 16 bytes)
- `data`(size: 16 bytes, byte order: little endian) 
- `type script`(size: 65 bytes):  When adding liquidity, the type script is `asset_sudt_type`. When removing liquidity, the type script is `liquidity_sudt_type`.  
- `lock script`(size: 146 bytes)
  - `code_hash` (size: 32 bytes): `LIQUIDITY_REQ_LOCK_CODE_HASH`
  - `args`: 
    - `user_lock_hash` (size: 32  bytes)
    - `version` (type: uint 8, size: 1 byte)
    - `sudtMin` (type: uint 128, size: 16 bytes,  byte order: little endian) : When it is initial liquidity, `sudtMin` has no meaning. When adding liquidity, `sudtMin`  represents the minimum amount of CKB that could be used to add liquidity. While removing liquidity, `sudtMin` represents the minimum amount of sUDT that could be removed when LP token runs out.
    - `ckbMin` (type: uint 64, size: 8 bytes, byte order: little endian):  When it is initial liquidity,  `ckbMin`  has no meaning. When adding liquidity, `ckbMin`  means minimum amount of CKB that could be used to add liquidity. While removing liquidity, `ckbMin` means minimum amount of CKB  that could be removed when LP token runs out.
    - `info_type_hash_32` (size: 32 bytes)
    - `tips`(size: 8 bytes):  The amount of CKB that user pay to miner and aggregator.
    - `tips_sudt`(size: 16 bytes): The amount of sUDT that user pay to  aggregator.
  - `hash_type` (size: 1 byte)



## Swap Request Cell

Swap request cell is used for selling or buying asset.

```
{
  "capacity": -,
  "data": sudt_amount,
  "type": asset_sudt_type or liquidity_sudt_type,
  "lock": {
    "code_hash": SWAP_REQ_LOCK_CODE_HASH,
    "args": user_lock_hash | version | sudtMin |ckbMin |info_type_hash_32 |tips |   
            tips_sudt  ( "|" refers to bytes concatenation),
    "hash_type": -,
  },
}
```

**Filed description :** (total size: 235 bytes)

- `capacity`(size: 8 bytes)
- `data`(size: 16 bytes):  When selling sudt, `data` should be `sudt_amount` . When buying sudt, `data` should be null.
- `type script` (size: 65 bytes):  When selling sudt, `type script` should be `sudt_type` . When buying sudt, `type script` should be  null. 
- `lock script` (size: 146 bytes) 
  - `code_hash` (size: 32 bytes): `SWAP_REQ_LOCK_CODE_HASH` 
  - `args`:
    - `user_lock_hash` (size: 32 bytes)
    - `version` (type: uint 8, size: 1 byte)
    - `amountOutMin` (type: uint 128, size: 16 bytes):  `amountOutMin`  represents the minimum amount of tokens that trader can redeem. For example, when using sUDT to exchange for CKB, the `amountOutMin`  should be the minimum amount of the redeemed CKB, not the minimum capacity of all cell.
    - `tips` (size: 8 bytes):  The amount of CKB that user pay to miner and aggregator.
    - `tips_sudt`(size: 16 bytes): The amount of sUDT that user pay to  aggregator.
  - `hash_type` (size: 1 byte)



## Info Cell

Info cell represents the current state of liquidity pool.

```
{
  "capacity": -,
  "data": {
  	 "ckb_reserve": ,
  	 "sudt_reserve": ,
  	 "total_liquidity": ,
  	 "liquidity_sudt_type_hash": ,
  	},
  "type": {
  	"code_hash": INFO_TYPE_CODE_HASH, 
  	"args": id,
  	"hash_type": ,
  },
  "lock": {
    "code_hash": INFO_LOCK_CODE_HASH,
    "args": hash(ckb | asset_sudt_type_hash) | info_type_hash  ( "|" refers to bytes concatenation),
    "hash_type": -,
  },
}
```

**Filed description :**（total size: 250 bytes) 

- `capacity`(size: 8 bytes)
- `data` (size : 80 bytes)
  - `ckb_reserve`(type: u128, size: 16 bytes) ：Total remaining amount of CKB  in the liquidity pool. 
  - `sudt_reserve`(type: u128, size: 16 bytes):  Total remaining amount of sUDT in the liquidity pool. 
  - `total_liquidity` (type: u128, size: 16 bytes): Total remaining amount of liquidity token in the liquidity pool. 
  - `liquidity_sudt_type_hash` (size: 32 bytes):  This filed represent the sUDT type in liquidity pool. 
- `type script`(size: 65 bytes）
  - `code_hash` (size: 32 bytes): `INFO_TYPE_CODE_HASH`
  - `args`(size: 32 bytes):   `id`  =  `TypeId ` used in CKB protocol.
  - `hash_type` (size: 1 byte)
- `lock script` (size: 97 bytes）
  - `code_hash` (size: 32 bytes):  `INFO_LOCK_CODE_HASH` 
  - `args`(size: 32 bytes):
    - `hash(ckb | asset_sudt_type_hash)`(size: 32 bytes):  Make indexing easier.
    - `info_type_hash` (size: 32 bytes): To make sure the unlocked pool is correct.
  - `hash_type` (size: 1 byte)



## Pool Cell

Pool cell is used for fund custody.

```
{
  "capacity": -,
  "data": sudt_amount,
  "type": sudt_type,
  "lock": info_lock,
}
```

**Filed description :** （total size: 186 bytes) 

- `capacity`  (size: 8 bytes)

- `data`(size: 16 bytes) : The amount of sUDT in liquidity pool.

- `type script` (size: 65 bytes) : sUDT type.

- `lock script` (size: 97 bytes): Info lock.

  

## sUDT Cell

There are two kinds of sUDT involved in transactions. One is as `asset sudt` in liquidity pool asset portfolio. The other is  `liquidity sudt` used in liquidity operations. As shown below, both are common  types of sUDT.

```
{
  "capacity": -,
  "data": amount,
  "type": {
  	"code_hash": sudt_type_script,
  	"args": owner_lock_hash,
  },
  "lock": user_lock,
}
```

**Filed description :** （total size: 154 bytes) 

- `capacity`  (size: 8 bytes)
- `data`(type: uint 128, size: 16 bytes): The amount of sUDT.
- `type script` (size: 65 bytes)
  - `code_hash`: `sudt_type_script`
  - `args`:  `owner_lock_hash` 
- `lock script `(size: 65 bytes) : `user_lock`

