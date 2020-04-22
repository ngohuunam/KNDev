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
        check: true,
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
        check: true,
      },
      finishAt: {
        type: 'number',
        default: 0,
        check: true,
      },
      foreignTitle: {
        type: 'string',
        final: true,
        default: '',
      },
      vietnameseTitle: {
        type: 'string',
        default: '',
        check: true,
      },
      premiereDate: {
        type: 'number',
        index: true,
        default: 1609420532000,
        check: true,
      },
      status: {
        type: 'string',
        index: true,
        default: 'Created',
        check: true,
      },
      products: {
        type: 'array',
        default: [],
        child: true,
        check: true,
      },
      plans: {
        type: 'array',
        default: [],
        child: true,
        check: true,
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
      ['endAt', 'premiereDate', 'createdAt'],
      // ['endAt', 'premiereDate', 'status'],
      // ['endAt', 'createdAt', 'premiereDate'],
      // ['endAt', 'status', 'premiereDate'],
      // ['status', 'endAt', 'premiereDate'],
      // ['status', 'endAt', 'createdAt'],
      // ['endAt', 'premiereDate', 'createdAt', 'status'],
      // ['endAt', 'premiereDate', 'status', 'createdAt'],
      // ['endAt', 'status', 'premiereDate', 'createdAt'],
      // ['endAt', 'createdAt'],
      // ['endAt', 'status'],
      // ['createdAt', 'status'],
      // ['createdAt', 'endAt'],
      // ['createdAt', 'premiereDate'],
      // ['premiereDate', 'status'],
    ],
  },
}

export default orderSchema
