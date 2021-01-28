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
      label: 'Contract',
      items: [
        'contract/cell',
        {
          type: 'category',
          label: 'Transaction Structure',
          items:['contract/swap-tx', 'contract/add-tx', 'contract/remove-tx'],
          collapsed: false,
        },
        'contract/script',
      ],
    },
  ]

};
