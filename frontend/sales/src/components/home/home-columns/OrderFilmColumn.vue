<template>
  <div>
    <DataTable
      :value="list"
      dataKey="_id"
      :selection.sync="selected"
      :filters="filters"
      :rowHover="true"
      :loading="loading"
      loadingIcon=""
      @row-select="onRowSelect"
      @row-unselect="onRowUnselect"
      @row-unselect-all="onRowUnselectAll"
      :rowClass="rowClass"
      @row-click="onRowClick"
      paginator
      :rows="5"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[5, 10, 25, 50]"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
      removableSort
    >
      <!-------------------- < Header > --------------------->
      <template #header>
        <div class="table-header-container">
          <div style="text-align: left">
            <!-------------------- < Button Insert > --------------------->
            <Button :label="enlarge ? 'Insert' : ''" icon="pi pi-plus" @click="create" class="margin-right" v-tooltip.top="'Insert'" />
            <!-------------------- < Button Insert Multi > --------------------->
            <Button :label="enlarge ? 'Insert multi' : ''" icon="pi pi-bars" @click="creates" class="margin-right" v-tooltip.top="'Insert multi'" />
            <!-------------------- < Button Socket > --------------------->
            <Button
              :label="enlarge ? ($socket.connected ? 'Connected' : socketError || 'Disconnected') : ''"
              :icon="'pi ' + ($socket.connected ? 'pi-wifi' : 'pi-ban')"
              :class="'margin-right ' + ($socket.connected ? 'p-button-success' : 'p-button-danger')"
              v-tooltip.top="$socket.connected ? 'Connected' : socketError || 'Disconnected'"
            />
            <!-------------------- < Button Load > --------------------->
            <Button
              :label="loadBtnProp.label"
              :icon="btnIcon('allChangedCheck', loadBtnProp.icon)"
              @click="load"
              :disabled="loadBtnProp.disabled"
              class="margin-right"
              v-tooltip.top="loadBtnProp.tooltip"
            />
            <!-------------------- < Button Delete > --------------------->
            <Button
              v-if="selected.length"
              :label="enlarge ? 'Delete Selected' : ''"
              icon="pi pi-minus"
              @click="confirmDel"
              class="p-button-danger margin-right"
              v-tooltip.top="'Delete Selected'"
            />
            <!-- <ToggleButton v-if="!enlarge" v-model="enlarge" @change="onToggleEnlarge" onIcon="pi pi-angle-left" offIcon="pi pi-angle-right" /> -->
            <InputText v-if="enlarge" v-model="filters['global']" placeholder="Search" style="width: 20%" class="margin-right" />
            <Button
              v-if="hasChanged"
              :label="enlarge ? 'Some properties Changed' : ''"
              :icon="btnIcon('allChangedCheck', 'pi-star')"
              @click="allChangedCheck"
              class="margin-right"
              v-tooltip.top="'Some properties Changed'"
            />
            <Button
              v-if="hasNew"
              :label="enlarge ? 'Some New' : ''"
              :icon="btnIcon('allNewCheck', 'pi-file-o')"
              @click="allRowCheck('new')"
              class="margin-right"
              v-tooltip.top="'Some New'"
            />
            <Button
              v-if="hasDropped"
              :label="enlarge ? 'Some Dropped' : ''"
              :icon="btnIcon('allDroppedCheck', 'pi-file-o')"
              @click="allRowCheck('dropped')"
              class="margin-right"
              v-tooltip.top="'Some Dropped'"
            />
            <Button :label="enlarge ? 'Resync' : ''" :icon="btnIcon('reSync', 'pi-refresh')" @click="reSync" class="margin-right" v-tooltip.top="'Resync'" />
            <ToggleButton
              :onLabel="enlarge ? 'Collapse' : ''"
              offLabel=" "
              v-model="enlarge"
              onIcon="pi pi-angle-left"
              offIcon="pi pi-angle-right"
              v-tooltip.top="'Toggle collapse'"
            />
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
      <Column selectionMode="multiple" bodyStyle="padding: 0" headerStyle="width: 2.5em"></Column>
      <!-------------------- < Column: Foreign Title > --------------------->
      <Column field="foreignTitle" :header="enlarge ? 'Foreign Title' : 'Title'" :headerStyle="enlarge ? 'width: 18%' : ''" filterMatchMode="contains" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['foreignTitle']" class="p-column-filter" />
        </template>
        <template #body="{ data: { _id, foreignTitle, dropped } }">
          <div style="position: relative">
            <span v-if="icon.row[_id] || rowError(_id, dropped)" class="icon-loading">
              <i v-if="icon.row[_id]" :class="`${icon.row[_id]}`" />
              <i v-if="rowError(_id, dropped)" class="pi pi-info color-red" />
            </span>
            <span> {{ foreignTitle }} </span>
          </div>
          <!-- <span>{{ slotProps.data.foreignTitle }} </span> -->
        </template>
      </Column>
      <!-------------------- < Column: NKC > --------------------->
      <Column v-if="enlarge" field="premiereDate" header="NKC" filterMatchMode="contains" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['premiereDate']" class="p-column-filter" />
        </template>
        <template #body="{ data: { _id }, data, column: { field } }">
          <Button
            v-if="cellBtnVisible(_id, field)"
            v-tooltip.top="cellQuickLog(_id, field)"
            :icon="cellIcon(_id, field)"
            :label="data[field]"
            @click="checkChange($event, _id, field)"
          />
          <span v-else> {{ $tToString(data[field], false, '') }} </span>
        </template>
      </Column>
      <!-------------------- < Column: Status > --------------------->
      <Column v-if="enlarge" field="status" header="Status" filterMatchMode="in" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['status']" class="p-column-filter" />
          <!-- <MultiSelect v-model="filters['status']" :options="orders" optionLabel="status" optionValue="status" placeholder="All" class="p-column-filter"></MultiSelect> -->
        </template>
        <template #body="{ data: { _id }, data, column: { field } }">
          <Button
            v-if="cellBtnVisible(_id, field)"
            v-tooltip.top="cellQuickLog(_id, field)"
            :icon="cellIcon(_id, field)"
            :label="data[field]"
            @click="checkChange($event, _id, field)"
          />
          <span v-else> {{ data[field] }} </span>
        </template>
      </Column>
      <!-------------------- < Column: Product Names > --------------------->
      <Column field="products" header="Products" filterMatchMode="in" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['products']" class="p-column-filter" />
        </template>
        <template #body="{ data: { _id }, data, column: { field } }">
          <Button
            v-if="cellBtnVisible(_id, field)"
            v-tooltip.top="cellQuickLog(_id, field)"
            :icon="cellIcon(_id, field)"
            :label="data[field].join(', ')"
            @click="checkChange($event, _id, field)"
          />
          <span v-else> {{ data[field].join(', ') }} </span>
        </template>
      </Column>
      <!-------------------- < Column: Create At > --------------------->
      <Column v-if="enlarge" field="createdAt" header="Create" headerStyle="width: 10%" filterMatchMode="contains" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['createdAt']" class="p-column-filter" />
        </template>
        <template #body="{ data, column: { field } }">
          <span> {{ $tToString(data[field], true, '') }} </span>
        </template>
      </Column>
      <!-------------------- < Column: End At > --------------------->
      <Column v-if="enlarge" field="endAt" header="End" headerStyle="width: 10%" filterMatchMode="contains" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['endAt']" class="p-column-filter" />
        </template>
        <template #body="{ data: { _id }, data, column: { field } }">
          <Button
            v-if="cellBtnVisible(_id, field)"
            v-tooltip.top="cellQuickLog(_id, field)"
            :icon="cellIcon(_id, field)"
            :label="data[field]"
            @click="checkChange($event, _id, field)"
          />
          <span v-else> {{ $tToString(data[field], true, '') }} </span>
        </template>
      </Column>
      <!-------------------- < Column: Finish At > --------------------->
      <Column v-if="enlarge" field="finishAt" header="Finish" headerStyle="width: 10%" filterMatchMode="contains" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['finishAt']" class="p-column-filter" />
        </template>
        <template #body="{ data: { _id }, data, column: { field } }">
          <Button
            v-if="cellBtnVisible(_id, field)"
            v-tooltip.top="cellQuickLog(_id, field)"
            :icon="cellIcon(_id, field)"
            :label="data[field]"
            @click="checkChange($event, _id, field)"
          />
          <span v-else> {{ $tToString(data[field], true, '') }} </span>
        </template>
      </Column>
      <!-------------------- < Column: Vietnamese Title > --------------------->
      <Column v-if="enlarge" field="vietnameseTitle" header="Vietnamese Title" headerStyle="width: 18%" filterMatchMode="contains" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['vietnameseTitle']" class="p-column-filter" />
        </template>
        <template #body="{ data: { _id }, data, column: { field } }">
          <Button
            v-if="cellBtnVisible(_id, field)"
            v-tooltip.top="cellQuickLog(_id, field)"
            :icon="cellIcon(_id, field)"
            :label="data[field]"
            @click="checkChange($event, _id, field)"
          />
          <span v-else> {{ data[field] }} </span>
        </template>
      </Column>
      <!-------------------- < Footer > --------------------->
      <template v-if="messages.length" #footer>
        <NewMessage v-for="({ text, severity }, i) in messages" :key="i" @close-message="closeMessage" :index="i" :severity="severity">{{ text }}</NewMessage>
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
  props: ['_enlarge'],
  data() {
    return {
      filters: {},
      sectedOrdersHasProd: false,
      // enlarge: true,
      socketError: 'Disconnected',
      rowClickData: null,
      menuModel: [],
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
    reSync() {
      this.$store.dispatch('order/film/reSync', this.ui)
    },
    rowCheck() {
      const payload = { type: 'new', year: this.year, db: 'order', col: 'film', _id: this.rowClickData.data._id }
      if (this.rowClickData.data.dropped) payload.type = 'dropped'
      this.$store.commit('user/Worker', { name: 'rowCheck', payload })
    },
    cellQuickLog(_id, field) {
      const _change = this.ui[_id].changes[field]
      const log = _change.logs[0]
      return `${log.by.slice(0, log.by.indexOf('@'))} - ${this.$tToString(log.at, true)}`
    },
    checkChange(e, _id, field) {
      console.log('checkChange field:', field)
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
        target: {
          classList,
          parentElement: { classList: pClassList },
        },
      } = originalEvent
      if (!classList.contains('p-checkbox-box') && !pClassList.contains('p-checkbox-box')) {
        this.rowClickData = { data, index }
        this.menuModelNormal[0].label = 'Title: '.concat(data._id)
        this.menuModel = data.dropped || !this.ui[data._id] || !this.ui[data._id].new ? this.menuRowCheckModel : this.menuModelNormal
        this.$refs.cm.show(originalEvent)
      }
    },
    addProd() {
      this.$emit('open-dialog', 'newProdForm', 'Add', 'Add new Product', this.rowClickData.data)
    },
    edit() {
      console.log(this.rowClickData)
    },
    allRowCheck(type) {
      this.$store.commit('user/Worker', { name: 'allRowCheck', payload: { type, year: this.year, db: 'order', col: 'film', list: this.list } })
    },
    allChangedCheck() {
      this.$store.commit('user/Worker', { name: 'allChangeCheck', payload: { year: this.year, db: 'order', col: 'film' } })
    },
    deleteThis() {
      this.selected = [this.rowClickData.data]
      this.confirmDel()
    },
    load() {
      this.$store.commit('prod/film/Worker', { name: 'load', payload: { orderIds: this.selected.map(item => item._id) } })
      if (this.enlarge) this.enlarge = false
    },
    closeMessage(idx) {
      this.$store.commit('order/film/spliceMess', idx)
    },
    create() {
      this.$emit('open-dialog', 'newOrderForm', 'Insert', 'Add new film')
    },
    creates() {
      this.$emit('open-dialog', 'newOrdersForm', 'Insert', 'Add some new films', null, '1200px', true)
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
    rowClass({ dropped, _id }) {
      // return data.dropped ? (this.ui[data._id] && this.ui[data._id].dropped ? 'r-hide' : 'r-deleted') : this.ui[data._id] && this.ui[data._id].new ? '' : 'r-new'
      return dropped ? 'r-deleted' : this.ui[_id] && this.ui[_id].new ? '' : 'r-new'
    },
    rowError(_id, dropped) {
      const err = dropped && this.ui[_id] && this.ui[_id].dropped
      return err > 0
    },
    btnIcon(name, icon) {
      return this.icon.header[name] ? 'pi pi-spin pi-spinner' : 'pi ' + icon
    },
    cellIcon(_id, field) {
      return this.icon.cell[_id] && this.icon.cell[_id][field] ? this.icon.cell[_id][field] : ''
    },
    cellBtnVisible(_id, field) {
      return this.ui[_id] && this.ui[_id].new && !this.ui[_id].dropped && typeof this.ui[_id].changes[field] === 'object'
    },
  },
  watch: {
    prodList(v) {
      if (v.length > this.selected.length) this.selected = this.list.filter(item => v.some(p => p.orderId === item._id))
    },
  },
  computed: {
    ui() {
      return this.$store.getters['order/film/ui']
    },
    enlarge: {
      get() {
        return this._enlarge
      },
      set(v) {
        this.$emit('toggle-enlarge', v)
      },
    },
    loadBtnProp() {
      let prop = { label: 'Load', tooltip: 'Load', icon: 'pi pi-download', disabled: false }
      if (!this.selected.length && !this.hasProdList) prop = { label: 'No Select', tooltip: 'No Select', icon: 'pi pi-download', disabled: true }
      else if (this.selected.length && !this.sectedOrdersHasProd) prop = { label: 'No Prod', tooltip: 'No Prod', icon: 'pi pi-ban', disabled: true }
      else if (!this.selected.length && this.hasProdList) prop = { label: 'Unload', tooltip: 'Unload', icon: 'pi pi-upload', disabled: false }
      if (!this.enlarge) prop.label = ''
      return prop
    },
    selected: {
      get() {
        return this.$store.state.order.film.selected
      },
      set(values) {
        this.$store.commit('order/film/setState', { key: 'selected', data: values })
        this.sectedOrdersHasProd = values.some(v => v.products.length > 0)
      },
    },
    hasNew() {
      return this.list.some(({ _id }) => !this.ui[_id] || !this.ui[_id].new)
    },
    hasDropped() {
      return this.list.some(o => o.dropped && this.ui[o._id] && !this.ui[o._id].dropped)
    },
    hasChanged() {
      return this.list.some(({ _id }) => this.ui[_id] && this.$isObjEmpty(this.ui[_id].changes) === false && Object.values(this.ui[_id].changes).some(ch => typeof ch === 'object'))
    },
    hasProdList() {
      return this.prodList.length > 0
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
      icon: state => state.order.film.icon,
      prodList: state => state.prod.film.list,
      year: state => state.year,
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
