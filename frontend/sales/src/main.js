import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import DataTable from 'primevue/datatable'
Vue.component('DataTable', DataTable)
const NewDataTable = Vue.component('DataTable').extend({
  name: 'NewDataTable',
  props: {
    dataKey: {
      type: String,
      default: '_rev',
    },
    rows: {
      type: Number,
      default: 10,
    },
    paginator: {
      type: Boolean,
      default: true,
    },
    paginatorTemplate: {
      type: String,
      default: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown',
    },
    rowsPerPageOptions: {
      type: Array,
      default: () => [10, 25, 50],
    },
    currentPageReportTemplate: {
      type: String,
      default: '{first}-{last}/{totalRecords}',
    },
    loadingIcon: {
      type: String,
      default: '',
    },
    removableSort: {
      type: Boolean,
      default: true,
    },
    rowHover: {
      type: Boolean,
      default: true,
    },
    scrollable: {
      type: Boolean,
      default: true,
    },
    scrollHeight: {
      type: String,
      default: '300px',
    },
  },
})
Vue.component('NewDataTable', NewDataTable)

import Column from 'primevue/column'
Vue.component('Column', Column)
const NewColumn = Vue.component('Column').extend({
  name: 'NewColumn',
  props: {
    filterMatchMode: {
      type: String,
      default: 'contains',
    },
    sortable: {
      type: Boolean,
      default: true,
    },
  },
})
Vue.component('NewColumn', NewColumn)

import ColumnGroup from 'primevue/columngroup'
Vue.component('ColumnGroup', ColumnGroup)

import InputText from 'primevue/inputtext'
Vue.component('InputText', InputText)

import Calendar from 'primevue/calendar'
Vue.component('Calendar', Calendar)
const NewCalendar = Vue.component('Calendar').extend({
  name: 'NewCalendar',
  props: {
    dateFormat: {
      type: String,
      default: 'dd/mm/yy',
    },
    showIcon: {
      type: Boolean,
      default: true,
    },
    hideOnDateTimeSelect: {
      type: Boolean,
      default: true,
    },
    monthNavigator: {
      type: Boolean,
      default: true,
    },
    yearNavigator: {
      type: Boolean,
      default: true,
    },
    yearRange: {
      type: String,
      default: '2020:2030',
    },
    showOnFocus: {
      type: Boolean,
      default: false,
    },
    showButtonBar: {
      type: Boolean,
      default: true,
    },
    manualInput: {
      type: Boolean,
      default: false,
    },
  },
})
Vue.component('NewCalendar', NewCalendar)

import MultiSelect from 'primevue/multiselect'
Vue.component('MultiSelect', MultiSelect)

import PanelMenu from 'primevue/panelmenu'
Vue.component('PanelMenu', PanelMenu)

import ToastService from 'primevue/toastservice'
Vue.use(ToastService)
import Toast from 'primevue/toast'
Vue.component('Toast', Toast)
const NewToast = Vue.component('Toast').extend({
  name: 'NewToast',
  methods: {
    remove(message) {
      let index = this.messages.findIndex(mess => mess === message)
      this.messages.splice(index, 1)
      this.$emit('close', message.detail)
    },
  },
})
Vue.component('NewToast', NewToast)

import Button from 'primevue/button'
Vue.component('Button', Button)

import Dialog from 'primevue/dialog'
Vue.component('Dialog', Dialog)
const NewDialog = Vue.component('Dialog').extend({
  name: 'NewDialog',
  props: {
    disableKeyTab: {
      type: Boolean,
      default: false,
    },
    modal: {
      type: Boolean,
      default: true,
    },
    closable: {
      type: Boolean,
      default: true,
    },
    contentStyle: { overflow: 'visible' },
  },
  documentKeyupListener: null,
  methods: {
    newOnKeyDown() {},
    replaceOnKeyDown(e) {
      if (!this.disableKeyTab) this.newOnKeyDown(e)
    },
    onKeyUp(event) {
      if (event.which === 13) {
        this.$emit('keyup-enter', event)
      } else if (event.which === 27) {
        this.$emit('keyup-escape', event)
      }
    },
    bindDocumentKeyupListener() {
      if (!this.documentKeyupListener) {
        this.documentKeyupListener = this.onKeyUp.bind(this)
        window.document.addEventListener('keyup', this.documentKeyupListener)
      }
    },
    unbindDocumentKeyupListener() {
      if (this.documentKeyupListener) {
        window.document.removeEventListener('keyup', this.documentKeyupListener)
        this.documentKeyupListener = null
      }
    },
  },
  created() {
    this.newOnKeyDown = this.onKeyDown
    this.onKeyDown = this.replaceOnKeyDown
  },
  mounted() {
    this.bindDocumentKeyupListener()
    this.removeStylesFromMask()
  },
  beforeDestroy() {
    this.disableDocumentSettings()
    this.unbindDocumentKeyupListener()
  },
})
Vue.component('NewDialog', NewDialog)

import Checkbox from 'primevue/checkbox'
Vue.component('Checkbox', Checkbox)

