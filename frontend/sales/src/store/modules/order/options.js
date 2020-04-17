import rxSchema from './schema'

export const dbName = 'order'
export const opts = [
  {
    colName: 'film',
    schema: rxSchema,
    endpoint: 'order_film_2020',
    checkKeys: ['team', 'endAt', 'finishAt', 'foreignTitle', 'vietnameseTitle', 'premiereDate', 'status', 'productNames'],
    // methods: {},
    // query: {},
    needDumb: true,
  },
]
