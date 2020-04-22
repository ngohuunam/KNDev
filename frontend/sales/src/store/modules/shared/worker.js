import { initDb, pullData, preInsert as _preInsert } from '.'
import { queryBy_id, filter_rev, year } from '../../../tools'

export class Worker {
  constructor(userId, token, dbName, commit, commitRoot, preInsert) {
    this.userId = userId
    this.token = token
    this.dbName = dbName
    this.colNames = []
    this.RxCol = {}
    this.list = {}
    this.commit = commit
    this.commitRoot = commitRoot
    this.preInsert = preInsert || _preInsert
    this.state = ''
    this.endpoint = {}
    this.sort = {}
    this.queries = {}
    this.childs = {}
    this.handleError = {
      insert(e, _id) {
        console.error(e)
        this.state = 'insert error'
        if (e.message.includes('conflict')) this.commitRoot('pushToasts', { severity: 'error', summary: 'CONFLICT', detail: `${_id} existed`, life: 10000 })
        else this.commitRoot('pushToasts', { severity: 'error', summary: 'ERROR', detail: `${e.message}`, life: 10000 })
      },
      state(e, state) {
        this.state = state
        console.error(state, e)
      },
    }
  }
  // postMessage(msg) {
  //   this.ports.map(port => port.postMessage(msg))
  // }
  // commit(type, payload, colName) {
  //   this.postMess({ action: 'commit', type: `${this.dbName}/${colName}/${type}`, payload })
  // }
  // commitRoot(type, payload) {
  //   this.postMess({ action: 'commit', type, payload })
  // }
  commitList(colName) {
    console.log(`(commitList) list.${colName}`, this.list[colName])
    this.commit('setStates', { keys: ['loading', 'list'], datas: [false, this.list[colName]] }, colName)
  }
  commitListAll() {
    console.log('(commitListAll) list', this.list)
    for (const colName in this.list) {
      this.commit('setStates', { keys: ['loading', 'list'], datas: [false, this.list[colName]] }, colName)
    }
  }
  init(opts, queryParams, needPullList) {
    console.log('(init) opts', opts)
    this.state = 'init'
    return Promise.all(
      Object.values(opts).map(opt => {
        const { colName, checkKeys } = opt
        this.endpoint[colName] = opt.endpoint
        this.sort[colName] = opt.sort
        this.childs[colName] = opt.childs
        this.queries[colName] = opts[colName].createQuery(queryParams[colName])
        opt.query = this.queries[colName]
        console.log(`${this.dbName} ${colName} init query`, opt.query)
        return initDb(this.dbName, opt, this.token)
          .then(({ rxCol, sync }) => {
            this.RxCol[colName] = rxCol
            this.RxCol[colName].preInsert(docObj => this.preInsert(docObj, this.userId), true)
            this.RxCol[colName].preSave((plainData, rxDocument) => this.preSave(plainData, rxDocument, this.userId), true)
            this.RxCol[colName].insert$.subscribe(changeEvent => this.insert$(changeEvent, colName))
            this.RxCol[colName].update$.subscribe(changeEvent => this.update$(changeEvent, checkKeys, colName))
            sync.denied$.subscribe(docData => this.handleError.state(docData, 'denied$ error'))
            sync.error$.subscribe(error => this.handleError.state(error, 'error$ error'))
            this.colNames.push(this.RxCol[colName].name)
            if (needPullList) {
              return this.RxCol[colName]
                .find(opt.query)
                .sort(opt.sort)
                .exec()
                .then(rxDocs => {
                  this.list[colName] = rxDocs.map(rxDoc => rxDoc.toJSON())
                  this.commit('setState', { key: 'loading', data: false }, colName)
                  return (this.state = 'ready')
                })
            }
            this.commit('setState', { key: 'loading', data: false }, colName)
            return (this.state = 'ready')
          })
          .catch(e => this.handleError.state(e, 'init error'))
      }),
    )
  }

  pullList(colName, query, sort) {
    return this.RxCol[colName]
      .find(query || this.queries[colName])
      .sort(sort || this.sort[colName])
      .exec()
      .then(rxDocs => (this.list[colName] = rxDocs.map(rxDoc => rxDoc.toJSON())))
      .catch(e => this.handleError.state(e, 'pullList error'))
  }

  pullListAll(queries, sort) {
    return Promise.all(
      this.colNames.map(colName =>
        this.RxCol[colName]
          .find(queries[colName] || this.queries[colName])
          .sort(sort || this.sort[colName])
          .exec()
          .then(rxDocs => (this.list[colName] = rxDocs.map(rxDoc => rxDoc.toJSON())))
          .catch(e => this.handleError.state(e, 'pullListAll error')),
      ),
    )
  }

