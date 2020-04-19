import schema from './schema'

export const dbName = 'prod'
export const opts = {
  film: {
    colName: 'film',
    schema: schema.film,
    endpoint: 'prod_film_2020',
    checkKeys: ['type', 'endAt', 'finishAt', 'details', 'status', 'jobNames'],
    // methods: {},
    query: {},
    sort: { createdAt: -1 },
  },
}

export const createQuery = {
  film: ({ prodUi, orderUi }) => {
    console.log('(createQuery) prodUi', prodUi)
    console.log('(createQuery) orderUi', orderUi)
    const $nin_prod = Object.keys(prodUi).filter(_id => prodUi[_id].dropped)
    const $nin_order = Object.keys(orderUi).filter(_id => orderUi[_id].dropped)
    return { $and: [{ orderId: { $nin: $nin_order } }, { _id: { $nin: $nin_prod } }, { createdAt: { $gt: null } }] }
  },
}

export const preInsert = (docObj, user_id) => {
  docObj.createdAt = Date.now()
  docObj.createdBy = user_id
  docObj.logs.unshift({ type: 'Create', _rev: null, orderRev: docObj.orderRev, at: docObj.createdAt, by: user_id, note: docObj.note })
  delete docObj.note
  delete docObj.orderRev
}
