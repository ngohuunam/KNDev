<template>
  <div>
    <DataTable
      :value="table"
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
    >
      <!-------------------- < Header > --------------------->
      <template #header>
        <div class="table-header-container">
          <div style="text-align: left">
            <Button :label="enlarge ? 'New' : ''" icon="pi pi-plus" @click="addNew" class="margin-right" />
            <Button :label="enlarge ? 'Some New' : ''" icon="pi pi-bars" @click="addNewS" class="margin-right" />
            <Button
              :label="enlarge ? ($socket.connected ? 'Connected' : socketError || 'Disconnected') : ''"
              :icon="'pi ' + ($socket.connected ? 'pi-wifi' : 'pi-ban')"
              :class="'margin-right ' + ($socket.connected ? 'p-button-success' : 'p-button-danger')"
            />
            <Button v-if="selected.length" :label="loadBtnProp.label" :icon="loadBtnProp.icon" @click="load" :disabled="loadBtnProp.disabled" class="margin-right" />
            <Button v-if="selected.length" :label="enlarge ? 'Delete Orders' : ''" icon="pi pi-minus" @click="confirmDel" class="p-button-danger margin-right" />
            <!-- <ToggleButton v-if="!enlarge" v-model="enlarge" @change="onToggleEnlarge" onIcon="pi pi-angle-left" offIcon="pi pi-angle-right" /> -->
            <InputText v-if="enlarge" v-model="filters['global']" placeholder="Search" style="width: 20%" class="margin-right" />
            <Button v-if="hasChanged" :label="enlarge ? 'Sth Changed' : ''" :icon="btnIcon('allChangedCheck', 'pi-star')" @click="allChangedCheck" class="margin-right" />
            <Button v-if="hasNew" :label="enlarge ? 'New' : ''" :icon="btnIcon('allNewCheck', 'pi-file-o')" @click="allNewCheck" class="margin-right" />
            <Button v-if="hasDropped" :label="enlarge ? 'Dropped' : ''" :icon="btnIcon('allDroppedCheck', 'pi-file-o')" @click="allDroppedCheck" class="margin-right" />
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
      <Column selectionMode="multiple" bodyStyle="padding: 0" headerStyle="width: 2.5em" :sortable="true" sortField="selected"></Column>
      <!-------------------- < Column: Name > --------------------->
      <Column field="name" header="Name" :headerStyle="enlarge ? 'width: 18%' : ''" filterMatchMode="contains" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['name']" class="p-column-filter" />
        </template>
        <template #body="slotProps">
          <div style="position: relative">
            <span><i v-if="slotProps.data.icon" :class="`pi ${slotProps.data.icon} icon-loading`"></i> {{ slotProps.data.name }} </span>
          </div>
        </template>
      </Column>
      <!-------------------- < Column: Product Type > --------------------->
      <Column v-if="enlarge" field="type" header="Manufacture Type" headerStyle="width: 18%" filterMatchMode="contains" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['type']" class="p-column-filter" />
        </template>
        <template #body="slotProps">
          <Button
            v-if="slotProps.data.ui && slotProps.data.ui.type"
            :icon="slotProps.data.ui.type.checking ? 'pi pi-spin pi-spinner' : ''"
            :label="slotProps.data.type"
            @click="checkChange($event, slotProps)"
          />
          <span v-else> {{ slotProps.data.type }} </span>
        </template>
      </Column>
      <!-------------------- < Column: Details > --------------------->
      <Column v-if="enlarge" field="details" header="Details" filterMatchMode="contains" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['details']" class="p-column-filter" />
        </template>
        <template #body="slotProps">
          <Button
            v-if="slotProps.data.ui && slotProps.data.ui.details"
            :icon="slotProps.data.ui.details.checking ? 'pi pi-spin pi-spinner' : ''"
            :label="slotProps.data.details"
            @click="checkChange($event, slotProps)"
          />
          <span v-else v-html="slotProps.data.details" />
        </template>
      </Column>
      <!-------------------- < Column: Status > --------------------->
      <Column v-if="enlarge" field="status" header="Status" filterMatchMode="contains" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['status']" class="p-column-filter" />
          <!-- <MultiSelect v-model="filters['status']" :options="orders" optionLabel="status" optionValue="status" placeholder="All" class="p-column-filter"></MultiSelect> -->
        </template>
        <template #body="slotProps">
          <Button
            v-if="slotProps.data.ui && slotProps.data.ui.status"
            :icon="slotProps.data.ui.status.checking ? 'pi pi-spin pi-spinner' : ''"
            :label="slotProps.data.status"
            @click="checkChange($event, slotProps)"
          />
          <span v-else> {{ slotProps.data.status }} </span>
        </template>
      </Column>
      <!-------------------- < Column: Jobs > --------------------->
      <Column field="jobNames" header="Jobs" filterMatchMode="contains" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['jobNames']" class="p-column-filter" />
        </template>
        <template #body="slotProps">
          <Button
            v-if="slotProps.data.ui && slotProps.data.ui.jobNames"
            :icon="slotProps.data.ui.jobNames.checking ? 'pi pi-spin pi-spinner' : ''"
            :label="slotProps.data.jobNames"
            @click="checkChange($event, slotProps)"
          />
          <span v-else> {{ slotProps.data.jobNames }} </span>
        </template>
      </Column>
      <!-------------------- < Column: Create At > --------------------->
      <Column v-if="enlarge" field="createdAt" header="Create" headerStyle="width: 10%" filterMatchMode="contains" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['createdAt']" class="p-column-filter" />
        </template>
        <template #body="slotProps">
          <Button
            v-if="slotProps.data.ui && slotProps.data.ui.createAt"
            :icon="slotProps.data.ui.createAt.checking ? 'pi pi-spin pi-spinner' : ''"
            :label="$tToString(slotProps.data.createAt, true, '')"
            @click="checkChange($event, slotProps)"
          />
          <span v-else> {{ $tToString(slotProps.data.createdAt, true, '') }} </span>
        </template>
      </Column>
      <!-------------------- < Column: End At > --------------------->
      <Column v-if="enlarge" field="endAt" header="End" headerStyle="width: 10%" filterMatchMode="contains" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['endAt']" class="p-column-filter" />
        </template>
        <template #body="slotProps">
          <Button
            v-if="slotProps.data.ui && slotProps.data.ui.endAt"
            :icon="slotProps.data.ui.endAt.checking ? 'pi pi-spin pi-spinner' : ''"
            :label="$tToString(slotProps.data.endAt, true, '')"
            @click="checkChange($event, slotProps)"
          />
          <span v-else> {{ $tToString(slotProps.data.endAt, true, '') }} </span>
        </template>
      </Column>
      <!-------------------- < Column: Finish At > --------------------->
      <Column v-if="enlarge" field="finishAt" header="Finish" headerStyle="width: 10%" filterMatchMode="contains" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['finishAt']" class="p-column-filter" />
        </template>
        <template #body="slotProps">
          <Button
            v-if="slotProps.data.ui && slotProps.data.ui.finishAt"
            :icon="slotProps.data.ui.finishAt.checking ? 'pi pi-spin pi-spinner' : ''"
            :label="$tToString(slotProps.data.finishAt, true, '')"
            @click="checkChange($event, slotProps)"
          />
          <span v-else> {{ $tToString(slotProps.data.finishAt, true, '') }} </span>
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
      menuModel: [],
      menuModelNormal: [
        { label: ``, icon: 'pi pi-dollar' },
        { separator: true },
        { separator: true },
        { label: 'Add product', icon: 'pi pi-fw pi-upload', command: () => this.addJob(this.rowClickData) },
        { label: 'View', icon: 'pi pi-fw pi-search', command: () => this.edit(this.rowClickData) },
        { label: 'Delete', icon: 'pi pi-fw pi-times', command: () => this.deleteThis({ ...this.rowClickData }) },
      ],
      menuNewRowModel: [{ label: 'Check', icon: 'pi pi-thumbs-up', command: () => this.$store.dispatch('Prod/Film/newCheck', this.rowClickData) }],
      menuDroppedRowModel: [{ label: 'Check', icon: 'pi pi-thumbs-up', command: () => this.$store.dispatch('Prod/Film/droppedCheck', this.rowClickData) }],
      menuCellCheckChangeModel: [],
    }
  },
  rowClickData: null,
  methods: {
    checkChange(e, slotProps) {
      console.log('checkChange slotProps:', slotProps)
      const _field = slotProps.column.field
      const _ui = slotProps.data.ui
      const _change = _ui[_field]
      const _logs = _change.logs.map(log => ({ label: `${log.type} - ${log.by} - ${this.$tToString(log.at, false)}${log.note ? ` - ${log.note}` : ''}`, icon: '' }))
      this.menuCellCheckChangeModel = [
        { label: `Old: ${_change.old}`, icon: 'pi pi-minus-circle' },
        { label: `New: ${_change.new}`, icon: 'pi pi-check-circle' },
        { label: `Logs`, icon: 'pi pi-list', items: _logs },
        { separator: true },
        {
          label: 'Check',
          icon: 'pi pi-thumbs-up',
          command: () => this.$store.dispatch('Prod/Film/changeCheck', { _id: slotProps.data._id, key: _field, index: slotProps.index }),
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
        this.menuModelNormal[0].label = 'Title: '.concat(data._id)
        this.menuModel = data.dropped ? this.menuDroppedRowModel : data.ui ? this.menuModelNormal : this.menuNewRowModel
        this.$refs.cm.show(originalEvent)
        this.rowClickData = { data, index }
      }
    },
    addJob({ data, index }) {
      console.log(data._id)
      console.log(index)
      this.$emit('open-dialog', 'newJobForm', 'Create', 'Add new Product', data)
    },
    edit(_id) {
      console.log(_id)
    },
    allNewCheck() {
      this.$store.dispatch('Prod/Film/allNewCheck')
    },
    allDroppedCheck() {
      this.$store.dispatch('Prod/Film/allDroppedCheck')
    },
    allChangedCheck() {
      this.$store.commit('Prod/Film/allChangedCheck')
    },
    deleteThis(order) {
      console.log(order)
    },
    load() {
      // this.$store.dispatch('Prod/Film/getOrderDetail')
      let _prodList = []
      this.selected.map(fo => {
        _prodList = [..._prodList, ...fo.products]
      })
      this.$store.commit('Prod/Film/setState', { key: 'prodList', data: _prodList })
    },
    closeMessage(idx) {
      this.$store.commit('Prod/Film/spliceMess', idx)
    },
    onToggleEnlarge() {
      this.$emit('toggle-enlarge')
    },
    addNew() {
      this.$emit('open-dialog', 'newJobForm', 'Create', 'Add new film')
    },
    addNewS() {
      this.$emit('open-dialog', 'newJobsForm', 'Create', 'Add some new films', null, '1200px', true)
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
      return data.dropped ? 'r-deleted' : data.ui ? '' : 'r-new'
    },
    btnIcon(name, icon) {
      return this.$store.state.Prod.Film.btnIcon[name] ? 'pi pi-spin pi-spinner' : 'pi ' + icon
    },
  },
  computed: {
    table() {
      return this.$store.getters['Prod/Film/tableList']
    },
    loadBtnProp() {
      let prop = { label: 'Load', icon: 'pi pi-download', disabled: false }
      if (!this.selected.length && !this.jobList.length) prop = { label: 'No Select', icon: 'pi pi-download', disabled: true }
      else if (this.selected.length && !this.selectedHasJob) prop = { label: 'No Job', icon: 'pi pi-ban', disabled: true }
      else if (!this.selected.length && this.jobList.length) prop = { label: 'Clear', icon: 'pi pi-upload', disabled: false }
      if (!this.enlarge) prop.label = ''
      return prop
    },
    selected: {
      get() {
        return this.$store.state.Prod.Film.selected
      },
      set(value) {
        this.$store.commit('Prod/Film/setState', { key: 'selected', data: value })
        this.selectedHasJob = value.some(v => v.jobs.length > 0)
      },
    },
    hasNew() {
      return this.table.some(o => !o.ui)
    },
    hasDropped() {
      return this.table.some(o => o.dropped)
    },
    hasChanged() {
      return this.table.some(o => o.ui && this.$isObjEmpty(o.ui) === false)
    },
    messages: {
      get() {
        return this.$store.state.Prod.Film.messages
      },
      set(value) {
        this.$store.commit('Prod/Film/pushMess', value)
      },
    },
    ...mapState({
      loading: state => state.Prod.Film.loading,
      jobList: state => state.Job.Film.list,
    }),
  },
  created: function() {},
  mounted: function() {
    this.$nextTick(() => {
      // if (this.seq) this.$store.dispatch('Prod/Film/sync')
      // else this.$store.dispatch('Prod/Film/getAll')
      this.$socket.$subscribe('error', payload => {
        console.log(payload)
        this.socketError = payload
      })
    })
  },
}
</script>

<style scoped></style>
