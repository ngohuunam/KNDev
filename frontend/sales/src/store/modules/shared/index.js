import { initDb as _initDb, initSome as _initSome } from './rxdb'
import { queryBy_id, pushSortBy_id, filter_rev, year } from '../../../tools'

export const initDb = _initDb

export const initSome = _initSome

export const insertSubcribe = (changeEvent, list, commit, colName) => {
  console.log('insert$: ', changeEvent)
  const _$doc = { ...changeEvent.data.v }
  if (list.length) {
    const { doc, index } = queryBy_id(_$doc._id, list)
    if (!doc) {
      const _idx = pushSortBy_id(list, _$doc)
      commit('insertAt', { key: 'list', data: _$doc, idx: _idx }, colName)
    } else if (!doc._rev.startsWith('1-')) {
      list[index] = _$doc
      commit('replaceAt', { key: 'list', data: _$doc, idx: index }, colName)
    }
  } else {
    list.push(_$doc)
    commit('setState', { key: 'list', data: list }, colName)
  }
}

export const updateSubcribe = (changeEvent, _checkKeys, list, commit, commitRoot, colName, dbName) => {
  console.log('update$:', changeEvent)
  const _$doc = { ...changeEvent.data.v }
  let _needUpdateUserState = false
  if (list.length) {
    const { doc, index } = queryBy_id(_$doc._id, list)
    if (!doc) {
      const _idx = pushSortBy_id(list, _$doc)
      commit('insertAt', { key: 'list', data: _$doc, idx: _idx }, colName)
    } else if (doc._rev !== _$doc._rev) {
      if (!_$doc.dropped) {
        const payload = { colPath: `${year}.${dbName}.${colName}`, _id: _$doc._id, changes: {} }
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
        if (_needUpdateUserState) commitRoot('user/Worker', { name: 'change', payload })
      }
      list[index] = _$doc
      commit('replaceAt', { key: 'list', data: _$doc, idx: index }, colName)
    }
  } else {
    list.push(_$doc)
    commit('setState', { key: 'list', data: list }, colName)
  }
}

export const preInsert = (docObj, user_id) => {
  docObj.createdAt = Date.now()
  docObj.createdBy = user_id
  docObj.logs.unshift({ type: 'Create', _rev: null, at: docObj.createdAt, by: user_id, note: docObj.note })
  delete docObj.note
}
