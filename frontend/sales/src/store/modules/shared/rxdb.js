import { create, plugin } from 'rxdb/plugins/core'
import RxDBNoValidateModule from 'rxdb/plugins/no-validate'
import RxDBReplicationModule from 'rxdb/plugins/replication'
import RxDBJsonDumpModule from 'rxdb/plugins/json-dump'
import * as PouchdbAdapterHttp from 'pouchdb-adapter-http'
import PouchdbAdapterIndexeddb from 'pouchdb-adapter-indexeddb'
import PouchDB from 'pouchdb-core'
import { fetch } from 'pouchdb-fetch'

const loadPlugins = () => {
  plugin(RxDBNoValidateModule)
  plugin(RxDBReplicationModule)
  plugin(RxDBJsonDumpModule)
  plugin(PouchdbAdapterHttp)
  plugin(PouchdbAdapterIndexeddb)
}

export const initDb = (dbName, { colName, schema, methods, endpoint, query, needDumb }, token) => {
  const opt = {
    db: {
      name: dbName,
      adapter: 'indexeddb',
      multiInstance: false,
      queryChangeDetection: false,
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
      const _sub$ = { e: '', d: '', c: '' }
      const _opt = {
        remote: new PouchDB(`${self.location.origin}/db/${endpoint}`, {
          fetch: (url, opts) => {
            opts.headers.set('Authorization', 'Bearer ' + token)
            return fetch(url, opts)
          },
        }),
        waitForLeadership: false,
        direction: { pull: true, push: false },
        options: { live: false, retry: true },
      }
      if (query) _opt.query = rxCol.find(query)
      return new Promise((resolve, reject) => {
        const syncState = rxCol.sync(_opt)
        _sub$.c = syncState.complete$.subscribe(completed => {
          // console.log(`sync ${endpoint} complete$: `, completed)
          if (completed) {
            rxCol.seq = completed.last_seq
            for (let key in _sub$) _sub$[key].unsubscribe()
            resolve(completed)
          }
        })
        _sub$.e = syncState.error$.subscribe(error => reject(error))
        _sub$.d = syncState.denied$.subscribe(docData => reject(docData))
      }).then(() => {
        _opt.direction.push = true
        _opt.options.live = true
        const sync = rxCol.sync(_opt)
        if (needDumb) return rxCol.dump().then(({ docs }) => ({ rxCol, sync, docs }))
        return { rxCol, sync }
      })
    })
}

export const initSome = (dbName, colOpts, token) => {
  const dbOpt = {
    name: dbName,
    adapter: 'indexeddb',
    multiInstance: false,
    queryChangeDetection: false,
    pouchSettings: {
      auto_compaction: true,
    },
  }
  loadPlugins()
  const result = {}
  return create(dbOpt).then(_rxdb =>
    Promise.all(
      colOpts.map(({ name, schema, endpoint, query, methods, needDumb }) => {
        const opt = {
          name,
          schema,
          methods,
          sync: true,
        }
        _rxdb.collection(opt).then(rxCol => {
          const _sub$ = { e: '', d: '', c: '' }
          const _opt = {
            remote: new PouchDB(`${self.location.origin}/db/${endpoint}`, {
              fetch: (url, opts) => {
                opts.headers.set('Authorization', 'Bearer ' + token)
                return fetch(url, opts)
              },
            }),
            waitForLeadership: false,
            direction: { pull: true, push: false },
            options: { live: false, retry: true },
          }
          if (query) _opt.query = rxCol.find(query)
          return new Promise((resolve, reject) => {
            const syncState = rxCol.sync(_opt)
            _sub$.c = syncState.complete$.subscribe(completed => {
              // console.log(`sync ${endpoint} complete$: `, completed)
              if (completed) {
                rxCol.seq = completed.last_seq
                for (let key in _sub$) _sub$[key].unsubscribe()
                resolve(completed)
              }
            })
            _sub$.e = syncState.error$.subscribe(error => reject(error))
            _sub$.d = syncState.denied$.subscribe(docData => reject(docData))
          }).then(() => {
            _opt.direction.push = true
            _opt.options.live = true
            const sync = rxCol.sync(_opt)
            if (needDumb) return rxCol.dump().then(({ docs }) => (result[name] = { rxCol, sync, docs }))
            return (result[name] = { rxCol, sync })
          })
        })
      }),
    ).then(() => result),
  )
}
