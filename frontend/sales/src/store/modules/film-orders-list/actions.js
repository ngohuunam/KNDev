import tools from '@/tools'

const host = `${window.location.origin}/api/orders/film/`
const fetchOp = (method, bearer) => {
  return {
    method: method,
    withCredentials: true,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: bearer,
    },
  }
}

export const deleteOrders = async ({ commit, rootState }, body) => {
  rootState.dialog.loading = true
  const bearer = 'Bearer ' + rootState.user.token
  const _fetchOp = fetchOp('delete', bearer)
  _fetchOp.body = JSON.stringify(body)
  const _resource = ''
  const _url = host + _resource
  console.log('body', _fetchOp.body)
  try {
    const _res = await fetch(_url, _fetchOp)
    console.log(`FETCH_DELETE response: `, _res)
    if (_res.status === 200) {
      const _json = await _res.json()
      console.log(`FETCH_DELETE response json: `, _json)
      const _idsOk = []
      const _idsErr = []
      const _idsUnknow = []
      let _errMess = ''
      let _successMess = ''
      if (_json.length) {
        _json.map(js => {
          if (js.ok) _idsOk.push(js.id)
          else if (js.error) _idsErr.push(JSON.stringify(js))
          else _idsUnknow.push(JSON.stringify(js))
        })
        if (_idsOk.length) {
          commit('filterSome', { state: 'list', _ids: _idsOk })
          commit('filterSome', { state: 'selected', _ids: _idsOk })
          _successMess = `${_idsOk.join(', ')} delete successfully`
        }
        if (_idsErr.length) _errMess = `Some Error: ${_idsErr.join(', ')}`
        if (_idsUnknow.length) _errMess = _errMess ? _errMess + ` + Some Unknown Responses: ${_idsErr.join(', ')}` : `Some Unknown Responses: ${_idsErr.join(', ')}`
        if (_errMess && _successMess) {
          const _mess = _successMess + ' ++ ' + _errMess
          commit('dialog/setMess', { text: _mess, severity: 'error' }, { root: true })
        } else if (_errMess) commit('dialog/setMess', { text: _errMess, severity: 'error' }, { root: true })
        else if (_successMess) commit('dialog/setMess', { text: _successMess, severity: 'success' }, { root: true })
      } else commit('dialog/setMess', { text: 'Response Json Empty', severity: 'error' }, { root: true })
    } else if (_res.status === 404) {
      commit('dialog/setMess', { message: 'Not Found', severity: 'error' }, { root: true })
    } else if (_res.status === 400) {
      commit('dialog/setMess', { message: 'Bad Request', severity: 'error' }, { root: true })
    } else commit('dialog/setMess', { message: 'Response Error: ' + _res.status, severity: 'error' }, { root: true })
  } catch (e) {
    console.error(e)
    commit('dialog/setMess', { message: 'Promise Error: ' + e, severity: 'error' }, { root: true })
  }
  setTimeout(() => {
    rootState.dialog.loading = false
  }, 100)
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
        commit('dialog/setMess', { message: 'Product Existed', severity: 'error' }, { root: true })
      } else commit('dialog/setMess', { message: 'Response Error: ' + _res.status, severity: 'error' }, { root: true })
    } catch (e) {
      console.error(e)
      commit('dialog/setMess', { message: 'Promise Error: ' + e, severity: 'error' }, { root: true })
    }
    setTimeout(() => {
      rootState.dialog.loading = false
    }, 100)
  }
}

