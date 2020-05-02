import { initDb, pullData } from './rxdb'
import { queryBy_id, filter_rev, year } from '../../../utils'
import isEqual from 'lodash.isequal'

export class Worker {
  constructor(userId, token, dbName, commit, commitRoot) {
    this.userId = userId
    this.token = token
    this.dbName = dbName
    this.commit = commit
    this.commitRoot = commitRoot
    this.colNames = []
    this.state = ''
    this.RxCol = {}
    this.list = {}
    this.preInsert = {}
    this.endpoint = {}
    this.sort = {}
    this.selector = {}
    this.childs = {}
    this.prepare = {}
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
        this.commitRoot('pushToasts', { severity: 'error', summary: state.toUpperCase(), detail: `${e.message}`, life: 10000 })
      },
    }
  }
  commitList(colName) {
    console.log(`(commitList) list.${colName}`, this.list[colName])
    return Promise.resolve(this.commit('setStates', { keys: ['loading', 'list'], datas: [false, this.list[colName]] }, colName))
  }
  commitListAll() {
    console.log('(commitListAll) list', this.list)
    return Promise.all(Object.keys(this.list).map(colName => this.commitList(colName)))
  }
  init(opts, selectorParams) {
    console.log('(init) opts', opts)
    this.state = 'init'
    const _preInsert = (docObj, user_id) => {
      docObj.createdAt = Date.now()
      docObj.createdBy = user_id
      docObj.status = 'Created'
      // if (docObj.processes) docObj.processes = docObj.processes.map(process => process.key)
      docObj.logs.unshift({ type: 'Insert', _rev: '', at: docObj.createdAt, by: user_id, note: docObj.note })
      delete docObj.note
    }
    return Promise.all(
      Object.values(opts).map(opt => {
        const { colName, checkKeys, endpoint, sort, childs, prepare, preInsert } = opt || {}
        this.endpoint[colName] = endpoint
        this.sort[colName] = sort
        this.childs[colName] = childs
        this.prepare[colName] = prepare
        this.preInsert[colName] = preInsert || _preInsert
        if (selectorParams?.[colName]) this.selector[colName] = opt.createSelector(selectorParams[colName])
        else this.selector[colName] = opt.createSelector()
        opt.selector = this.selector[colName]
        console.log(`${this.dbName} ${colName} init selector`, opt.selector)
        return initDb(this.dbName, opt, this.token)
          .then(({ rxCol, sync }) => {
            this.RxCol[colName] = rxCol
            const _RxCol = this.RxCol[colName]
            _RxCol.preInsert(docObj => this.preInsert[colName](docObj, this.userId), true)
            _RxCol.preSave((plainData, rxDocument) => this.preSave(plainData, rxDocument, this.userId), true)
            _RxCol.insert$.subscribe(changeEvent => this.insert$(changeEvent, colName))
            _RxCol.update$.subscribe(changeEvent => this.update$(changeEvent, checkKeys, colName))
            sync.denied$.subscribe(docData => this.handleError.state(docData, 'denied$ error'))
            sync.error$.subscribe(error => this.handleError.state(error, 'error$ error'))
            this.colNames.push(colName)
            return (this.state = 'ready')
          })
          .catch(e => this.handleError.state(e, 'init error'))
      }),
    )
  }

  pullList(colName, selector, sort) {
    selector = selector || this.selector[colName]
    sort = sort || this.sort[colName]
    const query = { selector, sort }
    return new Promise(resolve =>
      this.RxCol[colName]
        .find(query)
        // .sort(sort || this.sort[colName])
        .exec()
        .then(rxDocs => resolve((this.list[colName] = rxDocs.map(rxDoc => rxDoc.toJSON(true)))))
        .catch(e => this.handleError.state(e, `pullList ${colName} error`)),
    )
  }

  pullListAll(selectors, sorts) {
    return Promise.all(this.colNames.map(colName => this.pullList(colName, selectors?.[colName], sorts?.[colName])))
  }

  insert$(changeEvent, colName) {
    console.log('insert$: ', changeEvent)
    const _$doc = { ...changeEvent.documentData }
    this.list[colName].unshift(_$doc)
    this.commit('unshift', { key: 'list', data: _$doc }, colName)
    // return this.pullList(colName)
  }

  update$(changeEvent, _checkKeys, colName) {
    console.log('update$:', changeEvent)
    const _$doc = { ...changeEvent.documentData }
    const { doc, index } = queryBy_id(_$doc._id, this.list[colName])
    let _needUpdateUserState = false
    if (!_$doc.dropped) {
      const payload = { colPath: `${year}.${this.dbName}.${colName}`, _id: _$doc._id, changes: {} }
      const lastUpdate = _$doc.logs[0].update
      const record = key => {
        const _change = { old: doc[key], new: _$doc[key], logs: filter_rev(_$doc.logs, doc._rev) }
        payload.changes[key] = _change
        _needUpdateUserState = true
      }
      if (lastUpdate) {
        const updatedKeys = Object.values(lastUpdate).flatMap(keysObj => Object.keys(keysObj))
        updatedKeys.map(key => (_checkKeys.includes(key) ? record(key) : ''))
      } else _checkKeys.map(key => (isEqual(doc[key], _$doc[key]) ? '' : record(key)))
      if (_needUpdateUserState) this.commitRoot('user/Worker', { name: 'change', payload })
    }
    this.list[colName][index] = _$doc
    this.commit('replace', { key: 'list', data: _$doc, field: '_id' }, colName)
  }

  insert = (doc, colName) =>
    this.RxCol[colName]
      .insert(doc)
      .then(() => {
        this.commit('setState', { key: 'new', data: null }, colName)
        return this.commitCloseDialog('Create')
      })
      .catch(e => this.handleError.insert(e, doc._id))

  inserts = (docs, colName) =>
    Promise.all(docs.map(doc => this.RxCol[colName].insert(this.prepare[colName](doc)).catch(e => this.handleError.insert(e, doc._id))))
      .then(_docs => {
        const _docOks = _docs.reduce((pre, _doc) => [...pre, ...(_doc ? [_doc._id] : [])], [])
        return _docOks.length ? this.commitCloseDialog(`${_docOks.join(', ')} created`) : this.commitCloseDialog(`Nothing created`)
      })
      .catch(e => this.handleError.state(e, 'inserts error'))

  drop = ({ docs, note }, colName) => {
    const _ids = docs.map(doc => doc._id)
    const selector = { _id: { $in: _ids } }
    return this.RxCol[colName]
      .find({ selector })
      .update({ update: { $now: { dropped: 'now' } }, type: 'Drop', note })
      .then(() => this.commitCloseDialog('Delete'))
      .catch(e => this.handleError.state(e, 'drop error'))
  }

  update({ _id, updateObj, note }, colName) {
    console.log('(update) updateObj', updateObj)
    this.RxCol[colName]
      .findOne(_id)
      .update({ update: updateObj, type: 'Update', note })
      .then(() => this.commitCloseDialog('Update: ' + updateObj))
      .catch(e => console.error(e))
  }

  add({ parent_id, child, value, note }, colName) {
    console.log('(add) child', child)
    this.RxCol[colName]
      .findOne(parent_id)
      .update({ update: { $unshift: { [child]: value } }, type: 'Add', note })
      .then(() => this.commitCloseDialog('Add'))
      .catch(e => console.error(e))
  }

  adds({ parent_id, child, value, note }, colName) {
    console.log(child)
    this.RxCol[colName]
      .findOne(parent_id)
      .update({ update: { $concat_start: { [child]: value } }, type: 'Adds', note })
      .then(() => this.commitCloseDialog('Adds'))
      .catch(e => console.error(e))
  }

  preSave = (plainData, rxDocument, userId) => {
    const { type, note, update } = plainData
    plainData.logs.unshift({ type: type || 'Update', _rev: rxDocument._rev, at: Date.now(), by: userId, note, update })
    delete plainData.note
    delete plainData.type
    delete plainData.update
  }

  commitCloseDialog = mess => {
    this.commitRoot('dialog/setState', { key: 'loading', data: false })
    if (mess) {
      // this.commitRoot('dialog/setMess', { text: `${mess} Success`, severity: 'success' })
      this.commitRoot('pushToasts', { severity: 'success', summary: 'SUCCESS', detail: `${mess} Success`, life: 15000 })
      this.commitRoot('dialog/setState', { key: 'isOpen', data: false })
    }
    // setTimeout(() => {
    //   this.commitRoot('dialog/setMess', { text: '', severity: '' })
    //   this.commitRoot('dialog/setState', { key: 'isOpen', data: false })
    // }, 1000)
  }

  sync = (selector, colName, sort) => {
    selector = selector || this.selector[colName]
    console.log('(resync) selector', selector)
    return pullData(this.RxCol[colName], this.endpoint[colName], selector, this.token)
      .then(() => this.pullList(colName, selector, sort))
      .catch(e => this.handleError.state(e, 'resync error'))
  }
}
