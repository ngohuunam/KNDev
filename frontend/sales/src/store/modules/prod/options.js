import rxSchema from './schema'

export const dbName = 'prod'
export const opts = [
  {
    colName: 'film',
    schema: rxSchema,
    endpoint: 'prod_film_2020',
    checkKeys: ['type', 'endAt', 'finishAt', 'details', 'status', 'jobNames'],
    // methods: {},
    // query: {},
    needDumb: true,
  },
]

export const preInsert = (docObj, user_id) => {
  docObj.createdAt = Date.now()
  docObj.createdBy = user_id
  docObj.logs.unshift({ type: 'Create', _rev: null, orderRev: docObj.orderRev, at: docObj.createdAt, by: user_id, note: docObj.note })
  delete docObj.note
  delete docObj.orderRev
}
