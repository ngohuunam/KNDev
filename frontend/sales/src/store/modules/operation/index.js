import state from './plan/state'
import * as mutations from './plan/mutations'
import * as getters from './plan/getters'
import * as actions from './plan/actions'
import PlanModule from './plan'

export default {
  namespaced: true,
  modules: { film: PlanModule },
  state,
  getters,
  actions,
  mutations,
}
