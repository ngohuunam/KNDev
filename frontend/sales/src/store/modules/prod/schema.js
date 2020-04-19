const prodSchema = {
  film: {
    title: 'Prod - film schema',
    description: 'describes a film product',
    version: 0,
    type: 'object',
    properties: {
      _id: {
        type: 'string',
        primary: true,
      },
      name: {
        type: 'string',
        index: true,
        default: '',
      },
      orderId: {
        type: 'string',
        index: true,
        default: '',
      },
      orderDropped: {
        type: 'number',
        default: 0,
      },
      type: {
        type: 'string',
        default: '',
      },
      createdAt: {
        type: 'number',
        index: true,
        default: 0,
      },
      createdBy: {
        type: 'string',
        default: '',
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
      details: {
        type: 'string',
        default: '',
      },
      status: {
        type: 'string',
        index: true,
        default: '',
      },
      jobs: {
        type: 'array',
        default: [],
      },
      jobNames: {
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
    required: ['name', 'orderId'],
    compoundIndexes: [
      ['createdAt', 'status'],
      ['createdAt', 'endAt'],
      ['status', 'endAt'],
      ['createdAt', 'orderId'],
      ['status', 'orderId'],
      ['endAt', 'orderId'],
      ['createdAt', 'name'],
      ['status', 'name'],
      ['endAt', 'name'],
    ],
  },
}

export default prodSchema
