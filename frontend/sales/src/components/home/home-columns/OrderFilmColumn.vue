<template>
  <div>
    <DataTable
      :value="list"
      dataKey="_id"
      :selection.sync="tempSelected"
      :filters="filters"
      :rowHover="true"
      :loading="loading"
      loadingIcon=""
      @row-select="onRowSelect"
      @row-unselect="onRowUnselect"
      @row-unselect-all="onRowUnselectAll"
      :rowClass="rowClass"
      @row-click="onRowClick"
    >
      <!-------------------- < Header > --------------------->
      <template #header>
        <div class="table-header-container">
          <div style="text-align: left">
            <Button :label="enlarge ? 'New Order' : ''" icon="pi pi-plus" @click="create" class="margin-right" />
            <Button :label="enlarge ? 'Some New Order' : ''" icon="pi pi-bars" @click="creates" class="margin-right" />
            <Button
              :label="enlarge ? ($socket.connected ? 'Connected' : socketError || 'Disconnected') : ''"
              :icon="'pi ' + ($socket.connected ? 'pi-wifi' : 'pi-ban')"
              :class="'margin-right ' + ($socket.connected ? 'p-button-success' : 'p-button-danger')"
            />
            <Button v-if="tempSelected.length" :label="loadBtnProp.label" :icon="loadBtnProp.icon" @click="load" :disabled="loadBtnProp.disabled" class="margin-right" />
            <Button v-if="tempSelected.length" :label="enlarge ? 'Delete Orders' : ''" icon="pi pi-minus" @click="confirmDel" class="p-button-danger margin-right" />
            <!-- <ToggleButton v-if="!enlarge" v-model="enlarge" @change="onToggleEnlarge" onIcon="pi pi-angle-left" offIcon="pi pi-angle-right" /> -->
            <InputText v-if="enlarge" v-model="filters['global']" placeholder="Search" style="width: 20%" class="margin-right" />
            <Button v-if="hasOrderChanged" :label="enlarge ? 'Sth Changed' : ''" :icon="btnIcon('allChangedCheck', 'pi-star')" @click="allChangedCheck" class="margin-right" />
            <Button v-if="hasNewOrder" :label="enlarge ? 'New Order' : ''" :icon="btnIcon('allNewCheck', 'pi-file-o')" @click="allRowCheck('new')" class="margin-right" />
            <Button
              v-if="hasDroppedOrder"
              :label="enlarge ? 'Dropped Order' : ''"
              :icon="btnIcon('allDroppedCheck', 'pi-file-o')"
              @click="allRowCheck('dropped')"
              class="margin-right"
            />
            <ToggleButton :onLabel="enlarge ? 'Collapse' : ''" offLabel=" " v-model="enlarge" @change="onToggleEnlarge" onIcon="pi pi-angle-left" offIcon="pi pi-angle-right" />
            <InputText v-if="!enlarge" v-model="filters['global']" placeholder="Search" style="width: 100%" class="margin-top" />
          </div>
        </div>
      </template>
      <!-------------------- < Loading > --------------------->
      <template #loading>
        <div class="text-center">Loading records...</div>
        <ProgressBar mode="indeterminate" />
      </template>
      <!-------------------- < Column: Add Prod > --------------------->
      <!-- <Column headerStyle="width: 2.6em; text-align: center" bodyStyle="text-align: center; overflow: visible; padding: 4px 0">
        <template #body="slotProps">
          <Button type="button" :icon="slotProps.data.ui ? 'pi pi-plus' : 'pi pi-thumbs-up'" @click="rowMenu(slotProps.data)"></Button>
        </template>
      </Column> -->
      <!-------------------- < Column: Edit Order > --------------------->
      <!-- <Column headerStyle="width: 2.6em; text-align: center" bodyStyle="text-align: center; overflow: visible; padding: 4px 0">
        <template #body="slotProps">
          <Button type="button" icon="pi pi-pencil" @click="edit(slotProps.data._id)"></Button>
        </template>
      </Column> -->
      <!-------------------- < Column: Selection > --------------------->
      <Column selectionMode="multiple" bodyStyle="padding: 0" headerStyle="width: 2.5em" :sortable="true" sortField="selected"></Column>
      <!-------------------- < Column: Foreign Title > --------------------->
      <Column field="foreignTitle" :header="enlarge ? 'Foreign Title' : 'Title'" :headerStyle="enlarge ? 'width: 18%' : ''" filterMatchMode="contains" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['foreignTitle']" class="p-column-filter" />
        </template>
        <template #body="slotProps">
          <div style="position: relative">
            <span><i v-if="icon.row[slotProps.data._id]" :class="`${icon.row[slotProps.data._id]} icon-loading`"></i> {{ slotProps.data.foreignTitle }} </span>
          </div>
          <!-- <span>{{ slotProps.data.foreignTitle }} </span> -->
        </template>
      </Column>
      <!-------------------- < Column: NKC > --------------------->
      <Column v-if="enlarge" field="premiereDate" header="NKC" filterMatchMode="contains" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['premiereDate']" class="p-column-filter" />
        </template>
        <template #body="slotProps">
          <Button
            v-if="cellBtnVisible(slotProps.data._id, slotProps.column.field)"
            :icon="cellIcon(slotProps.data._id, slotProps.column.field)"
            :label="slotProps.data[slotProps.column.field]"
            @click="checkChange($event, slotProps)"
          />
          <span v-else> {{ $tToString(slotProps.data[slotProps.column.field], false, '') }} </span>
        </template>
      </Column>
      <!-------------------- < Column: Status > --------------------->
      <Column v-if="enlarge" field="status" header="Status" filterMatchMode="in" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['status']" class="p-column-filter" />
          <!-- <MultiSelect v-model="filters['status']" :options="orders" optionLabel="status" optionValue="status" placeholder="All" class="p-column-filter"></MultiSelect> -->
        </template>
        <template #body="slotProps">
          <Button
            v-if="cellBtnVisible(slotProps.data._id, slotProps.column.field)"
            :icon="cellIcon(slotProps.data._id, slotProps.column.field)"
            :label="slotProps.data[slotProps.column.field]"
            @click="checkChange($event, slotProps)"
          />
          <span v-else> {{ slotProps.data[slotProps.column.field] }} </span>
        </template>
      </Column>
      <!-------------------- < Column: Product Names > --------------------->
      <Column field="productNames" header="Products" filterMatchMode="in" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['productNames']" class="p-column-filter" />
        </template>
        <template #body="slotProps">
          <Button
            v-if="cellBtnVisible(slotProps.data._id, slotProps.column.field)"
            :icon="cellIcon(slotProps.data._id, slotProps.column.field)"
            :label="slotProps.data[slotProps.column.field]"
            @click="checkChange($event, slotProps)"
          />
          <span v-else> {{ slotProps.data[slotProps.column.field] }} </span>
        </template>
      </Column>
      <!-------------------- < Column: Create At > --------------------->
      <Column v-if="enlarge" field="createdAt" header="Create" headerStyle="width: 10%" filterMatchMode="contains" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['createdAt']" class="p-column-filter" />
        </template>
        <template #body="slotProps">
          <span> {{ $tToString(slotProps.data[slotProps.column.field], true, '') }} </span>
        </template>
      </Column>
      <!-------------------- < Column: End At > --------------------->
      <Column v-if="enlarge" field="endAt" header="End" headerStyle="width: 10%" filterMatchMode="contains" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['endAt']" class="p-column-filter" />
        </template>
        <template #body="slotProps">
          <Button
            v-if="cellBtnVisible(slotProps.data._id, slotProps.column.field)"
            :icon="cellIcon(slotProps.data._id, slotProps.column.field)"
            :label="slotProps.data[slotProps.column.field]"
            @click="checkChange($event, slotProps)"
          />
          <span v-else> {{ $tToString(slotProps.data[slotProps.column.field], true, '') }} </span>
        </template>
      </Column>
      <!-------------------- < Column: Finish At > --------------------->
      <Column v-if="enlarge" field="finishAt" header="Finish" headerStyle="width: 10%" filterMatchMode="contains" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['finishAt']" class="p-column-filter" />
        </template>
        <template #body="slotProps">
          <Button
            v-if="cellBtnVisible(slotProps.data._id, slotProps.column.field)"
            :icon="cellIcon(slotProps.data._id, slotProps.column.field)"
            :label="slotProps.data[slotProps.column.field]"
            @click="checkChange($event, slotProps)"
          />
          <span v-else> {{ $tToString(slotProps.data[slotProps.column.field], true, '') }} </span>
        </template>
      </Column>
      <!-------------------- < Column: Vietnamese Title > --------------------->
      <Column v-if="enlarge" field="vietnameseTitle" header="Vietnamese Title" headerStyle="width: 18%" filterMatchMode="contains" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['vietnameseTitle']" class="p-column-filter" />
        </template>
        <template #body="slotProps">
          <Button
            v-if="cellBtnVisible(slotProps.data._id, slotProps.column.field)"
            :icon="cellIcon(slotProps.data._id, slotProps.column.field)"
            :label="slotProps.data[slotProps.column.field]"
            @click="checkChange($event, slotProps)"
          />
          <span v-else> {{ slotProps.data[slotProps.column.field] }} </span>
        </template>
      </Column>
      <!-------------------- < Footer > --------------------->
      <template v-if="messages.length" #footer>
        <NewMessage v-for="(message, i) in messages" :key="i" @close-message="closeMessage" :index="i" :severity="message.severity">{{ message.text }}</NewMessage>
      </template>
      <template #empty><div class="text-center">No records found.</div></template>
    </DataTable>
    <ContextMenu :model="menuModel" ref="cm" />
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'OrderFilmColumn',
  components: {},
  data() {
    return {
      filters: {},
      sectedOrdersHasProd: false,
      enlarge: true,
      socketError: 'Disconnected',
      rowClickData: null,
      menuModel: [],
      tempSelected: [],
      menuModelNormal: [
        { label: ``, icon: 'pi pi-dollar' },
        { separator: true },
        { separator: true },
        { label: 'Add product', icon: 'pi pi-fw pi-upload', command: () => this.addProd() },
        { label: 'View', icon: 'pi pi-fw pi-search', command: () => this.edit() },
        { label: 'Delete', icon: 'pi pi-fw pi-times', command: () => this.deleteThis() },
      ],
      menuRowCheckModel: [{ label: 'Check', icon: 'pi pi-thumbs-up', command: () => this.rowCheck() }],
      menuCellCheckChangeModel: [],
    }
  },
  methods: {
    rowCheck() {
      const payload = { type: 'new', year: this.year, db: 'order', col: 'film', _id: this.rowClickData.data._id }
      if (this.rowClickData.data.dropped) payload.type = 'dropped'
      this.$store.commit('user/Worker', { name: 'rowCheck', payload })
    },
    checkChange(e, slotProps) {
      console.log('checkChange slotProps:', slotProps)
      const { field } = slotProps.column
      const { _id } = slotProps.data
      const _change = this.ui[_id].changes[field]
      const _logs = _change.logs.map(log => ({
        label: `${log.type}${log.name ? ` - ${log.name}` : ''} - ${log.by.slice(0, log.by.indexOf('@'))} - ${this.$tToString(log.at, true)}${log.note ? ` - ${log.note}` : ''}`,
      }))
      this.menuCellCheckChangeModel = [
        { label: `Old: ${_change.old}`, icon: 'pi pi-minus-circle' },
        { label: `New: ${_change.new}`, icon: 'pi pi-check-circle' },
        { label: `Logs`, icon: 'pi pi-list', items: _logs },
        { separator: true },
        {
          label: 'Check',
          icon: 'pi pi-thumbs-up',
          command: () => this.$store.commit('user/Worker', { name: 'changeCheck', payload: { _id, field, year: this.year, path: `order.film` } }),
        },
      ]
      this.menuModel = this.menuCellCheckChangeModel
      this.$refs.cm.show(e)
    },
    onRowClick({ originalEvent, data, index }) {
      const {
        target: { classList, parentElement },
      } = originalEvent
      if (!classList.contains('p-checkbox-box') && !parentElement.classList.contains('p-checkbox-box')) {
        this.rowClickData = { data, index }
        this.menuModelNormal[0].label = 'Title: '.concat(data._id)
        this.menuModel = data.dropped || !this.ui[data._id] || !this.ui[data._id].new ? this.menuRowCheckModel : this.menuModelNormal
        this.$refs.cm.show(originalEvent)
      }
    },
    addProd() {
      this.$emit('open-dialog', 'newProdForm', 'Create', 'Add new Product', this.rowClickData.data)
    },
    edit(_id) {
      console.log(_id)
    },
    allRowCheck(type) {
      this.$store.commit('user/Worker', { name: 'allRowCheck', payload: { type, year: this.year, db: 'order', col: 'film', list: this.list } })
    },
    allChangedCheck() {
      this.$store.dispatch('order/film/allChangedCheck')
    },
    deleteThis() {
      this.tempSelected = [this.rowClickData.data]
      this.confirmDel()
    },
    load() {
      this.$store.commit('load', { type: 'array_of__id', from: 'order.film.selected', dotPath: 'prod.film', key: 'table', prop: '_id' })
    },
    closeMessage(idx) {
      this.$store.commit('order/film/spliceMess', idx)
    },
    onToggleEnlarge() {
      this.$emit('toggle-enlarge')
    },
    create() {
      this.$emit('open-dialog', 'newOrderForm', 'Create', 'Add new film')
    },
    creates() {
      this.$emit('open-dialog', 'newOrdersForm', 'Create', 'Add some new films', null, '1200px', true)
    },
    confirmDel() {
      this.$emit('open-dialog', 'deleteConfirm', this.selected.length > 1 ? 'Delete All' : 'Delete', 'Confirm Delete - This action is undone')
    },
    onRowSelect(e) {
      console.log('onRowSelect: ', e)
    },
    onRowUnselect(e) {
      console.log('onRowUnSelect: ', e)
    },
    onRowUnselectAll(e) {
      console.log('onRowSelectAll: ', e)
    },
    rowClass(data) {
      return data.dropped ? (this.ui[data._id] && this.ui[data._id].dropped ? 'r-hide' : 'r-deleted') : this.ui[data._id] && this.ui[data._id].new ? '' : 'r-new'
    },
    btnIcon(name, icon) {
      return this.icon.header[name] ? 'pi pi-spin pi-spinner' : 'pi ' + icon
    },
    cellIcon(_id, field) {
      const icon = this.icon.cell[_id] && this.icon.cell[_id][field] ? this.icon.cell[_id][field] : ''
      console.log('icon', icon)
      return icon
    },
    cellBtnVisible(_id, field) {
      return this.ui[_id] && this.ui[_id].new && typeof this.ui[_id].changes[field] === 'object'
    },
  },
  watch: {
    tempSelected(v) {
      this.selected = v
    },
  },
  computed: {
    icon() {
      return this.$store.state.order.film.icon
    },
    year() {
      return this.$store.state.year
    },
    ui() {
      return this.$store.getters.ui('order', 'film')
    },
    // tableList() {
    //   return this.$store.getters['order/film/tableList']
    // },
    loadBtnProp() {
      let prop = { label: 'Load', icon: 'pi pi-download', disabled: false }
      if (!this.selected.length && !this.prodList.length) prop = { label: 'No Select', icon: 'pi pi-download', disabled: true }
      else if (this.selected.length && !this.sectedOrdersHasProd) prop = { label: 'No Prod', icon: 'pi pi-ban', disabled: true }
      else if (!this.selected.length && this.prodList.length) prop = { label: 'Clear', icon: 'pi pi-upload', disabled: false }
      if (!this.enlarge) prop.label = ''
      return prop
    },
    selected: {
      get() {
        return this.$store.state.order.film.selected
      },
      set(values) {
        this.$store.commit('order/film/setState', { key: 'selected', data: values.filter(v => !v.dropped && this.ui[v._id].new) })
        this.sectedOrdersHasProd = values.some(v => v.products.length > 0)
      },
    },
    hasNewOrder() {
      return this.list.some(o => !this.ui[o._id] || !this.ui[o._id].new)
    },
    hasDroppedOrder() {
      return this.list.some(o => o.dropped && !this.ui[o._id] && !this.ui[o._id].dropped)
    },
    hasOrderChanged() {
      return this.list.some(({ _id }) => this.ui[_id] && this.$isObjEmpty(this.ui[_id].changes) === false && Object.values(this.ui[_id].changes).some(ch => typeof ch === 'object'))
    },
    messages: {
      get() {
        return this.$store.state.order.film.messages
      },
      set(value) {
        this.$store.commit('order/film/pushMess', value)
      },
    },
    ...mapState({
      list: state => state.order.film.list,
      loading: state => state.order.film.loading,
      prodList: state => state.prod.film.list,
      seq: state => state.order.film.seq,
    }),
  },
  created: function() {},
  mounted: function() {
    this.$nextTick(() => {
      // if (this.seq) this.$store.dispatch('order/film/sync')
      // else this.$store.dispatch('order/film/getAll')
      this.$socket.$subscribe('error', payload => {
        console.log(payload)
        this.socketError = payload
      })
    })
  },
}
</script>

<style scoped></style>
