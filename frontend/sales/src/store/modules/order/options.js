import schema from './schema'

export const dbName = 'order'
export const opts = {
  film: {
    colName: 'film',
    schema: schema.film,
    endpoint: 'order_film_2020',
    checkKeys: ['team', 'endAt', 'finishAt', 'foreignTitle', 'vietnameseTitle', 'premiereDate', 'status', 'productNames'],
    // methods: {},
    query: {},
    sort: { createdAt: -1 },
  },
}
export const createQuery = {
  film: ui => {
    const $nin = Object.keys(ui).filter(_id => ui[_id].dropped)
    return { _id: { $nin } }
  },
}
