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
      type: {
        type: 'string',
        default: '',
      },
      collection: {
        type: 'string',
        default: 'Film',
      },
      prod: {
        type: 'string',
        default: '',
      },
      by: {
        type: 'string',
        default: '',
      },
      created: {
        type: 'number',
        default: 0,
      },
      for: {
        type: 'string',
        default: '',
      },
      start: {
        type: 'number',
        default: 0,
      },
      end: {
        type: 'number',
        default: 0,
      },
      finish: {
        type: 'number',
        default: 0,
        check: true,
      },
      status: {
        type: 'string',
        default: '',
        check: true,
      },
      rate: {
        type: 'number',
        default: 0,
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
      process: {
        type: 'object',
        properties: {},
        check: true,
      },
    },
    compoundIndexes: [],
  },
}

export default planSchema
