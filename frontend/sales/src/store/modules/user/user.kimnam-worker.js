import { dbName, opts, objectDeep, initDb } from './options'

// import { year, isObjEmpty } from '../../tools'
const { console } = self
const life = 1000

console.log(self)

const ports = []
let rxUser
let postMess, worker
if (self.SharedWorkerGlobalScope) {
  postMess = function(msg) {
    ports.map(port => port.postMessage(msg))
  }
  self.onconnect = e => {
    const port = e.ports[0]
    ports.push(port)
    port.onmessage = e => onMess(e)
    port.onmessageerror = e => onMessError(e)
  }
} else {
  postMess = self.postMessage
  self.onmessage = e => onMess(e)
  self.onmessageerror = e => onMessError(e)
}

const onMess = ({ data }) => {
  console.log('onmessage data: ', data)
  const { name, payload, colName } = data
  if (func[name]) func[name](payload, colName)
  else worker[name](payload, colName)
}
const onMessError = e => {
  console.error('onmessageerror', e)
}

const commit = (type, payload) => postMess({ action: 'commit', type, payload })

const updateSubcribe = changeEvent => {
  console.log('rxUser update$: ', changeEvent)
  const _user = changeEvent.data.v
  postMess({ action: 'persit', payload: _user })
  const { state } = _user
  if (state.last) {
    const { type, path, storePath, _id, field } = state.last
    let _pathObj = objectDeep(path, state)
    console.log('update$ _id:', _id)
    console.log('update$ type:', type)
    console.log('update$ path:', path)
    console.log('update$ storePath:', storePath)
    console.log('update$ field:', field)
    console.log('update$ _pathObj:', _pathObj)
    let key, value
    switch (type) {
      case 'dropped':
        /* _pathObj === uiPath */
        commit(`${storePath.split('.').join('/')}/Worker`, { name: 'reSync', payload: { ui: _pathObj } })
      // falls through

      case 'new':
        setRowIconSuccess(storePath, _id)
      // falls through

      case 'change':
        /* _pathObj === uiPath */
        key = _id
        break

      case 'change-check':
        /* _pathObj === changesPath */
        key = field
        break

      case 'dropped-all':
        commit(`${storePath.split('.').join('/')}/Worker`, { name: 'reSync', payload: { ui: _pathObj.ui } })
      // falls through

      case 'change-check-all':
      case 'new-all':
        /* _pathObj === colPath */
        key = 'ui'
        break
    }
    value = _pathObj[key]
    console.log('update$ key:', key)
    console.log('update$ value:', value)
    // if (type.includes('dropped') || type.includes('change-check')) setTimeout(() => commit('setStateDeep', { dotPath: `user.state.${path}`, key, value }), life)
    // else commit('setStateDeep', { dotPath: `user.state.${path}`, key, value })
    setTimeout(() => commit('setStateDeep', { dotPath: `user.state.${path}`, key, value }), life)
  }
}

const user = () => {
  const _user = rxUser.toJSON(true)
  delete _user.password
  return _user
}

const getStatus = ({ token, _id }) => {
  if (rxUser) commit('setState', { key: 'user', data: user() })
  else init(token, _id)
}

const init = (token, _id) =>
  opts.forEach(opt => {
    opt.query = { _id: { $eq: _id } }
    initDb(dbName, opt, token)
      .then(({ rxCol, sync }) => {
        rxCol
          .findOne()
          .exec()
          .then(_rxDoc => {
            rxUser = _rxDoc
            console.log('rxUser:', rxUser)
            const data = user()
            commit('setState', { key: 'user', data })
            postMess({ action: 'persit', payload: data })
          })
        rxCol.update$.subscribe(updateSubcribe)
        rxCol.postSave(data => {
          postMess({ action: 'persit', payload: data })
        }, true)
        sync.denied$.subscribe(docData => console.log('denied$: ', docData))
        sync.error$.subscribe(error => console.log('error$: ', error))
      })
      .catch(e => console.error(e))
  })

const iconLoading = 'pi pi-spin pi-spinner color-red'
const iconSuccess = 'pi pi-check color-green'
const iconError = 'pi pi-info color-red'

