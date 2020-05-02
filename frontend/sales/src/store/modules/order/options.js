import schema from './schema'
import { unixTime } from '../../../utils'

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
// childs[colName] = Object.entries(schema[colName].properties).reduce((pre, [k, v]) => (v.child ? [...pre, ...[k]] : [...pre]), [])
const film = {
  colName: 'film',
  endpoint: 'order_film_2020',
  schema: schema.film,
  checkKeys: checkKeys.film,
  childs: childs.film,
  sort: [{ endAt: 1 }, { premiereDate: 1 }, { createdAt: -1 }],
  prepare: _order => {
    // const _newOrder = { ...construct(schema.film), ..._order }
    _order.foreignTitle = _order.foreignTitle.toProperCase()
    _order._id = _order.foreignTitle.replace(/\s/g, '_')
    _order.vietnameseTitle = _order.vietnameseTitle.toProperCase()
    _order.premiereDate = unixTime(_order.premiereDate)
    _order.endAt = unixTime(_order.endAt)
    return _order
  },
  preInsert: (docObj, user_id) => {
    docObj.createdAt = Date.now()
    docObj.createdBy = user_id
    docObj.status = 'Created'
    docObj.processes = docObj.processes.map(process => process.key)
    docObj.products = docObj.products.map(product => product.name)
    docObj.logs.unshift({ type: 'Insert', _rev: '', at: docObj.createdAt, by: user_id, note: docObj.note })
    delete docObj.note
  },
  createSelector: function(ui) {
    const $nin = Object.keys(ui).filter(_id => ui[_id].dropped)
    const sortQueries = this.sort.flatMap(obj => Object.keys(obj).map(k => ({ [k]: { $gt: null } })))
    return { $and: [...sortQueries, ...[{ _id: { $nin } }]] }
  },
}

export const dbName = 'order'
export const opts = { film }
