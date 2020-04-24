import rxSchema from './schema'
import { objectDeep as objDeep } from '../../../utils'
import { initDb as initDB } from '../shared'

export const dbName = 'dept'
export const objectDeep = objDeep
export const initDb = initDB

export const opts = [
  {
    colName: 'sales',
    schema: rxSchema,
    endpoint: 'staffs',
    checkKeys: [],
    // methods: {},
    query: {},
  },
]
