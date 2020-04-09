<template>
  <div>
    <div class="p-grid p-fluid" v-for="item in newOrderLabels" :key="item.label">
      <div class="p-col-4" style="margin: auto;">
        <label>{{ item.label }}</label>
      </div>
      <div class="p-col-8">
        <InputText v-if="item.inputType === 'text'" v-model="newOrder[item.key]" />
        <Calendar v-else-if="item.inputType === 'calendar-full'" v-model="newOrder[item.key]" dateFormat="dd/mm/yy" />
        <Calendar v-else-if="item.inputType === 'calendar'" :showTime="true" v-model="newOrder[item.key]" dateFormat="dd/mm/y" />
        <Dropdown v-else-if="item.inputType === 'dropdown'" v-model="newOrder[item.key]" :options="item.options" />
      </div>
    </div>
    <!-- <div class="p-grid p-fluid"> -->
    <!-- <div class="p-col-4" style="margin: auto;">
        <label>Log:</label>
      </div>
      <div class="p-col-8"></div> -->
    <!-- <div class="p-col-12"> -->
    <Editor v-model="note" editorStyle="height: 60px">
      <template slot="toolbar">
        <span class="ql-formats">
          <button class="ql-bold"></button>
          <button class="ql-italic"></button>
          <button class="ql-underline"></button>
        </span>
        <span class="ql-formats">
          <button class="ql-link"></button>
          <button class="ql-image"></button>
          <button class="ql-code-block"></button>
        </span>
        <span class="ql-formats">
          <button class="ql-clean"></button>
        </span>
      </template>
    </Editor>
    <!-- <Textarea v-model="log" :autoResize="true" rows="2" cols="30" /> -->
    <!-- </div> -->
    <div class="margin-top">
      <FileUpload mode="advanced" name="demo[]" url="./upload" />
    </div>
    <!-- </div> -->
  </div>
</template>

<script>
import defaultState from '@/assets/defaultState'
// Object.freeze(defaultState.newOrder)

export default {
  name: 'OrderFilmNewOrderForm',
  components: {},
  data: () => ({
    note: '',
  }),
  methods: {
    confirm() {
      let _newId = 'abc'
      let _requiredMess = ''
      let _idExistedMess = ''
      let _validateMess = ''
      if (this.newOrder.foreignTitle) {
        _newId = this.newOrder.foreignTitle.toDataId()
        if (this.$store.state.Order.Film.list.some(fo => fo._id === _newId)) _idExistedMess = _newId + ' EXISTED'
      } else _requiredMess = 'Short Title'
      if (!this.newOrder.team) _requiredMess += _requiredMess ? ' + Team ' : 'Team'
      if (!this.newOrder.foreignTitle) _requiredMess += _requiredMess ? ' + Foreign Title' : 'Foreign Title'
      if (_requiredMess) _requiredMess = `${_requiredMess} ${_requiredMess.indexOf('+') > -1 ? 'ARE' : 'IS'} REQUIRED`
      if (_idExistedMess && !_requiredMess) _validateMess = _idExistedMess
      else if (!_idExistedMess && _requiredMess) _validateMess = _requiredMess
      else if (_idExistedMess && _requiredMess) _validateMess = `${_idExistedMess} - ${_requiredMess}`
      if (_validateMess) this.dialogMess = { text: _validateMess, severity: 'error' }
      else this.doCreate()
    },
    doCreate() {
      this.$store.commit('Order/Film/createNewOrder', { note: this.note })
      this.$emit('switch-comp', 'newOrderConfirm', 'Save', 'Save new order confirm')
      this.dialogMess = { text: '', severity: '' }
    },
  },
  computed: {
    newOrderLabels() {
      return this.$store.state.Order.Film.newOrderLabels
    },
    dialogMess: {
      get() {
        return this.$store.state.Dialog.message
      },
      set(value) {
        this.$store.commit('Dialog/setMess', value)
      },
    },
    newOrder: {
      get() {
        return this.$store.state.Order.Film.newOrder
      },
      set(value) {
        this.$store.commit('Order/Film/setState', { key: 'newOrder', data: value })
      },
    },
  },
  created: function() {
    console.log(defaultState)
    this.newOrder = defaultState.order.film.new
  },
  beforeDestroy: function() {},
}
</script>

<style scoped></style>
