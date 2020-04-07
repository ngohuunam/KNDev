import tools from '@/tools'

const host = `${window.location.origin}/api/orders/film`
const fetchOp = (method, token) => {
  return {
    method: method,
    withCredentials: true,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  }
}

export const deleteOrders = async ({ commit, rootState }, body) => {
  rootState.dialog.loading = true
  const token = rootState.user.token
  const _fetchOp = fetchOp('delete', token)
  _fetchOp.body = JSON.stringify(body)
  const _resource = ''
  const _url = host + _resource
  console.log('body', _fetchOp.body)
  try {
    const _res = await fetch(_url, _fetchOp)
    console.log(`FETCH_DELETE response: `, _res)
    const _json = await _res.json()
    if (_res.status === 200) {
      console.log(`newOrdersSave response json: `, _json)
      let _mess = ''
      let _severity = ''
      if (_json.ok.length) {
        const _successResIds = _json.ok.map(_r => _r.id)
        commit('setDeleted', _json.ok)
        // console.log('_successResIds: ', _successResIds)
        // commit('filterSome', { state: 'list', _ids: _successResIds })
        _mess = `Delete ${_successResIds.join(', ')} success`
        _severity = 'success'
        commit('pushToasts', { severity: _severity, summary: _severity.toUpperCase(), detail: _mess, life: 10000 }, { root: true })
      }
      if (_json.err.length || _json.other.length) {
        const _errs = [..._json.err, ..._json.other]
        console.log(_errs)
        const _errIds = _errs.map(e => `${e.id} - ${e.error}`)
        console.log(_errIds)
        _mess += (_mess ? ' - ' : '') + `Errors: ${_errIds.join(', ')}`
        _severity = 'error'
        commit('pushToasts', { severity: _severity, summary: _severity.toUpperCase(), detail: _mess, life: 10000 }, { root: true })
      }
      commit('setSeq', _json.seq)
      setTimeout(() => commit('dialog/setState', { state: 'isOpen', value: false }, { root: true }), 500)
    } else commit('dialog/setMess', { text: `${_res.status} - ${_json}`, severity: 'error' }, { root: true })
  } catch (e) {
    console.error(e)
    commit('dialog/setMess', { text: 'Promise Error: ' + e, severity: 'error' }, { root: true })
  }
  setTimeout(() => (rootState.dialog.loading = false), 100)
}

export const newProdSave = async ({ state, commit, rootState }) => {
  if (state.newProdConverted._id) {
    rootState.dialog.loading = true
    const _fetchOp = fetchOp('post')
    _fetchOp.body = JSON.stringify(state.newProdConverted)
    const _resource = 'product'
    const _url = host + _resource
    console.log('body', _fetchOp.body)
    try {
      const _res = await fetch(_url, _fetchOp)
      if (_res.status === 200) {
        const _json = await _res.json()
        console.log(`FETCH_POST ${_resource} response json: `, _json)
        if (_json.id === state.newProdConverted.orderId) {
          state.newProdConverted._rev = _json.rev
          commit('setStates', { states: ['newProd', 'newProdConverted'], values: [null, null] })
          commit('dialog/setMess', { text: 'Create New Product Successfully', severity: 'success' }, { root: true })
          setTimeout(() => {
            commit('dialog/setMess', { text: '', severity: '' }, { root: true })
            commit('dialog/setState', { state: 'isOpen', value: false }, { root: true })
          }, 2000)
        } else commit('dialog/setMess', { text: 'Response ID Error', severity: 'error' }, { root: true })
      } else if (_res.status === 409) {
        commit('dialog/setMess', { text: 'Product Existed', severity: 'error' }, { root: true })
      } else commit('dialog/setMess', { text: 'Response Error: ' + _res.status, severity: 'error' }, { root: true })
    } catch (e) {
      console.error(e)
      commit('dialog/setMess', { text: 'Promise Error: ' + e, severity: 'error' }, { root: true })
    }
    setTimeout(() => {
      rootState.dialog.loading = false
    }, 100)
  }
}

