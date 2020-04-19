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
      :rowClass="rowClass"
      @row-click="onRowClick"
    >
      <!-------------------- < Header > --------------------->
      <template #header>
        <div class="table-header-container">
          <div style="text-align: left">
            <Button :label="enlarge ? 'New Prod' : ''" icon="pi pi-plus" @click="create" class="margin-right" />
            <Button :label="enlarge ? 'Some New Prod' : ''" icon="pi pi-bars" @click="creates" class="margin-right" />
            <Button v-if="selected.length" :label="loadBtnProp.label" :icon="loadBtnProp.icon" @click="load" :disabled="loadBtnProp.disabled" class="margin-right" />
            <Button v-if="selected.length" :label="enlarge ? 'Delete Prods' : ''" icon="pi pi-minus" @click="confirmDel" class="p-button-danger margin-right" />
            <!-- <ToggleButton v-if="!enlarge" v-model="enlarge" @change="onToggleEnlarge" onIcon="pi pi-angle-left" offIcon="pi pi-angle-right" /> -->
            <InputText v-if="enlarge" v-model="filters['global']" placeholder="Search" style="width: 20%" class="margin-right" />
            <Button v-if="hasChanged" :label="enlarge ? 'Sth Changed' : ''" :icon="btnIcon('allChangedCheck', 'pi-star')" @click="allChangedCheck" class="margin-right" />
            <Button v-if="hasNew" :label="enlarge ? 'New Prod' : ''" :icon="btnIcon('allNewCheck', 'pi-file-o')" @click="allRowCheck('new')" class="margin-right" />
            <Button v-if="hasDropped" :label="enlarge ? 'Dropped Prod' : ''" :icon="btnIcon('allDroppedCheck', 'pi-file-o')" @click="allRowCheck('dropped')" class="margin-right" />
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
      <!-------------------- < Column: Selection > --------------------->
      <Column selectionMode="multiple" bodyStyle="padding: 0" headerStyle="width: 2.5em"></Column>
      <!-------------------- < Column: Name > --------------------->
      <Column field="name" header="Name" :headerStyle="enlarge ? 'width: 18%' : ''" filterMatchMode="contains" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['name']" class="p-column-filter" />
        </template>
        <template #body="{ data: { _id, name, dropped } }">
          <div style="position: relative">
            <span v-if="icon.row[_id] || rowError(_id, dropped)" class="icon-loading">
              <i v-if="icon.row[_id]" :class="`${icon.row[_id]}`" />
              <i v-if="rowError(_id, dropped)" class="pi pi-info color-red" />
            </span>
            <span> {{ name }} </span>
          </div>
        </template>
      </Column>
      <!-------------------- < Column: Order > --------------------->
      <Column v-if="enlarge" field="orderId" header="Film" filterMatchMode="contains" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['orderId']" class="p-column-filter" />
        </template>
      </Column>
      <!-------------------- < Column: Status > --------------------->
      <Column v-if="enlarge" field="status" header="Status" filterMatchMode="contains" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['status']" class="p-column-filter" />
          <!-- <MultiSelect v-model="filters['status']" :options="orders" optionLabel="status" optionValue="status" placeholder="All" class="p-column-filter"></MultiSelect> -->
        </template>
        <template #body="{ data: { _id }, data, column: { field } }">
          <Button v-if="cellBtnVisible(_id, field)" :icon="cellIcon(_id, field)" :label="data[field]" @click="checkChange($event, _id, field)" />
          <span v-else> {{ data[field] }} </span>
        </template>
      </Column>
      <!-------------------- < Column: Job Names > --------------------->
      <Column field="jobNames" header="Job Names" filterMatchMode="contains" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['jobNames']" class="p-column-filter" />
        </template>
        <template #body="{ data: { _id }, data, column: { field } }">
          <Button v-if="cellBtnVisible(_id, field)" :icon="cellIcon(_id, field)" :label="data[field]" @click="checkChange($event, _id, field)" />
          <span v-else> {{ data[field] }} </span>
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
          <Button v-if="cellBtnVisible(_id, field)" :icon="cellIcon(_id, field)" :label="data[field]" @click="checkChange($event, _id, field)" />
          <span v-else> {{ $tToString(data[field], true, '') }} </span>
        </template>
      </Column>
      <!-------------------- < Column: Finish At > --------------------->
      <Column v-if="enlarge" field="finishAt" header="Finish" headerStyle="width: 10%" filterMatchMode="contains" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['finishAt']" class="p-column-filter" />
        </template>
        <template #body="{ data: { _id }, data, column: { field } }">
          <Button v-if="cellBtnVisible(_id, field)" :icon="cellIcon(_id, field)" :label="data[field]" @click="checkChange($event, _id, field)" />
          <span v-else> {{ $tToString(data[field], true, '') }} </span>
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
  name: 'ProdFilmColumn',
  components: {},
  data() {
    return {
      filters: {},
      selectedProdsHasJob: false,
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
      const payload = { type: 'new', year: this.year, db: 'prod', col: 'film', _id: this.rowClickData.data._id }
      if (this.rowClickData.data.dropped) payload.type = 'dropped'
      this.$store.commit('user/Worker', { name: 'rowCheck', payload })
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
          command: () => this.$store.commit('user/Worker', { name: 'changeCheck', payload: { _id, field, year: this.year, path: `prod.film` } }),
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
        this.menuModelNormal[0].label = 'Prod Name: '.concat(data.name)
        this.menuModel = data.dropped || !this.ui[data._id] || !this.ui[data._id].new ? this.menuRowCheckModel : this.menuModelNormal
        this.$refs.cm.show(originalEvent)
      }
    },
    addProd() {
      this.$emit('open-dialog', 'newProdForm', 'Create', 'Add new Product', this.rowClickData.data)
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
      this.tempSelected = [this.rowClickData.data]
      this.confirmDel()
    },
    load() {
      this.$store.commit('load', { type: 'array_of__id', from: 'order.film.selected', dotPath: 'prod.film', key: 'table', prop: '_id' })
    },
    closeMessage(idx) {
      this.$store.commit('prod/film/spliceMess', idx)
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
    tempSelected(v) {
      this.selected = v
    },
  },
  computed: {
    ui() {
      return this.$store.getters['prod/film/ui']
    },
    // tableList() {
    //   return this.$store.getters['prod/film/tableList']
    // },
    loadBtnProp() {
      let prop = { label: 'Load', icon: 'pi pi-download', disabled: false }
      if (!this.selected.length && !this.hasJobList) prop = { label: 'No Select', icon: 'pi pi-download', disabled: true }
      else if (this.selected.length && !this.selectedProdsHasJob) prop = { label: 'No Prod', icon: 'pi pi-ban', disabled: true }
      else if (!this.selected.length && this.hasJobList) prop = { label: 'Clear', icon: 'pi pi-upload', disabled: false }
      if (!this.enlarge) prop.label = ''
      return prop
    },
    selected: {
      get() {
        return this.$store.state.prod.film.selected
      },
      set(values) {
        this.$store.commit('prod/film/setState', { key: 'selected', data: values.filter(v => !v.dropped && this.ui[v._id] && this.ui[v._id].new) })
        this.selectedProdsHasJob = values.some(v => v.jobs.length > 0)
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
    messages: {
      get() {
        return this.$store.state.prod.film.messages
      },
      set(value) {
        this.$store.commit('prod/film/pushMess', value)
      },
    },
    ...mapState({
      list: state => state.prod.film.list,
      loading: state => state.prod.film.loading,
      icon: state => state.prod.film.icon,
      hasJobList: state => state.job.film.list.length > 0,
      // seq: state => state.prod.film.seq,
      year: state => state.year,
    }),
  },
  created: function() {},
  mounted: function() {},
}
</script>

<style scoped></style>
