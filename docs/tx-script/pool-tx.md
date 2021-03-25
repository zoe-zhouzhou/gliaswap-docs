---
id: pool-tx
sidebar_label: Pool
title: Pool transaction structure
---

In pool page，when Liquidity Providers（LPs) mananger their liquidity, 5 types of transaction may be involved:

1. Anyone can creat a pool
2. Liquidity Providers（LPs) submit add liquidity request
3. Liquidity Providers（LPs) submit remove liquidity request
4. Aggregators match liquidity request with pool to help LP to manager their liquidity sucessfully
5. Liquidity Providers（LPs) cancel liquidity request

## 1. Creat a pool

Creat a pool in Gliaswap is permissionless. In the first version, Gliaswap only support to creat sudt/CKB pool. 

Creat a pool actually is to creat two cell: 
* info cell used to store pool info, including reserve balance, Liquidity token balance and other ID info to indentify the pool
* pool cell used to store the real asset, including CKB and sudt

```
Input
    Alice cell
        capacity
            250 + 186 + tx fee
        data
            NONE
        type
            NONE
        lock
            Alice lock
        
Output
    Info cell
        capacity: 
            250
        data: 
            ckb_reserve: 0
            sudt_reserve: 0
            lp_token_balance: 0
            lp_token_type_hash
        type: 
            code: INFO_TYPE_CODE_HASH 
            args: type id 
        lock: 
            code: INFO_LOCK_CODE_HASH 
            args: hash(ckb | asset_sudt_type_hash) | info_type_hash 
                
     Pool cell
        capacity: 
            186
        data: 
            sudt_amount: 0
        type: 
            <sudt type> 
        lock: 
            <info cell lock> 
```
In this transaction,  Only info type script will be run to verify the tx, which leads to the third validation rule of info type script

### Info type script - rule 4

Rule 4 - If this is a creating pool transaction, verify that the Pool cell is created at the same time as the Info cell, and that the data filled in info cell and pool cell are correct.

## 2. LPs submit add liquidity request

If a LP want to add liqidity to a pool, he/she needs to submit a add liquidity request firstly. For example，Alice want to add M CKB and N sUDT_A to pool:

```
Input
    Alice normal cell
        capacity
            <M + 142 + 142 + tx fee>
        data
            tokenA amount: N
        type
            <tokenA type>
        lock
            <user's lock>
        
Output
     Alice add liquidity request cell    
        capacity: 
            <M + 142 + 142>
        data: 
            sudt_amount: N
        type: 
            <tokenA type>
        lock:
            code: LIQUIDITY_REQ_LOCK_CODE_HASH 
            args: user_lock_hash | version | sudtMin | ckbMin | info_type_hash_32 | 0 | 0 | // tip and tip fee are 0 in current version
```

Notice that this transaction only validates regular SUDT rules constrained in sudt type script.

## 3. LPs submit remove liquidity request

If a LP want to remove liquidity from a pool, he/she needs to submit a remove liquidity request firstly. For example，Bob want to burn L Liquidity token and withdraw the 

```
Input
    Bob normal cell
        capacity
            <235 + tx fee>
        data
            Liquidity token amount: N
        type
            <Liquidity token type>
        lock
            <user's lock>
        
Output
     Bob remove liquidity request cell    
        capacity: 
            235
        data: 
            Liquidity token amount: L
        type: 
            <Liquidity token type>
        lock:
            code: LIQUIDITY_REQ_LOCK_CODE_HASH 
            args: user_lock_hash | version | sudtMin | ckbMin | info_type_hash_32 | 0 | 0 | // tip and tip fee are 0 in current version
```

Notice that this transaction only validates regular SUDT rules constrained in sudt type script.

## 4. Aggregators match liquidity request with pool 

Motivated by the Tip fee claimed in the liquidity request cell, aggregators will continually retrieve the liquidity request cells（including add liquidity request and remove liquidity request） and the pool cells and then compete to match them off-chain and submit matching transactions.

