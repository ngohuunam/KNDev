import state from './state'
import * as mutations from './mutations'
import * as getters from './getters'
import * as actions from './actions'
import PlanFilmModule from './film'

export default {
  namespaced: true,
  modules: { film: PlanFilmModule },
  state,
  getters,
  actions,
  mutations,
}
