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
        check: true,
      },
      type: {
        type: 'string',
        default: '',
        check: true,
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
        check: true,
      },
      finishAt: {
        type: 'number',
        index: true,
        default: 0,
        check: true,
      },
      details: {
        type: 'string',
        default: '',
        check: true,
      },
      status: {
        type: 'string',
        index: true,
        default: '',
        check: true,
      },
      process: {
        type: 'string',
        default: '',
      },
      jobs: {
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
        },
        default: [],
      },
    },
    required: ['name', 'orderId'],
    compoundIndexes: [
      // ['endAt', 'name'],
      // ['endAt', 'status'],
      // ['endAt', 'orderId'],
      ['endAt', 'createdAt'],
      // ['createdAt', 'orderId'],
      // ['createdAt', 'status'],
      // ['createdAt', 'endAt'],
      // ['createdAt', 'name'],
      // ['status', 'orderId'],
      // ['status', 'endAt'],
      // ['status', 'name'],
    ],
  },
}

export default prodSchema