const setMultiRowIcon = (dotPath, iconObj) => commit('mergeStateDeep', { dotPath, key: 'row', value: iconObj })
const setMultiRowIconSuccess = (dotPath, successIconObj, emptyIconObj) => {
  setMultiRowIcon(dotPath, successIconObj)
  setTimeout(() => setMultiRowIcon(dotPath, emptyIconObj), life)
}
const multiRowCheckSaveError = (dotPath, type, e, errorIconOnj) => {
  console.log(`(allRowCheck) type ${type} error:`, e)
  commit('pushToasts', { severity: 'error', summary: 'SAVE ERROR', detail: `Err: ${e.message}`, life: 10000 })
  setMultiRowIcon(dotPath, errorIconOnj)
}
const saveError = (type, e) => {
  console.log(`(saveError) type ${type} error:`, e)
  commit('pushToasts', { severity: 'error', summary: 'SAVE ERROR', detail: `Err: ${e.message}`, life: 10000 })
}

const query = ({ year, path, selector }) => {
  const colPath = `${year}.${path}`
  rxUser
    .atomicUpdate(oldData => {
      const state = preUpdate(oldData)
      const ui = objectDeep(colPath, state)
      ui.selector = selector
      state.last = null
      return oldData
    })
    .catch(e => saveError('(load)', e))
}

const allRowCheck = ({ year, path, list, type }) => {
  const colPath = `${year}.${path}`
  const uiPath = `${colPath}.ui`
  const dotPath = `${path}.icon`
  let _ids
  const _loadingIcon = {}
  const _successIcon = {}
  const _errorIcon = {}
  const _emptyIcon = {}
  rxUser
    .atomicUpdate(oldData => {
      const state = preUpdate(oldData)
      const ui = objectDeep(uiPath, state)
      if (type === 'new') _ids = list.reduce((pre, cur) => [...pre, ...(!cur.dropped && !ui[cur._id] ? [cur._id] : [])], [])
      else if (type === 'dropped') _ids = list.reduce((pre, cur) => [...pre, ...(cur.dropped && !ui[cur._id].dropped ? [cur._id] : [])], [])
      console.log(`(allRowCheck) type ${type} _ids`, _ids)
      _ids.map(_id => {
        ui[_id] = ui[_id] || { new: 0, changes: {}, dropped: 0 }
        ui[_id][type] = state.timestamp
        _loadingIcon[_id] = iconLoading
        _successIcon[_id] = iconSuccess
        _errorIcon[_id] = iconError
        _emptyIcon[_id] = ''
      })
      setMultiRowIcon(dotPath, _loadingIcon)
      type += '-all'
      state.last = { type, path: colPath }
      return oldData
    })
    .then(() => setMultiRowIconSuccess(dotPath, _successIcon, _emptyIcon))
    .catch(e => multiRowCheckSaveError(dotPath, type, e, _errorIcon))
}

const rowCheck = ({ year, path, _id, type }) => {
  const storePath = path
  const uiPath = `${year}.${storePath}.ui`
  setRowIconLoading(storePath, _id)
  rxUser
    .atomicUpdate(oldData => {
      const state = preUpdate(oldData)
      const ui = objectDeep(uiPath, state)
      ui[_id] = ui[_id] || { new: 0, changes: {}, dropped: 0 }
      ui[_id][type] = state.timestamp
      state.last = { type: type, path: uiPath, storePath, _id: _id }
      return oldData
    })
    .catch(e => rowCheckSaveError(storePath, _id, type, e))
}

const setCellIcons = (dotPath, obj, icon) => {
  for (let _id in obj) {
    obj[_id].map(field => commit('checkAndSetStateDeepNested', { dotPath, keyCheck: _id, field, key: 'cell', value: icon }))
  }
}

