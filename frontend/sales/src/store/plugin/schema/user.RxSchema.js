export default {
  title: 'user schema',
  version: 0,
  type: 'object',
  properties: {
    _id: {
      type: 'string',
      primary: true,
    },
    password: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    phone: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    state: {
      type: 'object',
      default: {},
    },
    department: {
      type: 'string',
    },
    dept: {
      type: 'string',
    },
    page: {
      type: 'string',
    },
    param: {
      type: 'string',
    },
    token: {
      type: 'string',
    },
  },
}
