// import Vue from 'vue'

export const Worker = ({ commit, rootState }, payload) => {
  rootState.dialog.loading = true
  commit('Worker', payload)
}
