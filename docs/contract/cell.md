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

**Filed description :**

- capacity: The size is 8 bytes. 
- data: The size is 16 bytes. `sudt_amount` uses little endian. 
- type script: The size is 65 bytes. When adding liquidity, the type script is `asset_sudt_type`. When removing liquidity, the type script is `liquidity_sudt_type`.  
- lock script: The length is 146 bytes. 
  - `LIQUIDITY_REQ_LOCK_CODE_HASH`  is 32 bytes. 
  - `user_lock_hash`  is 32  bytes.
  - `version` is u8. 
  - `sudtMin` is u128, using little endian. When it is initial liquidity, `sudtMin` has no meaning. When adding liquidity, `sudtMin` means minimum amount of CKB that could be used to add liquidity. While removing liquidity, `sudtMin` means minimum amount of sUDT that could be removed when LP token runs out.
  - `ckbMin` is uint64,  using little endian. When it is initial liquidity,  `ckbMin`  has no meaning. When adding liquidity, `ckbMin`  means minimum amount of CKB that could be used to add liquidity. While removing liquidity, `ckbMin` means minimum amount of CKB  that could be removed when LP token runs out.
  - `info_type_hash_32` is 32 bytes.
  - `tips` is 8 bytes and represents the amount of CKB that user pay to miner and aggregator.
  - `tips_sudt` is 16 bytes and represents the amount of sUDT that user pay to  aggregator.



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

**Filed description :**

- capacity: The size is 8 bytes. 
- data: The size is 16 bytes. When selling sudt, the filed is `sudt_amount` . When buying sudt, the filed is null.
- type script: The size is 65 bytes.  When selling sudt, the filed is `sudt_type` . When buying sudt, the filed is null. 
- lock script: The length is 146 bytes. 
  - `SWAP_REQ_LOCK_CODE_HASH`  is 32 bytes.
  - `user_lock_hash` is 32 bytes.
  - `version` is u8.
  - `amountOutMin` is u128 and has a size of 16 bytes. `amountOutMin`  represents the minimum amount of tokens that trader can redeem. For example, when using sUDT to exchange for CKB, the `amountOutMin`  is the minimum amount of the redeemed CKB, not the minimum capacity of all cell.
  - `tips` is 8 bytes and represents the amount of CKB that user pay to miner and aggregator.
  - `tips_sudt` is 16 bytes and represents the amount of sUDT that user pay to  aggregator.



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

**Filed description :**

- capacity: The size is 8 bytes. 
- data: The size is 80 bytes. 
  - `ckb_reserve` is u128 , 16 bytes.
  - `sudt_reserve` is u128.
  - `total_liquidity` is u128.
  - `liquidity_sudt_type_hash` has a size of 32 bytes.
- type script: The size is 65 bytes.  
  - `INFO_TYPE_CODE_HASH` is 32 bytes.
  - `id` is 32 bytes.
  - `hash_type` is 1 byte.
- lock script: The size is 97 bytes. 
  - `INFO_LOCK_CODE_HASH` is 32 bytes.
  - `hash(ckb | asset_sudt_type_hash)` is 32 bytes.
  - `info_type_hash` is 32 bytes.
  - `hash_type` is 1 byte.



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

**Filed description :**

- capacity: The size is 8 bytes. 

- data: The size is 16 bytes.

- type script: The size is 65 bytes.

- lock script: The size is 97 bytes. 

  

## sUDT Cell

There are two kinds of sUDT involved in transactions. One is as `asset sudt` in liquidity pool portfolio. The other is  `liquidity sudt` used in liquidity operations. As shown below, both are common  types of sUDT .

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

**Filed description :**

- capacity: The size is 8 bytes. 
- data: `amount`is u128, 16 bytes.
- type script: The size is 65 bytes.
- lock script

