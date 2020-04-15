import Vue from 'vue'
import Vuex from 'vuex'
// import createPersistedState from 'vuex-persistedstate'
import OrderFilmPlugin from './plugin/order-film.plugin'
import OrderFilmProdPlugin from './plugin/prod-film.plugin'

import OrderModule from './modules/order'
import ProdModule from './modules/prod'
import HomeModule from './modules/home'
import DialogModule from './modules/dialog'

Vue.use(Vuex)

import state from './state'
import * as mutations from './mutations'
import * as getters from './getters'
import * as actions from './actions'

const store = new Vuex.Store({
  modules: { Order: OrderModule, Prod: ProdModule, Home: HomeModule, Dialog: DialogModule },
  state,
  mutations,
  getters,
  actions,
  plugins: [OrderFilmPlugin, OrderFilmProdPlugin],
  // plugins: [createPersistedState({ paths: ['OrderFilm.list', 'OrderFilm.seq'], fetchBeforeUse: true })],
})

const hotReloadElements = ['./state', './mutations', './getters', './actions', './modules/order/', './modules/prod', './modules/Home', './modules/Dialog']

if (module.hot) {
  module.hot.accept(hotReloadElements, () => {
    const newMutations = require('./mutations').default
    const newGetters = require('./getters').default
    const newActions = require('./actions').default
    const newState = require('./state').default
    const newOrderModule = require('./modules/order').default
    const newProdModule = require('./modules/prod').default
    const newHomeModule = require('./modules/home').default
    const newDialogModule = require('./modules/dialog').default
    store.hotUpdate({
      state: newState,
      mutations: newMutations,
      getters: newGetters,
      actions: newActions,
      modules: {
        Order: newOrderModule,
        Prod: newProdModule,
        Home: newHomeModule,
        Dialog: newDialogModule,
      },
    })
  })
}

export default store
