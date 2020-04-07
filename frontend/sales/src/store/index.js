import Vue from 'vue'
import Vuex from 'vuex'
// import createPersistedState from 'vuex-persistedstate'
import OrderFilmPlugin from './plugin/order-film'

import OrderFilmModule from './modules/order-film'
import HomeModule from './modules/home'
import DialogModule from './modules/dialog'

Vue.use(Vuex)

import state from './state'
import * as mutations from './mutations'
import * as getters from './getters'
import * as actions from './actions'

const store = new Vuex.Store({
  modules: { OrderFilm: OrderFilmModule, Home: HomeModule, Dialog: DialogModule },
  state,
  mutations,
  getters,
  actions,
  plugins: [OrderFilmPlugin],
  // plugins: [createPersistedState({ paths: ['OrderFilm.list', 'OrderFilm.seq'], fetchBeforeUse: true })],
})

const hotReloadElements = ['./state', './mutations', './getters', './actions', './modules/order-film', './modules/Home', './modules/Dialog']

if (module.hot) {
  module.hot.accept(hotReloadElements, () => {
    const newMutations = require('./mutations').default
    const newGetters = require('./getters').default
    const newActions = require('./actions').default
    const newState = require('./state').default
    const newOrderFilmModule = require('./modules/order-film').default
    const newHomeModule = require('./modules/home').default
    const newDialogModule = require('./modules/dialog').default
    store.hotUpdate({
      state: newState,
      mutations: newMutations,
      getters: newGetters,
      actions: newActions,
      modules: {
        OrderFilm: newOrderFilmModule,
        Home: newHomeModule,
        Dialog: newDialogModule,
      },
    })
  })
}

export default store
