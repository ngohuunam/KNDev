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
      label: {
        type: 'string',
        default: '',
      },
      parent: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            default: '',
          },
          _rev: {
            type: 'string',
            default: '',
          },
          dropped: {
            type: 'number',
            default: 0,
          },
        },
        default: { _id: '', _rev: '', dropped: 0 },
        check: true,
      },
      type: {
        type: 'string',
        default: '',
        check: true,
      },
      tag: {
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
        check: true,
      },
      finishAt: {
        type: 'number',
        default: 0,
        check: true,
      },
      details: {
        type: 'object',
        check: true,
      },
      status: {
        type: 'string',
        default: '',
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
