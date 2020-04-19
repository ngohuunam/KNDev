import { initDb, pullData, preInsert as _preInsert } from '.'
import { queryBy_id, pushSortBy_key_des, filter_rev, year } from '../../../tools'

export class Worker {
  constructor(userId, token, dbName, opts, ports, preInsert) {
    this.userId = userId
    this.token = token
    this.dbName = dbName
    this.opts = opts
    this.RxCol = {}
    this.list = {}
    this.ports = ports
    this.preInsert = preInsert || _preInsert
    this.state = ''
  }
  postMessage(msg) {
    this.ports.map(port => port.postMessage(msg))
  }
  commit(type, payload, colName) {
    this.postMessage({ action: 'commit', type: `${this.dbName}/${colName}/${type}`, payload })
  }
  commitRoot(type, payload) {
    this.postMessage({ action: 'commit', type, payload })
  }
  commitList(colName) {
    console.log(`(commitList) list.${colName}`, this.list[colName])
    this.commit('setState', { key: 'list', data: this.list[colName] }, colName)
  }
  commitListAll() {
    console.log('(commitListAll) list', this.list)
    for (const colName in this.list) {
      this.commit('setState', { key: 'list', data: this.list[colName] }, colName)
    }
  }
  init(queries) {
    this.state = 'init'
    return Promise.all(
      Object.values(this.opts).map(opt => {
        const { colName, checkKeys } = opt
        opt.query = queries[colName]
        console.log(`${this.dbName} ${colName} init query`, opt.query)
        return initDb(this.dbName, opt, this.token)
          .then(({ rxCol, sync }) => {
            const { sort } = opt
            this.RxCol[colName] = rxCol
            this.RxCol[colName].preInsert(docObj => this.preInsert(docObj, this.userId), true)
            this.RxCol[colName].insert$.subscribe(changeEvent => this.insert$(changeEvent, colName))
            this.RxCol[colName].update$.subscribe(changeEvent => this.update$(changeEvent, checkKeys, colName))
            sync.denied$.subscribe(docData => {
              this.state = 'sync denied'
              console.log('denied$: ', docData)
            })
            sync.error$.subscribe(error => {
              this.state = 'sync error'
              console.log('error$: ', error)
            })
            return this.RxCol[colName]
              .find(opt.query)
              .sort(sort)
              .exec()
              .then(rxDocs => {
                this.list[colName] = rxDocs.map(rxDoc => rxDoc.toJSON())
                // this.begin(colName)
                this.commit('setState', { key: 'loading', data: false }, colName)
                return (this.state = 'ready')
              })
          })
          .catch(e => {
            this.state = 'init error'
            console.log('init error: ', e)
          })
      }),
    )
  }

  insert$(changeEvent, colName) {
    console.log('insert$: ', changeEvent)
    const _$doc = { ...changeEvent.data.v }
    if (this.list[colName].length) {
      const { doc, index } = queryBy_id(_$doc._id, this.list[colName])
      if (!doc) {
        const _idx = pushSortBy_key_des(this.list[colName], _$doc, 'createdAt')
        this.commit('insertAt', { key: 'list', data: _$doc, idx: _idx }, colName)
      } else if (!doc._rev.startsWith('1-')) {
        this.list[colName][index] = _$doc
        this.commit('replaceAt', { key: 'list', data: _$doc, idx: index }, colName)
      }
    } else {
      this.list[colName].push(_$doc)
      this.commit('setState', { key: 'list', data: this.list[colName] }, colName)
    }
  }

