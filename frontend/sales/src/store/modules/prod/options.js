import schema from './schema'

const checkKeys = {}
const childs = {}
Object.entries(schema).map(([colName, { properties }]) => {
  checkKeys[colName] = []
  childs[colName] = []
  Object.entries(properties).map(([prop, { check, child }]) => {
    if (check) checkKeys[colName].push(prop)
    if (child) childs[colName].push(prop)
  })
})

const film = {
  colName: 'film',
  endpoint: 'prod_film_2020',
  schema: schema.film,
  checkKeys: checkKeys.film,
  childs: childs.film,
  sort: [{ endAt: 1 }, { createdAt: -1 }],
  prepare: doc => doc,
  preInsert: null,
  createSelector: function({ prodUi, orderUi }) {
    const $nin_prod = Object.keys(prodUi).filter(_id => prodUi[_id].dropped)
    const $nin_order = Object.keys(orderUi).filter(_id => orderUi[_id].dropped)
    const sortQueries = this.sort.flatMap(obj => Object.keys(obj).map(k => ({ [k]: { $gt: null } })))
    return { $and: [...sortQueries, ...[{ 'parent._id': { $nin: $nin_order } }, { _id: { $nin: $nin_prod } }]] }
  },
}
// const sortQueries = this.sort.reduce((pre, cur) => [...pre, ...Object.keys(cur).map(k => ({ [k]: { $gt: null } }))], [])

export const dbName = 'prod'
export const opts = { film }
