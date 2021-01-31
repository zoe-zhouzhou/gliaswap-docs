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
      label: 'Product',
      items: [
        'product/overview',
        'product/fee',

      ],
    },

    {
      type: 'category',
      label: 'Protocol',
      items: [
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
  ]

};