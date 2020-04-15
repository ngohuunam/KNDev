export default {
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
      final: true,
    },
    orderId: {
      type: 'string',
      index: true,
    },
    type: {
      type: 'string',
    },
    createdAt: {
      type: 'number',
    },
    createdBy: {
      type: 'string',
    },
    endAt: {
      type: 'number',
    },
    finishAt: {
      type: 'number',
    },
    details: {
      type: 'string',
    },
    status: {
      type: 'string',
    },
    jobs: {
      type: 'array',
    },
    jobNames: {
      type: 'string',
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
    },
  },
  required: ['name', 'orderId'],
  compoundIndexes: [['status', 'type']],
}
