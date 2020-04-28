const operationSchema = {
  plan: {
    title: 'Plan - schema',
    description: 'describes a plan',
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
      createdAt: {
        type: 'number',
        default: 0,
      },
      createdBy: {
        type: 'string',
        default: '',
      },
      level: {
        type: 'number',
        default: 0,
      },
      source: {
        type: 'string',
        default: '',
        check: true,
      },
      target: {
        type: 'string',
        default: '',
        check: true,
      },
      require: {
        type: 'string',
        default: '',
        check: true,
      },
      description: {
        type: 'string',
        default: '',
        check: true,
      },
      main: {
        type: 'string',
        default: '',
        check: true,
      },
      support: {
        type: 'string',
        default: '',
        check: true,
      },
      start: {
        type: 'number',
        default: 0,
        check: true,
      },
      aot: {
        type: 'number',
        default: 0,
      },
      end: {
        type: 'number',
        default: 0,
        check: true,
      },
      finish: {
        type: 'number',
        default: 0,
        check: true,
      },
      types: {
        type: 'array',
        default: [],
        check: true,
      },
      status: {
        type: 'string',
        default: '',
        check: true,
      },
      priority: {
        type: 'number',
        default: 0,
        check: true,
      },
      dropped: {
        type: 'number',
        default: 0,
      },
      jobs: {
        type: 'object',
        default: {},
        check: true,
      },
      tasks: {
        type: 'object',
        default: {},
        check: true,
      },
      previous: {
        type: 'string',
        default: '',
        check: true,
      },
      next: {
        type: 'string',
        default: '',
        check: true,
      },
      rate: {
        type: 'number',
        default: 0,
        check: true,
      },
      logs: {
        type: 'array',
        default: [],
      },
    },
    compoundIndexes: [],
  },
}

export default operationSchema
