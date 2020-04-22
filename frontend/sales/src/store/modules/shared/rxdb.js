import { create, plugin } from 'rxdb/plugins/core'
import RxDBNoValidateModule from 'rxdb/plugins/no-validate'
import RxDBReplicationModule from 'rxdb/plugins/replication'
import * as PouchdbAdapterHttp from 'pouchdb-adapter-http'
import PouchdbAdapterIndexeddb from 'pouchdb-adapter-indexeddb'
import UpdatePlugin from './update'
import PouchDB from 'pouchdb-core'
import { fetch } from 'pouchdb-fetch'

const loadPlugins = () => {
  plugin(RxDBNoValidateModule)
  plugin(RxDBReplicationModule)
  plugin(PouchdbAdapterHttp)
  plugin(PouchdbAdapterIndexeddb)
  plugin(UpdatePlugin)
}

export const initDb = (dbName, { colName, schema, methods, endpoint, query }, token) => {
  const opt = {
    db: {
      name: dbName,
      adapter: 'indexeddb',
      multiInstance: false,
      queryChangeDetection: true,
      pouchSettings: {
        auto_compaction: true,
      },
    },
    col: {
      name: colName,
      schema,
      methods,
      sync: true,
    },
  }
  loadPlugins()
  return create(opt.db)
    .then(_rxdb => _rxdb.collection(opt.col))
    .then(rxCol => {
      return pullData(rxCol, endpoint, query, token).then(_opt => {
        _opt.direction.push = true
        _opt.options.live = true
        const sync = rxCol.sync(_opt)
        return { rxCol, sync }
      })
    })
}

export const pullData = (rxCol, endpoint, query, token) => {
  const _sub$ = { e: '', d: '', c: '' }
  const url = `${self.location.origin}/db/${endpoint}`
  const _opt = {
    remote: new PouchDB(url, {
      fetch: (url, opts) => {
        opts.headers.set('Authorization', 'Bearer ' + token)
        return fetch(url, opts)
      },
      auto_compaction: true,
    }),
    waitForLeadership: false,
    direction: { pull: true, push: true },
    options: { live: false, retry: true },
  }
  if (query) _opt.query = rxCol.find(query)
  console.log('pullData _opt', _opt)
  return new Promise((resolve, reject) => {
    const syncState = rxCol.sync(_opt)
    _sub$.c = syncState.complete$.subscribe(completed => {
      // console.log(`sync ${endpoint} complete$: `, completed)
      if (completed) {
        rxCol.seq = completed.last_seq
        for (let key in _sub$) _sub$[key].unsubscribe()
        resolve(_opt)
      }
    })
    _sub$.e = syncState.error$.subscribe(error => reject(error))
    _sub$.d = syncState.denied$.subscribe(docData => reject(docData))
  })
}
