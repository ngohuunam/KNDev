const orderSchema = {
  film: {
    title: 'Order - film schema',
    description: 'describes a film order',
    version: 0,
    type: 'object',
    properties: {
      _id: {
        type: 'string',
        primary: true,
      },
      client: {
        type: 'string',
        final: true,
        default: 'Film',
      },
      team: {
        type: 'string',
        default: 'Other',
      },
      createdAt: {
        type: 'number',
        index: true,
        default: 0,
      },
      createdBy: {
        type: 'string',
        final: true,
        default: 0,
      },
      endAt: {
        type: 'number',
        index: true,
        default: 0,
      },
      finishAt: {
        type: 'number',
        default: 0,
      },
      foreignTitle: {
        type: 'string',
        final: true,
        default: '',
      },
      vietnameseTitle: {
        type: 'string',
        default: '',
      },
      premiereDate: {
        type: 'number',
        index: true,
        default: 1609420532000,
      },
      status: {
        type: 'string',
        index: true,
        default: 'Created',
      },
      products: {
        type: 'array',
        default: [],
      },
      productNames: {
        type: 'string',
        default: '',
      },
      dropped: {
        type: 'number',
        default: 0,
      },
      logs: {
        type: 'array',
        item: {
          type: 'object',
          properties: {},
        },
        default: [],
      },
    },
    compoundIndexes: [
      ['createdAt', 'status'],
      ['createdAt', 'endAt'],
      ['createdAt', 'premiereDate'],
      ['endAt', 'premiereDate'],
      ['endAt', 'status'],
      ['premiereDate', 'status'],
    ],
  },
}

export default orderSchema
