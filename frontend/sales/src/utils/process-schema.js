const orderSchema = {
  film: {
    title: 'Process schema',
    description: 'describes a film order',
    version: 0,
    type: 'object',
    properties: {
      _id: {
        type: 'string',
        primary: true,
      },
      label: {
        type: 'string',
        default: '',
      },
      level: {
        type: 'number',
        default: 0,
        check: true,
      },
      source: {
        type: 'string',
        default: '',
      },
      target: {
        type: 'string',
        default: '',
      },
      require: {
        type: 'string',
        default: '',
      },
      description: {
        type: 'string',
        default: '',
      },
      main: {
        type: 'string',
        default: '',
      },
      support: {
        type: 'string',
        default: '',
      },
      start: {
        type: 'number',
        index: true,
        default: 0,
      },
      end: {
        type: 'number',
        index: true,
        default: 0,
      },
      finish: {
        type: 'number',
        index: true,
        default: 0,
      },
      type: [],
      status: {
        type: 'string',
        default: '',
      },
      priority: {
        type: 'number',
        index: true,
        default: 0,
      },
      dropped: {
        type: 'number',
        index: true,
        default: 0,
      },
      jobs: {
        type: 'object',
      },
      tasks: {
        type: 'object',
      },
      previous: {
        type: 'string',
        default: '',
      },
      next: {
        type: 'string',
        default: '',
      },
      rate: {
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
    compoundIndexes: [],
  },
}

export default orderSchema
