import state from './order-film/state'
import * as mutations from './order-film/mutations'
import * as getters from './order-film/getters'
import * as actions from './order-film/actions'

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
