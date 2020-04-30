import state from './process/state'
import * as mutations from './process/mutations'
import * as getters from './process/getters'
import * as actions from './process/actions'
import ProcessModule from './process'

export default {
  namespaced: true,
  modules: { process: ProcessModule },
  state,
  getters,
  actions,
  mutations,
}
