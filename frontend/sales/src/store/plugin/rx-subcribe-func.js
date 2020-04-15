import { pushSortBy_id, queryBy_id, filter_rev, isObjEmpty, year } from '../../tools'
import initRxDB from './rxdb'

export const initDB = (dbName, colName, schema, token, user_id, endpoint, commit) => {
  // console.log('token:', token)
  // console.log('user_id:', user_id)
  return initRxDB(dbName, colName, schema, token, user_id, endpoint).then(db => {
    db.col.database.waitForLeadership().then(() => console.log('isLeader now'))
    const rxUser = db.user
    const user = rxUser.toJSON()
    const film = user.state[year][dbName].film
    const ui = film.ui
    // console.log('rxUser', rxUser)
    // console.log('ui: ', ui)
    const list = db.json.reduce((acc, current) => {
      const _key = current._id
      if (ui[_key]) current.ui = ui[_key]
      if (current.dropped && !current.ui) return acc
      acc.push(current)
      return acc
    }, [])
    commit('setStates', { keys: ['list', 'loading'], datas: [list, false] })
    // console.log('RxCollection: ', db.col)
    // console.log('list: ', list)
    return { ready: true, col: db.col, user, list, rxUser, replicationState: db.replicationState }
  })
}

export const subscribeInsert = (changeEvent, commit, list) => {
  console.log('insert$: ', changeEvent)
  const _$doc = { ...changeEvent.data.v }
  if (list.length) {
    const { doc, index } = queryBy_id(_$doc._id, list)
    if (!doc) {
      const _idx = pushSortBy_id(list, _$doc)
      commit('insertAt', { key: 'list', data: _$doc, idx: _idx })
    } else if (!doc._rev.startsWith('1-')) {
      list[index] = _$doc
      commit('replaceAt', { key: 'list', data: _$doc, idx: index })
    }
  } else {
    list.push(_$doc)
    commit('setState', { key: 'list', data: list })
  }
}

export const subscribeUpdate = (changeEvent, _checkKeys, list, ui, commit, film, user, rxUser) => {
  console.log('update$: ', changeEvent)
  const _$doc = { ...changeEvent.data.v }
  let _needUpdateUserState = false
  if (ui[_$doc._id]) _$doc.ui = ui[_$doc._id]
  if (list.length) {
    const { doc, index } = queryBy_id(_$doc._id, list)
    if (!doc) {
      const _idx = pushSortBy_id(list, _$doc)
      commit('insertAt', { key: 'list', data: _$doc, idx: _idx })
    } else if (doc._rev !== _$doc._rev) {
      if (!_$doc.dropped) {
        if (!ui[_$doc._id]) ui[_$doc._id] = {}
        const _currentUi = ui[_$doc._id]
        const _info = { type: 'change', _id: _$doc._id, keys: [] }
        _checkKeys.map(key => {
          if (doc[key] !== _$doc[key]) {
            const _change = { old: doc[key], new: _$doc[key], logs: filter_rev(_$doc.logs, doc._rev) }
            if (!_currentUi[key] || isObjEmpty(_currentUi[key])) _currentUi[key] = _change
            else {
              _currentUi[key].new = _change.new
              _currentUi[key].logs = _currentUi[key].logs.concat(_change.logs)
            }
            _info.keys.push(key)
            _$doc.ui[key] = _currentUi[key]
            console.log('_$doc._id:', _$doc._id)
            console.log('key:', key)
            console.log('change:', _change)
            _needUpdateUserState = true
          }
        })
        if (_needUpdateUserState) updateUserState(_info, film, user, rxUser)
      }
      list[index] = _$doc
      commit('replaceAt', { key: 'list', data: _$doc, idx: index })
    }
  } else {
    list.push(_$doc)
    commit('setState', { key: 'list', data: list })
  }
}

export const rxUserUpdateSubcribe = (changeEvent, year, col, film, list, ui, commit) => {
  // console.log('rxUser update$:', changeEvent)
  // console.log('rxUserUpdateSubcribe year:', year)
  // console.log('rxUserUpdateSubcribe film:', film)
  // console.log('rxUserUpdateSubcribe list:', list)
  // console.log('rxUserUpdateSubcribe ui:', ui)
  if (changeEvent.data.db === 'remote') {
    const _newUser = changeEvent.data.v
    // console.log('rxUserUpdateSubcribe _newUser:', _newUser)
    const _newFilm = _newUser.state[year][col].film
    // console.log('rxUserUpdateSubcribe _newFilm:', _newFilm)
    if (_newFilm._rev !== film._rev) {
      const _newUi = _newFilm.ui
      const _lastChange = _newFilm.last
      const _id = _lastChange._id
      const _index = list.findIndex(_it => _it._id === _id)
      let _ui = ui[_id]
      console.log('rxUserUpdateSubcribe _lastChange:', _lastChange)
      switch (_lastChange.type) {
        case 'drop':
          delete ui[_id]
          list.splice(_index, 1)
          break
        case 'new':
          _ui = {}
          list[_index].ui = {}
          break
        case 'change':
          if (!_ui || isObjEmpty(_ui)) _ui = _newUi[_id]
          else {
            // console.log('rxUserUpdateSubcribe case "change" _lastChange:', _lastChange)
            // console.log('_ui:', _ui)
            _lastChange.keys.map(_key => {
              _ui[_key].new = _newUi[_id][_key].new
              _ui[_key].logs = _ui[_key].logs.concat(_newUi[_id][_key].logs)
            })
          }
          list[_index].ui = _ui
          break
        case 'check':
          // console.log('rxUserUpdateSubcribe case "check" _lastChange:', _lastChange)
          delete _ui[_lastChange.key]
          delete list[_index].ui[_lastChange.key]
          break
      }
      commit('setState', { key: 'list', data: list })
    }
  }
}

export const updateUserState = (info, film, user, rxUser) => {
  console.log('updateUserState info:', info)
  film.last = info
  film.timestamp = Date.now()
  return rxUser.atomicUpdate(oldData => {
    film._rev = oldData._rev
    oldData.state = { ...user.state }
    return oldData
  })
}

export const preInsert = (docObj, user, needReturn) => {
  docObj.createdAt = Date.now()
  docObj.createdBy = user._id
  docObj.logs.unshift({ type: 'Create', _rev: null, at: docObj.createdAt, by: user._id, note: docObj.note })
  delete docObj.note
  if (needReturn) return docObj
}
