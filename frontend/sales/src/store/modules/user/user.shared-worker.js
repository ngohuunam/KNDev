import { dbName, opts, objectDeep, initDb } from './options'

// import { year, isObjEmpty } from '../../tools'
const { console } = self

const ports = []
let rxUser

const postMessage = msg => {
  for (const port of ports) port.postMessage(msg)
}

const commit = (type, payload) => postMessage({ action: 'commit', type, payload })

const updateSubcribe = changeEvent => {
  console.log('rxUser update$: ', changeEvent)
  const _user = changeEvent.data.v
  const { state } = _user
  const { type, path, _id, field } = _user.state.last
  const _pathObj = objectDeep(path, state)
  console.log('update$ _id:', _id)
  console.log('update$ type:', type)
  console.log('update$ path:', path)
  console.log('update$ field:', field)
  console.log('update$ _pathObj:', _pathObj)
  let key, value
  switch (type) {
    case 'dropped':
    case 'new':
    case 'change':
      /* _pathObj === uiPath */
      key = _id
      break

    case 'change-check':
      /* _pathObj === changesPath */
      key = field
      break

    case 'all':
    case 'new-all':
    case 'dropped-all':
      /* _pathObj === colPath */
      key = 'ui'
      break
  }
  value = _pathObj[key]
  console.log('update$ key:', key)
  console.log('update$ value:', value)
  if (type.includes('dropped') || type.includes('change-check')) setTimeout(() => commit('setStateDeep', { dotPath: `user.state.${path}`, key, value }), 3000)
  else commit('setStateDeep', { dotPath: `user.state.${path}`, key, value })
}

self.onconnect = e => {
  console.dir(e)
  const port = e.ports[0]
  console.dir(port)
  ports.push(port)

  port.onmessage = ({ data }) => {
    console.log('port.onmessage data: ', data)
    const { name, payload } = data
    if (func[name]) func[name](payload)
  }

  port.onmessageerror = e => {
    console.error('sw port onmessageerror', e)
  }
}

const user = () => {
  const _user = rxUser.toJSON()
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
            commit('setState', { key: 'user', data: user() })
          })
        rxCol.update$.subscribe(updateSubcribe)
        sync.denied$.subscribe(docData => console.log('denied$: ', docData))
        sync.error$.subscribe(error => console.log('error$: ', error))
      })
      .catch(e => console.error(e))
  })

const iconLoading = 'pi pi-spin pi-spinner color-red'
const iconSuccess = 'pi pi-check color-green'
const iconError = 'pi pi-info color-red'

const allRowCheck = ({ year, db, col, list, type }) => {
  const path = `${db}.${col}`
  const colPath = `${year}.${path}`
  const uiPath = `${colPath}.ui`
  const dotPath = `${path}.icon.row`
  const { state } = rxUser.toJSON()
  const ui = objectDeep(uiPath, state)
  let _ids
  if (type === 'new') _ids = list.reduce((pre, cur) => [...pre, ...(!cur.dropped && !ui[cur._id] ? [cur._id] : [])], [])
  else if (type === 'dropped') _ids = list.reduce((pre, cur) => [...pre, ...(cur.dropped && !ui[cur._id].dropped ? [cur._id] : [])], [])
  console.log(`(allRowCheck) type ${type} _ids`, _ids)
  _ids.map(_id => commit('setStateDeep', { dotPath, key: _id, value: iconLoading }))
  updateUserState_ids_values(type + '-all', uiPath, colPath, _ids, type)
    .then(() =>
      _ids.map(_id => {
        commit('setStateDeep', { dotPath, key: _id, value: iconSuccess })
        setTimeout(() => commit('setStateDeep', { dotPath, key: _id, value: '' }), 3000)
      }),
    )
    .catch(e => {
      console.log(`(allRowCheck) type ${type} error:`, e)
      commit('pushToasts', { severity: 'error', summary: 'SAVE ERROR', detail: `Err: ${e.message}`, life: 10000 })
      _ids.map(_id => commit('setStateDeep', { dotPath, key: _id, value: iconError }))
    })
}

const rowCheck = ({ year, db, col, _id, type }) => {
  const path = `${db}.${col}`
  const uiPath = `${year}.${path}.ui`
  const dotPath = `${path}.icon.row`
  commit('setStateDeep', { dotPath, key: _id, value: iconLoading })
  updateUserState(type, uiPath, _id, [type])
    .then(() => {
      commit('setStateDeep', { dotPath, key: _id, value: iconSuccess })
      setTimeout(() => commit('setStateDeep', { dotPath, key: _id, value: '' }), 3000)
    })
    .catch(e => {
      console.log(`(rowCheck) type ${type} error:`, e)
      commit('pushToasts', { severity: 'error', summary: 'SAVE ERROR', detail: `${_id} err: ${e.message}`, life: 10000 })
      commit('setStateDeep', { dotPath, key: _id, value: iconError })
    })
}

const changeCheck = ({ _id, field, year, path }) => {
  const dotPath = `${path}.icon`
  commit('checkAndSetStateDeepNested', { dotPath, keyCheck: _id, field, key: 'cell', value: iconLoading })
  rxUser
    .atomicUpdate(oldData => {
      const uiPath = `${year}.${path}.ui`
      const changesPath = `${uiPath}.${_id}.changes`
      const state = preUpdate(oldData)
      let ui_changes = objectDeep(changesPath, state)
      ui_changes[field] = Date.now()
      state.last = { type: 'change-check', path: changesPath, field }
      return oldData
    })
    .then(() => {
      commit('checkAndSetStateDeepNested', { dotPath, keyCheck: _id, field, key: 'cell', value: iconSuccess })
      setTimeout(() => commit('checkAndSetStateDeepNested', { dotPath, keyCheck: _id, field, key: 'cell', value: '' }), 3000)
    })
    .catch(e => {
      console.log(`(changeCheck) error:`, e)
      commit('pushToasts', { severity: 'error', summary: 'SAVE ERROR', detail: `${_id} err: ${e.message}`, life: 3000 })
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
    if (!ui[_id]) ui[_id] = { new: 0, changes: {}, dropped: 0 }
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

const updateUserState = (type, uiPath, _id, keys, values) =>
  rxUser.atomicUpdate(oldData => {
    const state = preUpdate(oldData)
    const ui = objectDeep(uiPath, state)
    if (!ui[_id]) ui[_id] = { new: 0, changes: {}, dropped: 0 }
    if (values) {
      if (Array.isArray(values)) keys.map((key, i) => (ui[_id][key] = values[i]))
      else keys.map(key => (ui[_id][key] = values))
    } else keys.map(key => (ui[_id][key] = state.timestamp))
    state.last = { type: type, path: uiPath, _id: _id }
    return oldData
  })

const updateUserState_ids_values = (type, uiPath, colPath, _ids, key, values) =>
  rxUser.atomicUpdate(oldData => {
    const state = preUpdate(oldData)
    const ui = objectDeep(uiPath, state)
    // if (!ui[_id]) ui[_id] = {}
    _ids.map((_id, i) => {
      if (!ui[_id]) ui[_id] = { new: 0, changes: {}, dropped: 0 }
      if (values) {
        if (Array.isArray(values)) ui[_id][key] = values[i]
        else ui[_id][key] = values
      } else ui[_id][key] = state.timestamp
    })
    state.last = { type, path: colPath }
    return oldData
  })

const func = { init, getStatus, rowCheck, allRowCheck, change, changeCheck }
