const orderSchema = {
  film: {
    title: 'Order - film schema',
    description: 'describes a film order',
    version: 0,
    type: 'object',
    indexes: ['endAt', 'premiereDate', 'status', 'createdAt', ['endAt', 'premiereDate', 'createdAt']],
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
        default: '',
        check: true,
      },
      createdAt: {
        type: 'number',
        default: 0,
      },
      createdBy: {
        type: 'string',
        final: true,
        default: 0,
      },
      endAt: {
        type: 'number',
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
        default: 0,
        check: true,
      },
      status: {
        type: 'string',
        default: 'Created',
        check: true,
      },
      processes: {
        type: 'array',
        item: {
          type: 'string',
        },
        default: [],
        child: true,
        check: true,
      },
      plan: {
        type: 'string',
        default: '',
        check: true,
      },
      products: {
        type: 'array',
        item: {
          type: 'string',
        },
        default: [],
        child: true,
        check: true,
      },
      plans: {
        type: 'array',
        item: {
          type: 'string',
        },
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
  },
}

export default orderSchema
