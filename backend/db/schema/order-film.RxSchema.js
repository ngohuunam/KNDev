const order_film = {
  title: 'film schema',
  description: 'describes a film order',
  version: 0,
  type: 'object',
  properties: {
    _id: {
      type: 'string',
      primary: true,
    },
    client: {
      type: 'string',
      default: 'Film',
      final: true,
    },
    team: {
      type: 'string',
    },
    createdAt: {
      type: 'number',
      default: 1586368186000,
      index: true,
    },
    createdBy: {
      type: 'string',
      final: true,
    },
    endAt: {
      type: 'number',
    },
    finishAt: {
      type: 'number',
    },
    foreignTitle: {
      type: 'string',
      final: true,
    },
    vietnameseTitle: {
      type: 'string',
    },
    premiereDate: {
      type: 'number',
    },
    status: {
      type: 'string',
    },
    products: {
      type: 'array',
    },
    productNames: {
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
  compoundIndexes: [['status', 'vietnameseTitle']],
}

module.exports = order_film
