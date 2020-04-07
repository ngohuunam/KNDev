// eslint-disable-next-line no-unused-vars
import Vue from 'vue'
import { Store, set, get, del } from 'idb-keyval'

const install = Vue => {
  // 4. add an instance method
  Vue.prototype.$idbSet = set
  Vue.prototype.$idbGet = get
  Vue.prototype.$idbDel = del
  Vue.prototype.$idbStore = new Store('kn', 'user')
}
export { install }
