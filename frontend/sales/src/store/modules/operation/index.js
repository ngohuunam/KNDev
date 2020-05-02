import state from './state'
import * as mutations from './mutations'
import * as getters from './getters'
import * as actions from './actions'
import ProcessModule from './process'

export default {
  namespaced: true,
  modules: { process: ProcessModule },
  state,
  getters,
  actions,
  mutations,
}
