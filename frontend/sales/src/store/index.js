import Vue from 'vue'
import Vuex from 'vuex'
// import createPersistedState from 'vuex-persistedstate'

import UserModule from './modules/user'
import UserPlugin from './modules/user/plugin'

import OrderModule from './modules/order'
// import OrderFilmPlugin from './modules/order/film/plugin'
import OrderPlugin from './modules/order/plugin'

import ProdModule from './modules/prod'
import ProdPlugin from './modules/prod/plugin'

import HomeModule from './modules/home'
import DialogModule from './modules/dialog'

Vue.use(Vuex)

import state from './state'
import * as mutations from './mutations'
import * as getters from './getters'
import * as actions from './actions'

const store = new Vuex.Store({
  modules: { user: UserModule, order: OrderModule, prod: ProdModule, home: HomeModule, dialog: DialogModule },
  state,
  mutations,
  getters,
  actions,
  plugins: [UserPlugin, OrderPlugin, ProdPlugin],
  // plugins: [createPersistedState({ paths: ['OrderFilm.list', 'OrderFilm.seq'], fetchBeforeUse: true })],
})

const hotReloadElements = ['./state', './mutations', './getters', './actions', './modules/user', './modules/order', './modules/prod', './modules/Home', './modules/Dialog']

if (module.hot) {
  module.hot.accept(hotReloadElements, () => {
    const newMutations = require('./mutations').default
    const newGetters = require('./getters').default
    const newActions = require('./actions').default
    const newState = require('./state').default
    const newUserModule = require('./modules/user').default
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
        user: newUserModule,
        order: newOrderModule,
        prod: newProdModule,
        home: newHomeModule,
        dialog: newDialogModule,
      },
    })
  })
}

export default store
