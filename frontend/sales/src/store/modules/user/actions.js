// import Vue from 'vue'

export const rowCheck = ({ commit, rootState }, { type, db, col, origin, datas: { data, index } }) => {
  data.icon = 'pi-spin pi-spinner color-red'
  commit('setStateDeep', { dotPath: 'order.film.list', key: index, value: data }, { root: true })
  const path = `${db}.${col}`
  commit('Worker', { name: 'rowCheck', payload: { type, payload: { year: rootState.year, path, origin, data, index } } })
}