// eslint-disable-next-line no-unused-vars
export const newOrdersSave = async ({ state, commit, rootState }, orders) => {
  rootState.dialog.loading = true
  const _newOrders = orders.map(o => tools.newOrder(o, rootState.user))
  const token = rootState.user.token
  const _fetchOp = fetchOp('post', token)
  _fetchOp.body = JSON.stringify(_newOrders)
  const _resource = '/some'
  const _url = host + _resource
  console.log('body', _fetchOp.body)
  try {
    const _res = await fetch(_url, _fetchOp)
    console.log(`newOrdersSave response: `, _res)
    const _json = await _res.json()
    if (_res.status === 200) {
      console.log(`newOrdersSave response json: `, _json)
      let _mess = ''
      let _severity = 'error'
      if (_json.new.length) {
        const _successNewIds = _json.new.map(_r => _r.id)
        console.log('_successResIds: ', _successNewIds)
        _successNewIds.map(_resId => {
          const _successOrder = _newOrders.find(o => o._id === _resId)
          _successOrder._rev = _res.rev
          commit('push_sort', { state: 'list', data: _successOrder, key: '_id' })
        })
        _mess = `Create ${_successNewIds.join(', ')} success`
        _severity = 'success'
        commit('pushToasts', { severity: _severity, summary: _severity.toUpperCase(), detail: _mess, life: 10000 }, { root: true })
      }
      if (_json.old.length) {
        const _successOldIds = _json.old.map(_r => _r.id)
        console.log('_successOldIds: ', _successOldIds)
        _successOldIds.map(_resId => {
          const _successOrder = _newOrders.find(o => o._id === _resId)
          _successOrder._rev = _res.rev
          commit('push_sort', { state: 'list', data: _successOrder, key: '_id' })
        })
        _mess = `${_successOldIds.join(', ')} re-created`
        _severity = 'warn'
        commit('pushToasts', { severity: _severity, summary: _severity.toUpperCase(), detail: _mess, life: 10000 }, { root: true })
      }
      if (_json.err.length) {
        const _errIds = _json.err.map(e => `${e.id} - ${e.error}`)
        console.log(_errIds)
        _mess = `Errors: ${_errIds.join(', ')}`
        _severity = 'error'
        commit('pushToasts', { severity: _severity, summary: _severity.toUpperCase(), detail: _mess, life: 10000 }, { root: true })
      }
      if (_json.other.length) {
        const _errIds = _json.other.map(e => `${e.id} - ${e.error}`)
        console.log(_errIds)
        _mess = `Unknown Errors: ${_errIds.join(', ')}`
        _severity = 'error'
        commit('pushToasts', { severity: _severity, summary: _severity.toUpperCase(), detail: _mess, life: 10000 }, { root: true })
      }
      commit('setSeq', _json.seq)
      setTimeout(() => {
        commit('dialog/setState', { state: 'isOpen', value: false }, { root: true })
      }, 500)
    } else commit('dialog/setMess', { text: `${_res.status} - ${_json}`, severity: 'error' }, { root: true })
  } catch (e) {
    console.error(e)
    commit('dialog/setMess', { text: 'Promise Error: ' + e, severity: 'error' }, { root: true })
  }
  setTimeout(() => (rootState.dialog.loading = false), 100)
}

export const newOrder = async ({ state, commit, rootState }) => {
  if (state.newOrderConverted._id) {
    rootState.dialog.loading = true
    const token = rootState.user.token
    const _fetchOp = fetchOp('post', token)
    _fetchOp.body = JSON.stringify(state.newOrderConverted)
    const _resource = ''
    const _url = host + _resource
    console.log('body', _fetchOp.body)
    try {
      const _res = await fetch(_url, _fetchOp)
      const _json = await _res.json()
      if (_res.status === 200) {
        console.log(`newOrder response json: `, _json)
        const _resDoc = _json.doc
        if (_resDoc.id === state.newOrderConverted._id) {
          state.newOrderConverted._rev = _resDoc.rev
          commit('push', { state: 'list', data: state.newOrderConverted })
          commit('sort', { state: 'list', key: '_id' })
          commit('setStates', { states: ['newOrder', 'newOrderConverted', 'seq'], values: [null, null, _json.seq] })
          commit('dialog/setMess', { text: 'Create New Order Successfully', severity: 'success' }, { root: true })
          setTimeout(() => {
            commit('dialog/setMess', { text: '', severity: '' }, { root: true })
            commit('dialog/setState', { state: 'isOpen', value: false }, { root: true })
          }, 1500)
        } else commit('dialog/setMess', { text: 'Response ID Error', severity: 'error' }, { root: true })
      } else commit('dialog/setMess', { text: `${_res.status} - ${_json}`, severity: 'error' }, { root: true })
    } catch (e) {
      console.error(e)
      commit('dialog/setMess', { text: 'Promise Error: ' + e, severity: 'error' }, { root: true })
    }
    rootState.dialog.loading = false
  }
}

// eslint-disable-next-line no-unused-vars
export const sync = async ({ state, commit, rootState }) => {
  state.loading = true
  const token = rootState.user.token
  const _fetchOp = fetchOp('get', token)
  const _resource = '/sync'
  const _query = state.seq
  const _url = host + _resource + _query
  console.log(_url)
  try {
    const _res = await fetch(_url, _fetchOp)
    if (_res.status === 200) {
      const _json = await _res.json()
      console.log(`sync response: `, _json)
      // commit('setStates', { states: ['list', 'seq'], values: [_json.docs, _json.seq] })
    } else if (_res.status === 204) {
      console.log(_res.status)
    } else console.error(_res.status)
  } catch (e) {
    console.error(e)
  }
  state.loading = false
}

export const getAll = async ({ state, commit, rootState }) => {
  state.loading = true
  const token = rootState.user.token
  const _fetchOp = fetchOp('get', token)
  console.log(_fetchOp)
  const _url = host
  console.log(_url)
  try {
    const _res = await fetch(_url, _fetchOp)
    console.log(_res)
    // console.log(await _res.text())
    if (_res.status === 200) {
      const _json = await _res.json()
      console.log(`getAll response: `, _json)
      commit('setStates', { states: ['list', 'seq'], values: [_json.docs, _json.seq] })
    } else console.error(_res.status)
  } catch (e) {
    console.error(e)
  }
  state.loading = false
}
