// eslint-disable-next-line no-unused-vars
import Vue from 'vue'
import { Store, set } from 'idb-keyval'

const install = Vue => {
  Vue.prototype.$idbSet = set
  Vue.prototype.$idbStore = new Store('kn', 'data')
}
export { install }
