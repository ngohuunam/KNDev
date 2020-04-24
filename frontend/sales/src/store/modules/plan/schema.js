const planSchema = {
  film: {
    title: 'Plan - schema',
    description: 'describes a plan',
    version: 0,
    type: 'object',
    properties: {
      _id: {
        type: 'string',
        primary: true,
      },
      collection: {
        type: 'string',
        final: true,
        default: 'Film',
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
      startAt: {
        type: 'number',
        index: true,
        default: 0,
        check: true,
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
      belongTo: {
        type: 'string',
        final: true,
        default: '',
      },
      status: {
        type: 'string',
        index: true,
        default: 'Created',
        check: true,
      },
      jobs: {
        type: 'array',
        default: [],
        item: {
          type: 'object',
          properties: {},
        },
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
      ['endAt', 'startAt'],
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

export default planSchema