const allChangeCheck = ({ year, path }) => {
  const colPath = `${year}.${path}`
  const uiPath = `${colPath}.ui`
  const dotPath = `${path}.icon`
  const checked = {}
  rxUser
    .atomicUpdate(oldData => {
      const state = preUpdate(oldData)
      let ui = objectDeep(uiPath, state)
      for (let _id in ui) {
        console.log(`(allChangeCheck) ui[${_id}]`, ui[_id])
        if (typeof ui[_id].changes === 'object') {
          checked[_id] = []
          for (let field in ui[_id].changes) {
            if (typeof ui[_id].changes[field] === 'object') {
              checked[_id].push(field)
              ui[_id].changes[field] = Date.now()
              console.log('(allChangeCheck) ui[_id].change', ui[_id].change)
            }
          }
        }
      }
      setCellIcons(dotPath, checked, iconLoading)
      state.last = { type: 'change-check-all', path: colPath }
      return oldData
    })
    .then(() => {
      setCellIcons(dotPath, checked, iconSuccess)
      setTimeout(() => setCellIcons(dotPath, checked, ''), life)
    })
    .catch(e => {
      console.log(`(allChangeCheck) error:`, e)
      commit('pushToasts', { severity: 'error', summary: 'SAVE ERROR', detail: `Check all change Err: ${e.message}`, life: 10000 })
      setCellIcons(dotPath, checked, iconError)
    })
}

const changeCheck = ({ _id, field, year, path }) => {
  const dotPath = `${path}.icon`
  commit('checkAndSetStateDeepNested', { dotPath, keyCheck: _id, field, key: 'cell', value: iconLoading })
  rxUser
    .atomicUpdate(oldData => {
      const state = preUpdate(oldData)
      const uiPath = `${year}.${path}.ui`
      const ui = objectDeep(uiPath, state)
      ui[_id] = ui[_id] || { new: 0, changes: {}, dropped: 0 }
      const changesPath = `${uiPath}.${_id}.changes`
      console.log(`(changeCheck) changesPath:`, changesPath)
      const changes = ui[_id].changes
      console.log(`(changeCheck) changes:`, changes)
      changes[field] = Date.now()
      state.last = { type: 'change-check', path: changesPath, field }
      return oldData
    })
    .then(() => {
      commit('checkAndSetStateDeepNested', { dotPath, keyCheck: _id, field, key: 'cell', value: iconSuccess })
      setTimeout(() => commit('checkAndSetStateDeepNested', { dotPath, keyCheck: _id, field, key: 'cell', value: '' }), life)
    })
    .catch(e => {
      console.log(`(changeCheck) error:`, e)
      commit('pushToasts', { severity: 'error', summary: 'SAVE ERROR', detail: `${_id} err: ${e.message}`, life: 10000 })
      commit('checkAndSetStateDeepNested', { dotPath, keyCheck: _id, field, key: 'cell', value: iconError })
    })
}

const preUpdate = ({ state, _rev }) => {
  state._rev = _rev
  state.timestamp = Date.now()
  return state
}

/* update from other db col doc field changed */
const change = payload => {
  console.log('payload', payload)
  rxUser.atomicUpdate(oldData => {
    const { colPath, _id, changes } = payload
    const state = preUpdate(oldData)
    const uiPath = `${colPath}.ui`
    const ui = objectDeep(uiPath, state)
    ui[_id] = ui[_id] || { new: 0, changes: {}, dropped: 0 }
    const current = ui[_id].changes
    console.log('(change) current', current)
    for (const key in changes) {
      console.log('(change) key', key)
      if (current[key] && typeof current[key] === 'object') {
        current[key].new = changes[key].new
        current[key].logs = changes[key].logs.concat(current[key].logs)
      } else {
        current[key] = changes[key]
      }
    }
    state.last = { type: 'change', path: uiPath, _id: _id }
    return oldData
  })
}

const setRowIcon = (path, _id, icon) => commit('setStateDeep', { dotPath: `${path}.icon.row`, key: _id, value: icon })
const setRowIconLoading = (path, _id) => setRowIcon(path, _id, iconLoading)
const setRowIconError = (path, _id) => setRowIcon(path, _id, iconError)
const setRowIconSuccess = (path, _id) => {
  setRowIcon(path, _id, iconSuccess)
  setTimeout(() => setRowIcon(path, _id, ''), life)
}
const rowCheckSaveError = (path, _id, type, e) => {
  console.log(`(rowCheck) type ${type} error:`, e)
  commit('pushToasts', { severity: 'error', summary: 'SAVE ERROR', detail: `${_id} err: ${e.message}`, life: 10000 })
  setRowIconError(path, _id)
}

const func = { init, getStatus, rowCheck, allRowCheck, change, changeCheck, allChangeCheck, query }
