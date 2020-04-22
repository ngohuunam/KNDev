<template>
  <div>
    <DataTable :value="orders" dataKey="_id" editMode="cell">
      <!-------------------- < Column: Remove Order > --------------------->
      <Column headerStyle="width: 2.6em; text-align: center" bodyStyle="text-align: center; overflow: visible; padding: 4px 0">
        <template #body="{index}">
          <Button type="button" icon="pi pi-minus" class="p-button-danger margin-right" @click="remove(index)"></Button>
        </template>
      </Column>
      <!-------------------- < Column: Foreign Title > --------------------->
      <Column field="foreignTitle" header="Foreign Title">
        <template #editor="{data, column: {field} }">
          <InputText v-model="data[field]" />
        </template>
        <template #body="{data, column: {field}, index }">
          <span v-if="!data[field] && !errors[index][field]" style="color: gray;">
            - EDIT -
          </span>
          <span v-else-if="!data[field] && errors[index][field]" style="color: orange;">
            MUST FILL
          </span>
          <span v-else> {{ data[field] }} </span>
        </template>
      </Column>
      <!-------------------- < Column: Team > --------------------->
      <Column field="team" header="Team">
        <template #editor="slotProps">
          <Dropdown v-model="slotProps.data.team" :options="options" />
        </template>
        <template #body="{data, column: {field}, index }">
          <span v-if="!data[field] && !errors[index][field]" style="color: gray;">
            - EDIT -
          </span>
          <span v-else-if="!data[field] && errors[index][field]" style="color: orange;">
            MUST FILL
          </span>
          <span v-else> {{ data[field] }} </span>
        </template>
      </Column>
      <!-------------------- < Column: NKC > --------------------->
      <Column field="premiereDate" header="NKC">
        <template #editor="{data, column: {field} }">
          <!-- <Calendar v-model="slotProps.data.premiereDate" dateFormat="dd/mm/yy" style="width: 100%" /> -->
          <InputMask v-model="data[field]" mask="99/99/2029" slotChar="dd/mm/yyyy" />
        </template>
        <template #body="{data, column: {field}, index }">
          <span v-if="!data[field] && !errors[index][field]" style="color: gray;">
            - EDIT -
          </span>
          <span v-else-if="!data[field] && errors[index][field]" style="color: orange;">
            WRONG FORMAT
          </span>
          <span v-else> {{ $tToString(parseDateTime(data[field], index, field, false), false, 'INVALID', 'numeric') }} </span>
        </template>
      </Column>
      <!-------------------- < Column: End Date > --------------------->
      <Column field="endAt" header="End Date">
        <template #editor="{data, column: {field} }">
          <!-- <Calendar v-model="slotProps.data.endAt" dateFormat="dd/mm/yy" style="width: 100%" showTime /> -->
          <InputMask v-model="data[field]" mask="99/99/2029 99:99" slotChar="dd/mm/yyyy hh:mm" />
        </template>
        <template #body="{data, column: {field}, index }">
          <span v-if="!data[field] && !errors[index][field]" style="color: gray;">
            - EDIT -
          </span>
          <span v-else-if="!data[field] && errors[index][field]" style="color: orange;">
            WRONG FORMAT
          </span>
          <span v-else> {{ $tToString(parseDateTime(data[field], index, field, true), true, 'INVALID', 'numeric') }} </span>
        </template>
      </Column>
      <!-------------------- < Column: Vietnamese Title > --------------------->
      <Column field="vietnameseTitle" header="Vietnamese Title">
        <template #editor="{data, column: {field} }">
          <InputText v-model="data[field]" />
        </template>
        <template #body="{data, column: {field} }">
          <span v-if="!data[field]" style="color: gray;"> - EDIT - </span>
          <span v-else> {{ data[field] }} </span>
        </template>
      </Column>
      <!-------------------- < Column: Note > --------------------->
      <Column field="note" header="Note">
        <template #editor="{data, column: {field} }">
          <InputText v-model="data[field]" />
        </template>
        <template #body="{data, column: {field} }">
          <span v-if="!data[field]" style="color: gray;"> - EDIT - </span>
          <span v-else> {{ data[field] }} </span>
        </template>
      </Column>
      <!-------------------- < Footer > --------------------->
      <template #footer> <Button label="Add one more" icon="pi pi-plus" @click="add" /> </template>
    </DataTable>
  </div>