  update$(changeEvent, _checkKeys, colName) {
    console.log('update$:', changeEvent)
    const _$doc = { ...changeEvent.data.v }
    let _needUpdateUserState = false
    if (this.list[colName].length) {
      const { doc, index } = queryBy_id(_$doc._id, this.list[colName])
      if (!doc) {
        const _idx = pushSortBy_key_des(this.list[colName], _$doc, 'createdAt')
        this.commit('insertAt', { key: 'list', data: _$doc, idx: _idx }, colName)
      } else if (doc._rev !== _$doc._rev) {
        if (!_$doc.dropped) {
          const payload = { colPath: `${year}.${this.dbName}.${colName}`, _id: _$doc._id, changes: {} }
          _checkKeys.map(key => {
            if (doc[key] !== _$doc[key]) {
              console.log('update$ doc:', doc)
              console.log('update$ _$doc.logs:', _$doc.logs)
              const _change = { old: doc[key], new: _$doc[key], logs: filter_rev(_$doc.logs, doc._rev) }
              payload.changes[key] = _change
              console.log('_$doc._id:', _$doc._id)
              console.log('key:', key)
              console.log('change:', _change)
              _needUpdateUserState = true
            }
          })
          if (_needUpdateUserState) this.commitRoot('user/Worker', { name: 'change', payload })
        }
        this.list[colName][index] = _$doc
        this.commit('replaceAt', { key: 'list', data: _$doc, idx: index }, colName)
      }
    } else {
      this.list[colName].push(_$doc)
      this.commit('setState', { key: 'list', data: this.list[colName] }, colName)
    }
  }

  create = (doc, colName) => {
    return this.RxCol[colName]
      .insert(doc)
      .then(() => {
        this.commit('setState', { key: 'new', data: null }, colName)
        this.commitCloseDialog('Create')
      })
      .catch(e => {
        console.error(e)
        this.state = 'create error'
        if (e.message.includes('conflict')) this.commitRoot('pushToasts', { severity: 'error', summary: 'CONFLICT', detail: `${doc._id} existed`, life: 10000 })
        else this.commitRoot('pushToasts', { severity: 'error', summary: 'ERROR', detail: `${e.message}`, life: 10000 })
      })
  }

  creates = (docs, repare, colName) => {
    return Promise.all(
      docs.map(doc => {
        doc = repare[colName](doc)
        return this.RxCol[colName].insert(doc).catch(e => {
          console.error(e)
          if (e.message.includes('conflict')) this.commitRoot('pushToasts', { severity: 'error', summary: 'CONFLICT', detail: `${doc._id} existed`, life: 10000 })
          else this.commitRoot('pushToasts', { severity: 'error', summary: 'ERROR', detail: `${e.message}`, life: 10000 })
        })
      }),
    )
      .then(_docs => {
        const _docOks = _docs.map(_doc => {
          if (_doc) return _doc._id
        })
        if (_docOks.length) this.commitCloseDialog(`${_docOks.join(', ')} created`)
        else this.commitCloseDialog(`Nothing created`)
      })
      .catch(e => console.error(e))
  }

  drop = ({ docs, note }, colName) => {
    Promise.all(
      docs.map(doc => {
        doc.dropped = Date.now()
        doc.logs.unshift({ type: 'Drop', _rev: doc._rev, at: doc.dropped, by: this.userId, note: note })
        return this.RxCol[colName].upsert(doc)
      }),
    )
      .then(() => this.commitCloseDialog('Delete'))
      .catch(e => {
        this.state = 'drop error'
        console.error(e)
      })
  }

  commitCloseDialog = mess => {
    this.commitRoot('dialog/setState', { key: 'loading', data: false })
    if (mess) this.commitRoot('dialog/setMess', { text: `${mess} Success`, severity: 'success' })
    setTimeout(() => {
      this.commitRoot('dialog/setMess', { text: '', severity: '' })
      this.commitRoot('dialog/setState', { key: 'isOpen', data: false })
    }, 1000)
  }

  sync = (query, colName) => {
    console.log('(resync) query', query)
    pullData(this.RxCol[colName], this.opts[colName].endpoint, query, this.token)
      .then(() =>
        this.RxCol[colName]
          .find(query)
          .sort(this.opts[colName].sort)
          .exec()
          .then(rxDocs => {
            this.list[colName] = rxDocs.map(rxDoc => rxDoc.toJSON())
            console.log(`(resync) list ${colName}`, this.list[colName])
            this.commit('setState', { key: 'list', data: this.list[colName] }, colName)
          }),
      )
      .catch(e => {
        this.state = 'resync error'
        console.error(e)
      })
  }
}
