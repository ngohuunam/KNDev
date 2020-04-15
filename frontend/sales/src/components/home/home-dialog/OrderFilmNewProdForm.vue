<template>
  <div>
    <div class="p-grid p-fluid" v-for="item in newProdLabels" :key="item.label">
      <div class="p-col-4" style="margin: auto;">
        <label>{{ item.label }}</label>
      </div>
      <div class="p-col-8">
        <InputText v-if="item.inputType === 'text'" v-model="newProd[item.key]" :disabled="disabled" />
        <Calendar v-else-if="item.inputType === 'calendar'" :showTime="item.showTime" v-model="newProd[item.key]" :dateFormat="item.dateFormat" :disabled="disabled" />
        <Dropdown v-else-if="item.inputType === 'dropdown'" v-model="newProd[item.key]" :options="item.options" :disabled="disabled" />
      </div>
    </div>
    <NewEditor v-model="newProd.details" NewEditorStyle="height: 60px" :readOnly="disabled">
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
    </NewEditor>
    <!-- <Textarea v-model="log" :autoResize="true" rows="2" cols="30" /> -->
    <!-- </div> -->
    <div class="margin-top">
      <FileUpload mode="advanced" name="demo[]" url="./upload" :disabled="disabled" />
    </div>
    <!-- </div> -->
  </div>
</template>

<script>
import { prod } from '@/assets/defaultState'

export default {
  name: 'OrderFilmNewProdForm',
  components: {},
  props: {
    cp: {
      type: Object,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return { note: '' }
  },
  methods: {
    checkId() {
      if (this.newProd.name) {
        const _newId = `${this.cp._id}:${this.newProd.name.to_id()}`
        if (this.cp.products.some(fp => fp === _newId)) return _newId + ' EXISTED'
        else {
          this.newProd._id = _newId
          this.newProd.orderId = this.cp._id
          this.newProd.orderRev = this.cp._rev
          this.newProd.note = this.note
          return ''
        }
      }
      return 'Product Name'
    },
    confirm() {
      let _idExistedMess = ''
      let _validateMess = ''
      let _requiredMess = this.checkId()
      if (!this.newProd.type) _requiredMess.concat(_requiredMess ? ' + Type are required' : 'Type is required')
      if (_idExistedMess && !_requiredMess) _validateMess = _idExistedMess
      else if (_requiredMess && !_idExistedMess) _validateMess = _requiredMess
      else if (_idExistedMess && _requiredMess) _validateMess = `${_idExistedMess} - ${_requiredMess}`
      if (_validateMess) this.dialogMess = { text: _validateMess, severity: 'error' }
      else this.doCreate(true)
    },
    doCreate(idChecked) {
      if (!idChecked) this.checkId()
      if (this.newProd._id) {
        this.$store.commit('Prod/Film/create', this.newProd)
        this.$emit('switch-comp', 'newProdConfirm', 'Save', 'Save new product confirm', this.cp)
        this.dialogMess = { text: '', severity: '' }
      } else this.dialogMess = { text: "Product's name required", severity: 'error' }
    },
  },
  computed: {
    newProdLabels() {
      return this.$store.state.Prod.Film.labels
    },
    dialogMess: {
      get() {
        return this.$store.state.Dialog.message
      },
      set(value) {
        this.$store.commit('Dialog/setMess', value)
      },
    },
    newProd: {
      get() {
        return this.$store.state.Prod.Film.new
      },
      set(value) {
        this.$store.commit('Prod/Film/setState', { key: 'new', data: value })
      },
    },
  },
  created() {
    if (!this.newProd) this.newProd = { ...prod.film.new }
  },
  beforeDestroy() {},
}
</script>

<style scoped></style>