</template>

<script>
// import { order } from '@/assets/defaultState'
import { dateToUnix } from '@/tools'

// const randomOrderId = () => Date.now() + Math.floor(Math.random() * 100 + 1)
// const randomNewOrder = () => ({ ...order.film.new, ...{ _id: randomOrderId(), note: '' } })

export default {
  name: 'OrderFilmNewOrderSForm',
  components: {},
  props: {},
  data: () => ({
    options: ['CJHK', 'Disney', 'Local', 'UIP', 'WB'],
    log: '',
    orders: [],
    errors: [],
  }),
  methods: {
    parseDateTime(data, index, field, hasTime) {
      if (data instanceof Date) return data
      const _unix = dateToUnix(data, hasTime)
      if (_unix) return _unix
      this.errors[index][field] = true
    },
    add() {
      const _newRow = this.$randomNewOrderFilm(this.construct)
      _newRow.note = ''
      this.orders.push(_newRow)
      this.errors.push({ _id: false, rowId: _newRow._id, team: false, foreginTitle: false })
    },
    remove(index) {
      this.orders.splice(index, 1)
      this.errors.splice(index, 1)
      // this.orders = this.orders.filter(v => v._id !== data._id)
      // this.errors = this.errors.filter(v => v.rowId !== data._id)
    },
    confirm() {
      let _requiredErr = false
      let _existedIds = []
      this.orders.map((v, i) => {
        if (!v.foreignTitle) {
          this.errors[i].foreignTitle = true
          _requiredErr = true
        } else {
          v._id = v.foreignTitle.to_id()
          this.errors[i].rowId = v._id
          if (this.list.some(({ _id }) => _id === v._id)) {
            this.errors[i]._id = true
            _existedIds.push(v._id)
          }
        }
        if (!v.team) {
          this.errors[i].team = true
          _requiredErr = true
        }
      })
      let _mess = ''
      if (_requiredErr && !_existedIds.length) _mess = 'Orange Field Required'
      else if (!_requiredErr && _existedIds.length) _mess = _existedIds.join(', ') + ' Existed'
      else if (_requiredErr && _existedIds.length) _mess = _existedIds.join(', ') + ' Existed && Orange Field Required'

      if (_mess) this.dialogMess = { text: _mess, severity: 'error' }
      else this.doCreate(true)
    },
    doCreate(isChecked) {
      if (this.dialogMess.severity) this.dialogMess = { text: '', severity: '' }
      if (!isChecked) {
        if (this.orders.some(o => !o.foreignTitle)) this.dialogMess = { text: 'All Foreign Title required', severity: 'error' }
        else if (this.list.some(o => this.orders.some(({ foreignTitle }) => foreignTitle.to_id() === o._id))) this.dialogMess = { text: 'Some Title Existed', severity: 'error' }
      }
      if (this.dialogMess.severity !== 'error') this.$store.dispatch('order/film/Worker', { name: 'inserts', payload: this.orders })
    },
  },
  computed: {
    list() {
      return this.$store.state.order.film.list
    },
    construct() {
      return this.$store.getters['order/construct']('film')
    },
    dialogMess: {
      get() {
        return this.$store.state.dialog.message
      },
      set(value) {
        this.$store.commit('dialog/setMess', value)
      },
    },
  },
  created: function() {
    this.add()
  },
  beforeDestroy: function() {
    // this.orders = []
    // this.errors = []
    // this.log = ''
  },
}
</script>

<style scoped></style>