```
Input
    Info cell
        capacity: 
            250
        data: 
            ckb_reserve: X
            sudt_reserve: Y
            lp_token_balance: Z
            lp_token_type_hash
        type: 
            code: INFO_TYPE_CODE_HASH 
            args: type id 
        lock: 
            code: INFO_LOCK_CODE_HASH 
            args: hash(ckb | asset_sudt_type_hash) | info_type_hash 
                
     Pool cell
        capacity: 
            186 + X
        data: 
            sudt_amount: Y
        type: 
            <sudt type> 
        lock: 
            <info cell lock>  
    
     Deal-miner cell
     
     Bob remove liquidity request cell
        capacity: 
            235
        data: 
            Liquidity token amount: l
        type: 
            <Liquidity token type>
        lock:
            code: LIQUIDITY_REQ_LOCK_CODE_HASH 
            args: user_lock_hash | version | sudtMin | ckbMin | info_type_hash_32 | 0 | 0 | // tip and tip fee are 0 in current version
        
     Alice add liquidity request cell    
        capacity: 
            <M + 142 + 142>
        data: 
            sudt_amount: N
        type: 
            <tokenA type>
        lock:
            code: LIQUIDITY_REQ_LOCK_CODE_HASH 
            args: user_lock_hash | version | sudtMin | ckbMin | info_type_hash_32 | 0 | 0 | // tip and tip fee are 0 in current version
            
Output
    Info cell
        capacity: 
            214
        data: 
            ckb_reserve: X - l*X/L + M
            sudt_reserve: Y - l*Y/L + N
            LP_token_balance: L - l + M*L/X
            LP_token_type_hash20
        type: 
            code: Info_TYPE_CODE_HASH 
            args: type id 
        lock: 
            code: INFO_LOCK_CODE_HASH 
            args: hash(ckb | asset_sudt_type_hash) | info_type_hash20 
                
     Pool cell
        capacity: 
            162 + X - l*X/L + M
        data: 
            sudt_amount: Y - l*Y/L + N
        type: 
            <sudt type> 
        lock: 
            <info cell lock> 
    
     Deal-miner cell
     
     Bob normal cell
        capacity: 
            184 + l*X/L
        data: 
            sudt_amount: l*Y/L
        type: 
            <sudt type>
        lock:
            <Bob normal lock>
        
     Alice Liquidity token cell    
        capacity: 
            142
        data: 
            sudt_amount: M*L/X
        type: 
            <LP type>
        lock:
            <Alice normal lock>
            
     Alice change cell
        capacity:
            142
        data:
            sudt_amount: n 
        type
            <sudtA_type>
        lock
            <Alice normal lock>
```

In this transaction, four types of script will be run to verify the tx:

### Info type script - rule 5/rule6/rule7

Rule 5 - If this is a matching liquidity transaction, the cell sequence in this tx should follow the rules blow:

```text

info_in_cell                            info_out_cell
pool_in_cell                            pool_out_cell
                          ------->
aggregator_in_cell                      aggregator_out_cell
[remove_liquidity_request_cell]         [sudt_cell]
[add_liquidity_request_cell]            [liquidity_cell + change_cell(sudt_cell or ckb_cell)]

```

Rules 6 - If this is initially adding liquidity, verify if minting the correct amount Liquidity token for user, and verify if the data storaged in info cell and pool cell is correct.

Rule 7 - If this is not initially adding liquidity, iterate through all request cell

* If it is add liquidity request cell, verify if minting the correct amount Liquidity token for user, and add up the CKB amount, sUDT amount and Liquidity token amount for verifying info cell and pool cell later.
* If it is remove liquidity request cell, verify if withdraw the correct CKB amount and sudt amount for user, and add up the CKB amount, sUDT amount and Liquidity token amount for verifying info cell and pool cell later.
* Verify if the data storaged in info cell and pool cell is correct

### Info lock script - rule 1

Rules 1 - Verify if lock.args is consistent with info type

### Liquidity request lock script - rule 1

Rule 1 - verifity input index[1] is info cell

### sUDT type script

[sUDT proposal](https://talk.nervos.org/t/rfc-simple-udt-draft-spec/4333)


## 5. LPs can cancel their own liquidity request

Normally your will add liquidity or remove liquidity successfully soon after you submit the liquidity request, but if the price fluctuates above the slippage, your request will be pending until the pool price fluctuates back to the price you submitted.

So we provide the cancel option for LPs. LPs can send a transaction to cancel their own liquidity request.

For example, if Bob want to cancel his remove liqidity request:

```
Input
     Bob remove liquidity request cell    
        capacity: 
            235
        data: 
            Liquidity token amount: L
        type: 
            <Liquidity token type>
        lock:
            code: LIQUIDITY_REQ_LOCK_CODE_HASH 
            args: user_lock_hash | version | sudtMin | ckbMin | info_type_hash_32 | 0 | 0 | // tip and tip fee are 0 in current version

    Bob normal cell (used to pay the tx fee)
        
Output
    Bob normal cell
        capacity
            <235>
        data
            Liquidity token amount: N
        type
            <Liquidity token type>
        lock
            <user's lock>

```

This transaction leads to another rule of LIQUIDITY_REQ_LOCK

### Liquidity request lock script - rule 2

Rule 2 - If one of input cell in the transaction use user's lock specified in liquidity request cell args and the corresponding witness is not 0, unlock the request cell directly.
