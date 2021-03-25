---
id: cell
title: Cell Structure
---

Gliaswap support swap and pool by specifying several cell formats and implementing a set of scripts.

In Gliaswap, traders and LPs all need to submit requests firstly, and then the aggregator can help them to complete the swap or manage liquidity.

A request in Gliaswap is a live cell on the chain which also can be thought of as a data package that signals what you want to do. And a request cell is identified and constrained by its lock. There are two types of request cell:

* **Swap Request Cell**: when swapping between CKB and sUDT, LPs need to make a request firstly by creating a swap request cell. This request cell signals what you want to trade, for what token, and how much you want. More details can refer to the following swap request cell format part. 

* **Liquidity Request Cell**: when adding liquidity or removing liquidity from the pool, LPs need to make a request first by creating a liquidity request cell. This request cell signals what token pair you want to supply, for which pool, how much you want to supply. More details can refer to the following liquidity request cell format part. 

A pool of one token pair in Gliaswap is two cells on the chain - info cell and pool cell. 
* The **info cell** is used to store the global states of this pool and restrict the rules for changing the status information. 
* The **pool cell** is used to store the real tokens. 
* These two cells have the same lock script and different type script, and more details can refer to the following info cell and pool cell format part. 

Liquidity tokens are minted to track the relative proportion of total reserves that each liquidity provider has contributed. In Gliaswap, liquidity token followed sUDT standard and use info lock as its owner lock. More details can refer to the following **liquidity token cell** format part. 

## Swap Request Cell

The swap request cell is used for selling or buying assets.

when using sUDT to buy CKB:

```
SWAP_REQ_CAPACITY_SELL - 227 bytes
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
 
when using CKB to buy sUDT:

```
SWAP_REQ_CAPACITY_SELL - 146 bytes
{
  capacity: - 8 bytes
  data: null for buy - 0 bytes
  type: null for buy - 0 bytes
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

- `capacity`
- `data`: When selling sudt, `data` should be `sudt_amount` . When buying sudt, `data` should be null.
- `type script`: When selling sudt, `type script` should be `sudt_type` . When buying sudt, `type script` should be  null. 
- `lock script` 
  - `code_hash`: `SWAP_REQ_LOCK_CODE_HASH` 
  - `args`:
    - `version`
    - `amountOutMin`: `amountOutMin`  represents the minimum amount of tokens that trader can redeem. For example, when using sUDT to exchange for CKB, the `amountOutMin` should be the minimum amount of the redeemed CKB, not the minimum capacity of all cell.
    - `user_lock_hash`: hash of user's lock
    - `tips`: The amount of CKB that user pay to miner and aggregator.
    - `tips_sudt`: The amount of sUDT that user pay to  aggregator.
  - `hash_type` 

## Liquidity Request Cell

Liquidity request cell is used for add liquidity to liquidity pool or remove liquidity from liquidity pool by liquidity provider.

```
cell size: 235 bytes
{
capacity: - 8 bytes
data: - 16 bytes
    sudt_amount: u128
type: asset_sudt_type for add / liquidity_sudt_type for remove - 65 bytes
lock: - 146 bytes
    code: LIQUIDITY_REQ_LOCK_CODE_HASH - 32 bytes + 1 byte
    args: info_type_hash_32 (32 bytes, 0..32) | 
		      version (u8, 1 byte, 32..33) | 
		      sudtMin (u128, 16 bytes, 33..49) | 
		      ckbMin (u64, 8 bytes, 49..57) | 
		      user_lock_hash (32 bytes, 57..89) | 
		      tips (8 bytes, 89..97) | 
		      tips_sudt (16 bytes, 97..113) 
}
```

**Field description :** (total size: 235 bytes)
 
- `lock script`
  - `code_hash` : `LIQUIDITY_REQ_LOCK_CODE_HASH`
  - `args`: 
    - `sudtMin` (byte order: little endian) : When it is initially adding liquidity, `sudtMin` has no meaning. When it is not initially adding liquidity, `sudtMin`  represents the minimum amount of CKB that could be used to add liquidity. While removing liquidity, `sudtMin` represents the minimum amount of sUDT that users will receive.
    - `ckbMin` (byte order: little endian):  When it is initially adding liquidity,  `ckbMin`  has no meaning. When it is not initially adding liquidity, `ckbMin`  means minimum amount of CKB that could be used to add liquidity. While removing liquidity, `ckbMin` means minimum amount of CKB  that users will receive.
    - `info_type_hash_32`: type hash of info cell
    - `tips`:  The amount of CKB that users pay to the aggregator.
    - `tips_sudt`: The amount of sUDT that user pay to  aggregator.

## Info Cell

Info cell represents the current state of liquidity pool.

```
cell size: 250 bytes
{
capacity: - 8 bytes
data: - 80 bytes
    ckb_reserve: u128 16 bytes
    sudt_reserve: u128
    total_liquidity: u128
    liquidity_sudt_type_hash: 32 bytes
type: - 65 bytes
    code: INFO_TYPE_CODE_HASH - 32 bytes + 1 byte
    args: id - 32 bytes
lock: - 97 bytes
    code: INFO_LOCK_CODE_HASH - 32 bytes + 1 byte
    args: hash(ckb | asset_sudt_type_hash) 32 bytes | info_type_hash - 32 bytes 
}
```

**Field description :**

- `data` 
  - `ckb_reserve`：Total remaining amount of CKB  in the liquidity pool. 
  - `sudt_reserve`:  Total remaining amount of sUDT in the liquidity pool. 
  - `total_liquidity`: Total liquidity token issued. 
  - `liquidity_sudt_type_hash`:  Liquidty token type hash of this pool. 
- `type script`
  - `args`:   `id`  =  `TypeId ` which is the input index[1] outpoint .
- `lock script` (size: 97 bytes）
  - `args`:
    - `hash(ckb | asset_sudt_type_hash)`: The order of CKB and sUDT in here follows dictionary order
    - `info_type_hash` : The unlock rule relies on info type script.

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

**Field description :** 

- `capacity`: The amount of CKB in liquidity pool.

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

**Field description :** 

- `type script` (size: 65 bytes)
  - `code_hash`: `sudt_type_script`
  - `args`:  in here, we use info cell lock hash as `owner_lock_hash`, since each time the liquidity tokens are minted or burned, info cell are required to be existed in this tx.input
