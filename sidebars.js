module.exports = {
  docs: [

    {
      type: 'category',
      label: 'Start',
      items: [
        'start/intro',
      ],
    },
    {
      type: 'category',
      label: 'Run Gliaswap',
      items: [
        'run/run',
      ],
    },
    {
      type: 'category',
      label: 'Product',
      items: [
        'product/overview',
        'product/fee',
      ],
      collapsed: false,
    },

    {
      type: 'category',
      label: 'Protocol',
      items: [
        {
          type: 'category',
          label: 'Swap sUDT/CKB',
          items:
          [
            'tx-script/cell',
            {
              type: 'category',
              label: 'Transaction Structure',
              items:['tx-script/swap-tx', 'tx-script/pool-tx'],
              collapsed: false,
            },
            {
              type: 'category',
              label: 'Script',
              items:['tx-script/info-type-script', 'tx-script/info-lock-script', 'tx-script/swap-lock-script','tx-script/liquidity-lock-script',],
              collapsed: false,
            },
          ],
        },
        {
          type: 'category',
          label: 'Swap sUDT/sUDT',
          items:
          [
            'tx-script-sudt/cell',
            {
              type: 'category',
              label: 'Transaction Structure',
              items:['tx-script-sudt/swap-tx', 'tx-script-sudt/pool-tx'],
              collapsed: false,
            },
            {
              type: 'category',
              label: 'Script',
              items:['tx-script-sudt/info-type-script', 'tx-script-sudt/info-lock-script', 'tx-script-sudt/swap-lock-script','tx-script-sudt/liquidity-lock-script',],
              collapsed: false,
            },
          ],
        },       
      ],
      collapsed: false,
    },
    {
      type: 'category',
      label: 'Reference',
      items: [
        'ref/faq',
      ],
    },
  ]

};