  insert$(changeEvent, colName) {
    console.log('insert$: ', changeEvent)
    const _$doc = { ...changeEvent.data.v }
    this.commit('unshift', { key: 'list', data: _$doc }, colName)
    return this.pullList(colName)
  }

  update$(changeEvent, _checkKeys, colName) {
    console.log('update$:', changeEvent)
    const _$doc = { ...changeEvent.data.v }
    const { doc, index } = queryBy_id(_$doc._id, this.list[colName])
    let _needUpdateUserState = false
    if (!_$doc.dropped) {
      const payload = { colPath: `${year}.${this.dbName}.${colName}`, _id: _$doc._id, changes: {} }
      const lastUpdate = _$doc.logs[0].update
      const updatedKeys = Object.values(lastUpdate).flatMap(keysObj => Object.keys(keysObj))
      console.log('update$ updatedKeys:', updatedKeys)
      _checkKeys.map(key => {
        // if (doc[key] !== _$doc[key]) {
        //   const _change = { old: doc[key], new: _$doc[key], logs: filter_rev(_$doc.logs, doc._rev) }
        //   payload.changes[key] = _change
        //   console.log(`${_$doc._id} - ${key} change:`, _change)
        //   _needUpdateUserState = true
        // }
        if (updatedKeys.includes(key)) {
          // if (Array.isArray(_$doc[key])) key = key + 'Names'
          const _change = { old: doc[key], new: _$doc[key], logs: filter_rev(_$doc.logs, doc._rev) }
          payload.changes[key] = _change
          console.log(`${_$doc._id} - ${key} change:`, _change)
          _needUpdateUserState = true
        }
      })
      if (_needUpdateUserState) this.commitRoot('user/Worker', { name: 'change', payload })
    }
    this.list[colName][index] = _$doc
    this.commit('replace', { key: 'list', data: _$doc, field: '_id' }, colName)
  }

  insert = (doc, colName) => {
    return this.RxCol[colName]
      .insert(doc)
      .then(() => {
        this.commit('setState', { key: 'new', data: null }, colName)
        this.commitCloseDialog('Create')
      })
      .catch(e => this.handleError.insert(e, doc._id))
  }

  inserts = (docs, colName) => {
    return Promise.all(
      docs.map(doc => {
        doc = this.repare[colName](doc)
        return this.RxCol[colName].insert(doc).catch(e => this.handleError.insert(e, doc._id))
      }),
    )
      .then(_docs => {
        const _docOks = _docs.map(_doc => {
          if (_doc) return _doc._id
        })
        if (_docOks.length) this.commitCloseDialog(`${_docOks.join(', ')} created`)
        else this.commitCloseDialog(`Nothing created`)
      })
      .catch(e => this.handleError.state(e, 'inserts error'))
  }

  drop = ({ docs, note }, colName) => {
    const _ids = docs.map(doc => doc._id)
    const query = { _id: { $in: _ids } }
    return this.RxCol[colName]
      .find(query)
      .update({ update: { $now: { dropped: 'now' } }, type: 'Drop', note })
      .then(() => this.commitCloseDialog('Delete'))
      .catch(e => this.handleError.state(e, 'drop error'))
  }

  preSave = (plainData, rxDocument, userId) => {
    const { type, note, update } = plainData
    plainData.logs.unshift({ type: type || 'Update', _rev: rxDocument._rev, at: Date.now(), by: userId, note, update })
    delete plainData.note
    delete plainData.description
    delete plainData.type
    delete plainData.update
  }

  commitCloseDialog = mess => {
    this.commitRoot('dialog/setState', { key: 'loading', data: false })
    if (mess) this.commitRoot('dialog/setMess', { text: `${mess} Success`, severity: 'success' })
    setTimeout(() => {
      this.commitRoot('dialog/setMess', { text: '', severity: '' })
      this.commitRoot('dialog/setState', { key: 'isOpen', data: false })
    }, 1000)
  }

  sync = (query, colName, sort) => {
    query = query || this.queries[colName]
    console.log('(resync) query', query)
    return pullData(this.RxCol[colName], this.endpoint[colName], query, this.token)
      .then(() =>
        this.RxCol[colName]
          .find(query)
          .sort(sort || this.sort[colName])
          .exec()
          .then(rxDocs => {
            this.list[colName] = rxDocs.map(rxDoc => rxDoc.toJSON())
            console.log(`(resync) list ${colName}`, this.list[colName])
            return this.commit('setState', { key: 'list', data: this.list[colName] }, colName)
          }),
      )
      .catch(e => this.handleError.state(e, 'resync error'))
  }
}