import ToggleButton from 'primevue/togglebutton'
Vue.component('ToggleButton', ToggleButton)

import ProgressBar from 'primevue/progressbar'
Vue.component('ProgressBar', ProgressBar)

import Dropdown from 'primevue/dropdown'
Vue.component('Dropdown', Dropdown)

import BlockUI from 'primevue/blockui'
Vue.component('BlockUI', BlockUI)

import ProgressSpinner from 'primevue/progressspinner'
Vue.component('ProgressSpinner', ProgressSpinner)

import Message from 'primevue/message'
Vue.component('Message', Message)
const NewMessage = Vue.component('Message').extend({
  name: 'NewMessage',
  props: ['index'],
  watch: {
    visible: function(v) {
      if (v === false) this.$emit('close-message', this.index)
    },
  },
})
Vue.component('NewMessage', NewMessage)

import Menu from 'primevue/menu'
Vue.component('Menu', Menu)

import ContextMenu from 'primevue/contextmenu'
Vue.component('ContextMenu', ContextMenu)

import Chips from 'primevue/chips'
Vue.component('Chips', Chips)

import Editor from 'primevue/editor'
Vue.component('Editor', Editor)
const NewEditor = Vue.component('Editor').extend({
  name: 'NewEditor',
  props: ['readOnly'],
})
Vue.component('NewEditor', NewEditor)

import Textarea from 'primevue/textarea'
Vue.component('Textarea', Textarea)

import FileUpload from 'primevue/fileupload'
Vue.component('FileUpload', FileUpload)

import InputMask from 'primevue/inputmask'
Vue.component('InputMask', InputMask)

import Tooltip from 'primevue/tooltip'
Vue.directive('tooltip', Tooltip)

// import OverlayPanel from 'primevue/overlaypanel'
// Vue.component('OverlayPanel', OverlayPanel)

import TreeTable from 'primevue/treetable'
Vue.component('TreeTable', TreeTable)

import AccordionTab from 'primevue/accordiontab'
Vue.component('AccordionTab', AccordionTab)

import Accordion from 'primevue/accordion'
Vue.component('Accordion', Accordion)
const NewAccordion = Vue.component('Accordion').extend({
  name: 'NewAccordion',
  props: ['highlight'],
  methods: {
    onTabClick(event, tab) {
      if (event.target.className.includes('p-accordion-toggle-icon')) {
        if (!tab.disabled) {
          if (!this.multiple && !tab.d_active) {
            this.tabs.forEach(tab => (tab.d_active = false))
          }

          const newActiveState = !tab.d_active
          tab.d_active = newActiveState
          tab.$emit('update:active', newActiveState)
          let eventName = newActiveState ? 'tab-open' : 'tab-close'
          this.$emit(eventName, {
            originalEvent: event,
            tab: tab,
          })
        }
      }
    },
  },
})
Vue.component('NewAccordion', NewAccordion)

import Listbox from 'primevue/listbox'
Vue.component('Listbox', Listbox)
const NewListbox = Vue.component('Listbox').extend({
  name: 'NewListbox',
  props: {
    listStyle: {
      type: String,
      default: 'text-align: left, max-height: 1500px;',
    },
    dataKey: {
      type: String,
      default: '_id',
    },
    multiple: {
      type: Boolean,
      default: true,
    },
    filter: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    onOptionSelectMultiple(event, option) {
      if (event.target.className.includes('p-accordion-header') || event.target.parentElement.className.includes('p-accordion-header')) {
        let selected = this.isSelected(option)
        let valueChanged = false
        let value = null
        let metaSelection = this.optionTouched ? false : this.metaKeySelection

        if (metaSelection) {
          let metaKey = event.metaKey || event.ctrlKey

          if (selected) {
            if (metaKey) value = this.removeOption(option)
            else value = [this.getOptionValue(option)]

            valueChanged = true
          } else {
            value = metaKey ? this.value || [] : []
            value = [...value, this.getOptionValue(option)]
            valueChanged = true
          }
        } else {
          if (selected) value = this.removeOption(option)
          else value = [...(this.value || []), this.getOptionValue(option)]

          valueChanged = true
        }

        if (valueChanged) {
          this.updateModel(event, value)
        }
      }
    },
  },
})
Vue.component('NewListbox', NewListbox)

import 'primevue/resources/themes/nova-light/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import '@/assets/myCss.css'
import './css/override.css'

Vue.config.productionTip = false
Vue.config.devtools = true
Vue.config.performance = true

// import defaultState from '@/assets/defaultState'
import VueSocketIOExt from 'vue-socket.io-extended'
import io from 'socket.io-client'
import * as globalInstance from './globalInstance'

// console.log('store', store)
const { user } = store.state
const { dept, page, token } = user
const url = `${window.location.origin}/${dept}/${page}?token=${token}`
// console.log('url', url)

const socket = io(url, {
  // WARNING: in that case, there is no fallback to long-polling
  transports: ['websocket', 'polling'], // or [ 'websocket', 'polling' ], which is the same thing
})
Vue.use(VueSocketIOExt, socket, { store })
Vue.use(globalInstance)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

router.replace('/')