// eslint-disable-next-line no-unused-vars
export const newOrdersSave = async ({ state, commit, rootState }, orders) => {
  rootState.dialog.loading = true
  const _newOrders = orders.map(o => tools.newOrder(o, o._id, rootState.user))
  const _fetchOp = fetchOp('post')
  _fetchOp.body = JSON.stringify(_newOrders)
  const _resource = '/bulk'
  const _url = host + _resource
  console.log('body', _fetchOp.body)
  try {
    const _res = await fetch(_url, _fetchOp)
    if (_res.status === 200) {
      const _json = await _res.json()
      console.log(`FETCH_POST film/orders response json: `, _json)
      // if (_json.id === state.newOrderConverted._id) {
      //   state.newOrderConverted._rev = _json.rev
      //   commit('push', { state: 'list', data: state.newOrderConverted })
      //   commit('sort', { state: 'list', key: 'shortTitle' })
      //   commit('setStates', { states: ['newOrder', 'newOrderConverted'], values: [null, null] })
      //   commit('dialog/setMess', { text: 'Create New Order Successfully', severity: 'success' }, { root: true })
      //   setTimeout(() => {
      //     commit('dialog/setMess', { text: '', severity: '' }, { root: true })
      //     commit('dialog/setState', { state: 'isOpen', value: false }, { root: true })
      //   }, 2000)
      // } else commit('dialog/setMess', { text: 'Response ID Error', severity: 'error' }, { root: true })
    } else if (_res.status === 409) {
      commit('dialog/setMess', { message: 'Film Title Existed', severity: 'error' }, { root: true })
    } else commit('dialog/setMess', { message: 'Response Error: ' + _res.status, severity: 'error' }, { root: true })
  } catch (e) {
    console.error(e)
    commit('dialog/setMess', { message: 'Promise Error: ' + e, severity: 'error' }, { root: true })
  }
  rootState.dialog.loading = false
}

export const newOrder = async ({ state, commit, rootState }) => {
  if (state.newOrderConverted._id) {
    rootState.dialog.loading = true
    const _fetchOp = fetchOp('post')
    _fetchOp.body = JSON.stringify(state.newOrderConverted)
    const _resource = ''
    const _url = host + _resource
    console.log('body', _fetchOp.body)
    try {
      const _res = await fetch(_url, _fetchOp)
      if (_res.status === 200) {
        const _json = await _res.json()
        console.log(`FETCH_POST film/orders response json: `, _json)
        if (_json.id === state.newOrderConverted._id) {
          state.newOrderConverted._rev = _json.rev
          commit('push', { state: 'list', data: state.newOrderConverted })
          commit('sort', { state: 'list', key: '_id' })
          commit('setStates', { states: ['newOrder', 'newOrderConverted'], values: [null, null] })
          commit('dialog/setMess', { text: 'Create New Order Successfully', severity: 'success' }, { root: true })
          setTimeout(() => {
            commit('dialog/setMess', { text: '', severity: '' }, { root: true })
            commit('dialog/setState', { state: 'isOpen', value: false }, { root: true })
          }, 2000)
        } else commit('dialog/setMess', { text: 'Response ID Error', severity: 'error' }, { root: true })
      } else if (_res.status === 409) {
        commit('dialog/setMess', { message: 'Film Title Existed', severity: 'error' }, { root: true })
      } else commit('dialog/setMess', { message: 'Response Error: ' + _res.status, severity: 'error' }, { root: true })
    } catch (e) {
      console.error(e)
      commit('dialog/setMess', { message: 'Promise Error: ' + e, severity: 'error' }, { root: true })
    }
    rootState.dialog.loading = false
  }
}

// eslint-disable-next-line no-unused-vars
export const sync = async ({ state, commit, rootState }) => {
  state.loading = true
  const bearer = 'Bearer ' + rootState.user.token
  const _fetchOp = fetchOp('get', bearer)
  const _resource = 'sync/'
  const _query = state.seq
  const _url = host + _resource + _query
  console.log(_url)
  try {
    const _res = await fetch(_url, _fetchOp)
    if (_res.status === 200) {
      const _json = await _res.json()
      console.log(`GET ${_url} response: `, _json)
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
  const bearer = 'Bearer ' + rootState.user.token
  const _fetchOp = fetchOp('get', bearer)
  console.log(_fetchOp)
  const _url = host
  console.log(_url)
  try {
    const _res = await fetch(_url, _fetchOp)
    console.log(_res)
    // console.log(await _res.text())
    if (_res.status === 200) {
      const _json = await _res.json()
      console.log(`GET ${_url} response: `, _json)
      commit('setStates', { states: ['list', 'seq'], values: [_json.docs, _json.seq] })
    } else console.error(_res.status)
  } catch (e) {
    console.error(e)
  }
  state.loading = false
}
