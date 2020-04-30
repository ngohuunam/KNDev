const operationSchema = {
  process: {
    title: 'Process - schema',
    description: 'describes a process',
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
      of: {
        type: 'object',
        default: { year: '', db: '', col: '', _id: '' },
      },
      group: {
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
        index: true,
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
        index: true,
        check: true,
      },
      aot: {
        type: 'number',
        default: 0,
      },
      end: {
        type: 'number',
        default: 0,
        index: true,
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
    compoundIndexes: [['priority', 'start', 'group', 'level']],
  },
}

export default operationSchema
