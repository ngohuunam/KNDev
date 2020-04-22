// import Vue from 'vue'

export const Worker = async ({ commit, rootState }, payload) => {
  rootState.dialog.loading = true
  commit('Worker', payload)
}

export const reSync = ({ state, commit }, ui) => {
  state.loading = true
  state.icon.header.reSync = true
  commit('Worker', { name: 'reSync', payload: { ui } })
}
