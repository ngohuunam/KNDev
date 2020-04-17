import Vue from 'vue'

export const Worker = async ({ commit, rootState }, payload) => {
  rootState.dialog.loading = true
  commit('Worker', payload)
}

export const allNewCheck = ({ state, commit, rootState: { year } }) => {
  state.btnIcon['allNewCheck'] = true
  const payload = { year, db: 'order', col: 'film', list: state.list }
  // const ui = user[year].order.film.ui
  // payload._ids = state.list.reduce((pre, cur) => [...pre, ...(!cur.dropped && !ui[cur._id] ? [cur._id] : [])], [])
  // console.log('(allNewCheck) payload', payload)
  commit('Worker', { name: 'allNewCheck', payload })
}

export const allDroppedCheck = ({ state, commit, rootState: { year } }) => {
  state.btnIcon['allDroppedCheck'] = true
  const payload = { year, db: 'order', col: 'film', list: state.list }
  // const ui = user[year].order.film.ui
  // payload._ids = state.list.reduce((pre, cur) => [...pre, ...(cur.dropped && !ui[cur._id].dropped ? [cur._id] : [])], [])
  // console.log('(allDroppedCheck) payload', payload)
  commit('Worker', { name: 'allDroppedCheck', payload })
}

export const newCheck = ({ state, commit }, { data, index }) => {
  data.icon = 'pi-spin pi-spinner color-red'
  Vue.set(state.list, index, data)
  commit('Worker', { name: 'newCheck', payload: { data, index } })
}

export const droppedCheck = ({ state, commit }, { data, index }) => {
  data.icon = 'pi-spin pi-spinner color-red'
  Vue.set(state.list, index, data)
  commit('Worker', { name: 'droppedCheck', payload: { data, index } })
}

export const changeCheck = ({ state, commit }, { _id, key, index }) => {
  const _item = { ...state.list[index] }
  _item.ui[key].checking = true
  Vue.set(state.list, index, _item)
  commit('Worker', { name: 'changeCheck', payload: { _id, key, index } })
}
