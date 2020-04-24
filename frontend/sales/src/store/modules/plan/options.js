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
// childs[colName] = Object.entries(schema[colName].properties).reduce((pre, [k, v]) => (v.child ? [...pre, ...[k]] : [...pre]), [])
const film = {
  colName: 'film',
  endpoint: 'plan_film_2020',
  schema: schema.film,
  checkKeys: checkKeys.film,
  childs: childs.film,
  sort: { endAt: 1, premiereDate: 1, createdAt: -1 },
  createQuery: function(ui) {
    const $nin = Object.keys(ui).filter(_id => ui[_id].dropped)
    const sortQueries = Object.keys(this.sort).map(k => ({ [k]: { $gt: null } }))
    return { $and: [...sortQueries, ...[{ _id: { $nin } }]] }
  },
}

export const dbName = 'plan'
export const opts = { film }
