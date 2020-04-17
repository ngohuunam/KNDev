import state from './state'
import * as mutations from './mutations'
import * as getters from './getters'
import * as actions from './actions'
import OrderFilmModule from './film'

export default {
  namespaced: true,
  modules: { film: OrderFilmModule },
  state,
  getters,
  actions,
  mutations,
}
