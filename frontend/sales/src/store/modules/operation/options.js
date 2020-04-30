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
const process = {
  colName: 'process',
  endpoint: 'process_2020',
  schema: schema.process,
  checkKeys: checkKeys.process,
  childs: [],
  sort: { level: 1 },
  prepare: doc => doc,
  preInsert: null,
  createQuery() {
    return {}
  },
}

export const dbName = 'operation'
export const opts = { process }
