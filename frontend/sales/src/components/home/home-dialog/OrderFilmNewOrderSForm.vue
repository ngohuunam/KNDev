<template>
  <div>
    <DataTable :value="orders" dataKey="_id" editMode="cell">
      <!-------------------- < Column: Remove Order > --------------------->
      <Column headerStyle="width: 2.6em; text-align: center" bodyStyle="text-align: center; overflow: visible; padding: 4px 0">
        <template #body="slotProps">
          <Button type="button" icon="pi pi-minus" class="p-button-danger margin-right" @click="remove(slotProps.data)"></Button>
        </template>
      </Column>
      <!-------------------- < Column: Foreign Title > --------------------->
      <Column field="foreignTitle" header="Foreign Title">
        <template #editor="slotProps">
          <InputText v-model="slotProps.data.foreignTitle" />
        </template>
        <template #body="slotProps">
          <span v-if="!slotProps.data[slotProps.column.field] && !errors[slotProps.index][slotProps.column.field]" style="color: gray;"> - EDIT - </span>
          <span v-else-if="!slotProps.data[slotProps.column.field] && errors[slotProps.index][slotProps.column.field]" style="color: orange;"> MUST FILL </span>
          <span v-else> {{ slotProps.data[slotProps.column.field] }} </span>
        </template>
      </Column>
      <!-------------------- < Column: Team > --------------------->
      <Column field="team" header="Team">
        <template #editor="slotProps">
          <Dropdown v-model="slotProps.data.team" :options="options" />
        </template>
        <template #body="slotProps">
          <span v-if="!slotProps.data[slotProps.column.field] && !errors[slotProps.index][slotProps.column.field]" style="color: gray;"> - EDIT - </span>
          <span v-else-if="!slotProps.data[slotProps.column.field] && errors[slotProps.index][slotProps.column.field]" style="color: orange;"> MUST FILL </span>
          <span v-else> {{ slotProps.data[slotProps.column.field] }} </span>
        </template>
      </Column>
      <!-------------------- < Column: NKC > --------------------->
      <Column field="premiereDate" header="NKC">
        <template #editor="slotProps">
          <!-- <Calendar v-model="slotProps.data.premiereDate" dateFormat="dd/mm/yy" style="width: 100%" /> -->
          <InputMask v-model="slotProps.data[slotProps.column.field]" mask="99/99/2029" slotChar="dd/mm/yyyy" />
        </template>
        <template #body="slotProps">
          <span v-if="!slotProps.data[slotProps.column.field] && !errors[slotProps.index][slotProps.column.field]" style="color: gray;"> - EDIT - </span>
          <span v-else-if="!slotProps.data[slotProps.column.field] && errors[slotProps.index][slotProps.column.field]" style="color: orange;"> WRONG FORMAT </span>
          <span v-else> {{ $tToString(parseDateTime(slotProps, false), false, 'INVALID', 'numeric') }} </span>
        </template>
      </Column>
      <!-------------------- < Column: End Date > --------------------->
      <Column field="endAt" header="End Date">
        <template #editor="slotProps">
          <!-- <Calendar v-model="slotProps.data.endAt" dateFormat="dd/mm/yy" style="width: 100%" showTime /> -->
          <InputMask v-model="slotProps.data[slotProps.column.field]" mask="99/99/2029 99:99" slotChar="dd/mm/yyyy hh:mm" />
        </template>
        <template #body="slotProps">
          <span v-if="!slotProps.data[slotProps.column.field] && !errors[slotProps.index][slotProps.column.field]" style="color: gray;"> - EDIT - </span>
          <span v-else-if="!slotProps.data[slotProps.column.field] && errors[slotProps.index][slotProps.column.field]" style="color: orange;"> WRONG FORMAT </span>
          <span v-else> {{ $tToString(parseDateTime(slotProps, true), true, 'INVALID', 'numeric') }} </span>
        </template>
      </Column>
      <!-------------------- < Column: Vietnamese Title > --------------------->
      <Column field="vietnameseTitle" header="Vietnamese Title">
        <template #editor="slotProps">
          <InputText v-model="slotProps.data[slotProps.column.field]" />
        </template>
        <template #body="slotProps">
          <span v-if="!slotProps.data[slotProps.column.field]" style="color: gray;"> - EDIT - </span>
          <span v-else> {{ slotProps.data[slotProps.column.field] }} </span>
        </template>
      </Column>
      <!-------------------- < Column: Note > --------------------->
      <Column field="note" header="Note">
        <template #editor="slotProps">
          <InputText v-model="slotProps.data[slotProps.column.field]" />
        </template>
        <template #body="slotProps">
          <span v-if="!slotProps.data[slotProps.column.field]" style="color: gray;"> - EDIT - </span>
          <span v-else> {{ slotProps.data[slotProps.column.field] }} </span>
        </template>
      </Column>
      <!-------------------- < Footer > --------------------->
      <template #footer> <Button label="Add one more" icon="pi pi-plus" @click="add" /> </template>
    </DataTable>
  </div>
</template>

<script>
import defaultState from '@/assets/defaultState'
import { dateToUnix } from '@/tools'

const randomOrderId = () => Date.now() + Math.floor(Math.random() * 100 + 1)
const randomNewOrder = () => ({ ...defaultState.newOrder, ...{ _id: randomOrderId(), note: '' } })

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
    parseDateTime(slotProps, hasTime) {
      const _field = slotProps.column.field
      const _str = slotProps.data[_field]
      const _unix = dateToUnix(_str, hasTime)
      if (_unix) return _unix
      this.errors[slotProps.index][_field] = true
    },
    add() {
      const _newRow = randomNewOrder()
      this.orders.push(_newRow)
      this.errors.push({ _id: false, rowId: _newRow._id, team: false, foreginTitle: false })
    },
    remove(data) {
      this.orders = this.orders.filter(v => v._id !== data._id)
      this.errors = this.errors.filter(v => v.rowId !== data._id)
    },
    confirm() {
      let _requiredErr = false
      let _existedIds = []
      this.orders.map((v, i) => {
        if (!v.foreignTitle) {
          this.errors[i].foreignTitle = true
          _requiredErr = true
        } else {
          v._id = v.foreignTitle.toDataId()
          this.errors[i].rowId = v._id
          if (this.$store.getters['Order/Film/isExisted'](v._id)) {
            this.errors[i]._id = true
            _existedIds.push(v._id)
          }
        }
        if (!v.foreignTitle) {
          this.errors[i].foreignTitle = true
          _requiredErr = true
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
      else this.doCreate()
    },
    doCreate() {
      // this.$store.dispatch('Order/Film/newOrdersSave', this.orders)
      this.$store.dispatch('Order/Film/Worker', { name: 'newOrders', payload: this.orders })
    },
  },
  computed: {
    dialogMess: {
      get() {
        return this.$store.state.dialog.message
      },
      set(value) {
        this.$store.commit('Dialog/setMess', value)
      },
    },
  },
  created: function() {
    this.orders = []
    this.errors = []
    this.log = ''
    this.add()
  },
  beforeDestroy: function() {
    this.orders = []
    this.errors = []
    this.log = ''
  },
}
</script>

<style scoped></style>
