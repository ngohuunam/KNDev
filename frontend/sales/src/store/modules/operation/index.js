import state from './plan/state'
import * as mutations from './plan/mutations'
import * as getters from './plan/getters'
import * as actions from './plan/actions'
import PlanModule from './plan'

export default {
  namespaced: true,
  modules: { plan: PlanModule },
  state,
  getters,
  actions,
  mutations,
}
