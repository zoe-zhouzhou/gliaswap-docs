---
id: cell
title: Cell Structure
---

Gliaswap support swap and pool by specifing several cell formats and implementing a set of scripts.

As mentioned in Gliaswap overview, traders and Lps all need to submit request firstly, and then aggregator can help them to complete swap or manage liquidity.

A request in Gliaswap actually is a live cell on chain which also can be thought of as a data package that signals what you want to do. And an request cell is identified and constrained by the its lock. There are two types of request cell:

* **Swap Request Cell**: when swapping between CKB and sUDT, LPs need to make a request first by creating a swap request cell. This request cell signals what you want to trade, for what token, and how much you want. More details can refer to the following swap request cell format part. 

* **Liquidity Request Cell**: when adding liquidity or removing liquidity from the pool, LPs need to make a request first by creating a liquidity request cell. This request cell signals what token pair you want to supply, for which pool, how much you want to supply. More details can refer to the following liquidity request cell format part. 

A pool of one token pair in Gliaswap actually is two cells on chain - info cell and pool cell. 
* The **info cell** is used to store the global states of this pool and restrict the rules for changing the status information. 
* The **pool cell** is used to store the real tokens. 
* These two cell have the same lock script and different type script, and more details can refer to the following info cell and pool cell format part. 

Liquidity tokens are minted to track the relative proportion of total reserves that each liquidity provider has contributed. In gliaswap, liquidity token followed sUDT standard and use info lock as its owner lock. More details can refer to the following **liquidity token cell** format part. 


## Swap Request Cell

Swap request cell is used for selling or buying assets.

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

**Field description :** (total size: 235 bytes)

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

**Field description :** (total size: 235 bytes)

- `capacity`(size: 16 bytes)
- `data`(size: 16 bytes, byte order: little endian) 
- `type script`(size: 65 bytes):  When adding liquidity, the type script is `asset_sudt_type`. When removing liquidity, the type script is `liquidity_sudt_type`.  
- `lock script`(size: 146 bytes)
  - `code_hash` (size: 32 bytes): `LIQUIDITY_REQ_LOCK_CODE_HASH`
  - `args`: 
    - `user_lock_hash` (size: 32  bytes)
    - `version` (type: uint 8, size: 1 byte)
    - `sudtMin` (type: uint 128, size: 16 bytes,  byte order: little endian) : When it is initial liquidity, `sudtMin` has no meaning. When adding liquidity, `sudtMin`  represents the minimum amount of CKB that could be used to add liquidity. While removing liquidity, `sudtMin` represents the minimum amount of sUDT that could be removed when Liquidity token runs out.
    - `ckbMin` (type: uint 64, size: 8 bytes, byte order: little endian):  When it is initial liquidity,  `ckbMin`  has no meaning. When adding liquidity, `ckbMin`  means minimum amount of CKB that could be used to add liquidity. While removing liquidity, `ckbMin` means minimum amount of CKB  that could be removed when Liquidity token runs out.
    - `info_type_hash_32` (size: 32 bytes)
    - `tips`(size: 8 bytes):  The amount of CKB that user pay to miner and aggregator.
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

**Field description :**（total size: 250 bytes) 

- `capacity`(size: 8 bytes)
- `data` (size : 80 bytes)
  - `ckb_reserve`(type: u128, size: 16 bytes) ：Total remaining amount of CKB  in the liquidity pool. 
  - `sudt_reserve`(type: u128, size: 16 bytes):  Total remaining amount of sUDT in the liquidity pool. 
  - `total_liquidity` (type: u128, size: 16 bytes): Total liquidity token issued. 
  - `liquidity_sudt_type_hash` (size: 32 bytes):  Liquidty token type hash of this pool. 
- `type script`(size: 65 bytes）
  - `code_hash` (size: 32 bytes): `INFO_TYPE_CODE_HASH`
  - `args`(size: 32 bytes):   `id`  =  `TypeId ` which is the input index[1] outpoint .
  - `hash_type` (size: 1 byte)
- `lock script` (size: 97 bytes）
  - `code_hash` (size: 32 bytes):  `INFO_LOCK_CODE_HASH` 
  - `args`(size: 32 bytes):
    - `hash(ckb | asset_sudt_type_hash)`(size: 32 bytes): The order of CKB and sUDT in here follows dictionary order
    - `info_type_hash` (size: 32 bytes): The unlock rule relies on info type script.
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

**Field description :** （total size: 186 bytes) 

- `capacity`  (size: 8 bytes)

- `data`(size: 16 bytes) : The amount of sUDT in liquidity pool.

- `type script` (size: 65 bytes) : sUDT type.

- `lock script` (size: 97 bytes): Same with info cell lock. 

## Liquidty Token Cell

```
{
  "capacity": -,
  "data": amount,
  "type": {
  	"code_hash": sudt_type_script,
  	"args": info_cell_lock_hash,
  },
  "lock": user_lock,
}
```

**Field description :** （total size: 154 bytes) 

- `capacity`  (size: 8 bytes)
- `data`(type: uint 128, size: 16 bytes)
- `type script` (size: 65 bytes)
  - `code_hash`: `sudt_type_script`
  - `args`:  in here, we use info cell lock hash as `owner_lock_hash`, since each time the liquidity tokens are minted or burned, info cell are required to be existed in this tx.input
- `lock script `(size: 65 bytes) : `user_lock`
