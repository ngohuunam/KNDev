<template>
  <div>
    <DataTable
      :value="list"
      dataKey="_id"
      :selection.sync="selected"
      :filters="filters"
      rowHover
      :loading="loading"
      loadingIcon=""
      @row-select="onRowSelect"
      @row-unselect="onRowUnselect"
      @row-unselect-all="onRowUnselectAll"
      :rowClass="rowClass"
      @row-click="onRowClick"
      paginator
      :rows="10"
      paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
      :rowsPerPageOptions="[10, 25, 50]"
      currentPageReportTemplate="{first}-{last}/{totalRecords}"
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
              @click="load([])"
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
      <!-- <NewColumn headerStyle="width: 2.6em; text-align: center" bodyStyle="text-align: center; overflow: visible; padding: 4px 0">
        <template #body="slotProps">
          <Button type="button" :icon="slotProps.data.ui ? 'pi pi-plus' : 'pi pi-thumbs-up'" @click="rowMenu(slotProps.data)"></Button>
        </template>
      </NewColumn> -->
      <!-------------------- < Column: Edit Order > --------------------->
      <!-- <NewColumn headerStyle="width: 2.6em; text-align: center" bodyStyle="text-align: center; overflow: visible; padding: 4px 0">
        <template #body="slotProps">
          <Button type="button" icon="pi pi-pencil" @click="edit(slotProps.data._id)"></Button>
        </template>
      </NewColumn> -->
      <!-------------------- < Column: Selection > --------------------->
      <Column selectionMode="multiple" bodyStyle="padding: 0" headerStyle="width: 2.5em" />
      <!-------------------- < Column: Foreign Title > --------------------->
      <NewColumn field="foreignTitle" :header="enlarge ? 'Foreign Title' : 'Title'" :headerStyle="enlarge ? 'width: 18%' : ''">
        <template #filter>
          <InputText type="text" v-model="filters['foreignTitle']" class="p-column-filter" />
        </template>
        <template #body="{ data: { _id, foreignTitle, dropped } }">
          <div style="text-align: left; position: relative">
            <span v-if="icon.row[_id] || rowError(_id, dropped)" class="icon-loading">
              <i v-if="icon.row[_id]" :class="`${icon.row[_id]}`" />
              <i v-if="rowError(_id, dropped)" class="pi pi-info color-red" />
            </span>
            <span> {{ foreignTitle }} </span>
          </div>
        </template>
      </NewColumn>
      <!-------------------- < Column: NKC > --------------------->
      <NewColumn v-if="enlarge" field="premiereDate" header="NKC">
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
      </NewColumn>
      <!-------------------- < Column: Status > --------------------->
      <NewColumn v-if="enlarge" field="status" header="Status" filterMatchMode="in">
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
      </NewColumn>
      <!-------------------- < Column: Product Names > --------------------->
      <NewColumn field="products" header="Products">
        <template #filter>
          <InputText type="text" v-model="filters['products']" class="p-column-filter" />
        </template>
        <template #body="{ data: { _id, logs }, data, column: { field } }">
          <div class="child-cell">
            <div v-for="(child_name, i) in data[field]" :key="i">
              <Button
                v-if="childBtnVisible(_id, child_name)"
                v-tooltip.top="childQuickLog(logs, child_name)"
                :icon="childIcon(_id, child_name)"
                :label="child_name"
                @click="childCheck($event, _id, child_name, data[field])"
              />
              <span v-else> {{ childText(child_name, i, data[field].length) }} </span>
            </div>
          </div>
        </template>
      </NewColumn>
      <!-------------------- < Column: Create At > --------------------->
      <NewColumn v-if="enlarge" field="createdAt" header="Create" headerStyle="width: 10%">
        <template #filter>
          <InputText type="text" v-model="filters['createdAt']" class="p-column-filter" />
        </template>
        <template #body="{ data, column: { field } }">
          <span> {{ $tToString(data[field], true, '') }} </span>
        </template>
      </NewColumn>
      <!-------------------- < Column: End At > --------------------->
      <NewColumn v-if="enlarge" field="endAt" header="End" headerStyle="width: 10%">
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
      </NewColumn>
      <!-------------------- < Column: Finish At > --------------------->
      <NewColumn v-if="enlarge" field="finishAt" header="Finish" headerStyle="width: 10%">
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
      </NewColumn>
      <!-------------------- < Column: Vietnamese Title > --------------------->
      <NewColumn v-if="enlarge" field="vietnameseTitle" header="Vietnamese Title" headerStyle="width: 18%" bodyStyle="text-align: left">
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
      </NewColumn>
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
        { label: 'Add product', icon: 'pi pi-fw pi-upload', command: () => this.add() },
        { label: 'View', icon: 'pi pi-fw pi-search', command: () => this.edit() },
        { label: 'Delete', icon: 'pi pi-fw pi-times', command: () => this.delete() },
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
      const payload = { type: 'new', year: this.year, path: 'order.film', _id: this.rowClickData.data._id }
      if (this.rowClickData.data.dropped) payload.type = 'dropped'
      this.$store.commit('user/Worker', { name: 'rowCheck', payload })
    },
    childBtnVisible(_id, child_name) {
      const child_id = _id.concat(':').concat(child_name.to_id())
      const ui = this.$store.getters.ui('prod.film')
      const ui_id = ui[child_id]
      return !ui_id || !ui_id.new
    },
    childIcon(_id, child_name) {
      const child_id = _id.concat(':').concat(child_name.to_id())
      const icon = this.$store.getters.icon('prod.film')
      return icon.row[child_id]
    },
    childText(child_name, i, len) {
      return child_name + (i < len - 1 ? ', ' : '')
    },
    childQuickLog(logs, child_name) {
      const log = logs.find(_log => _log.type === 'Add' && _log.update?.$unshift?.products === child_name)
      return log ? `${log.by.slice(0, log.by.indexOf('@'))} - ${this.$tToString(log.at, true)}` : 'Error'
    },
    childCheck(e, _id, child_name, products) {
      console.log(products)
      const child_id = _id.concat(':').concat(child_name.to_id())
      const visible = this.prodList.every(p => p._id !== child_id)
      this.menuModel = [
        {
          label: 'Load',
          icon: 'pi pi-download',
          command: () => this.load([child_id]),
          visible,
        },
        {
          label: 'Check',
          icon: 'pi pi-thumbs-up',
          command: () => {
            this.$store.commit('user/Worker', { name: 'rowCheck', payload: { type: 'new', year: this.year, path: 'prod.film', _id: child_id } })
            const remains = products.filter(name => name !== child_name)
            const allChecked = remains.every(name => !this.childBtnVisible(_id, name))
            console.log('allChecked', allChecked)
            if (allChecked) this.$store.commit('user/Worker', { name: 'changeCheck', payload: { _id, field: 'products', year: this.year, path: 'order.film' } })
          },
        },
      ]
      this.$refs.cm.show(e)
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
          command: () => this.$store.commit('user/Worker', { name: 'changeCheck', payload: { _id, field, year: this.year, path: 'order.film' } }),
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
    add() {
      this.$emit('open-dialog', 'newProdForm', 'Add', 'Add new Product', this.rowClickData.data)
    },
    edit() {
      console.log(this.rowClickData)
    },
    allRowCheck(type) {
      this.$store.commit('user/Worker', { name: 'allRowCheck', payload: { type, year: this.year, path: 'order.film', list: this.list } })
    },
    allChangedCheck() {
      this.$store.commit('user/Worker', { name: 'allChangeCheck', payload: { year: this.year, path: 'order.film' } })
    },
    delete() {
      this.selected = [this.rowClickData.data]
      this.confirmDel()
    },
    load(child_ids) {
      child_ids = child_ids && child_ids.length ? child_ids.filter(child_id => this.prodList.every(p => p._id !== child_id)) : []
      const _ids = this.selected.flatMap(item => item.products.map(name => item._id.concat(':').concat(name.to_id()))).concat(child_ids)
      const queryObj = { _id: { $in: _ids } }
      this.$store.commit('prod/film/Worker', { name: 'query', payload: { queryObj } })
      this.$store.commit('user/Worker', { name: 'query', payload: { year: this.year, db: 'prod', col: 'film', query: queryObj } })
      if (this.enlarge && this.selected.length) this.enlarge = false
    },
    closeMessage(idx) {
      this.$store.commit('order/film/spliceMess', idx)
    },
    create() {
      this.$emit('open-dialog', 'newOrderForm', 'Insert', 'Add new film')
    },
    creates() {
      this.$emit('open-dialog', 'newOrdersForm', 'Insert', 'Add some new films', null, '1280px', true)
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
      const ui_id = this.ui[_id]
      return dropped ? 'r-deleted' : ui_id && ui_id.new ? '' : 'r-new'
    },
    rowError(_id, dropped) {
      const ui_id = this.ui[_id]
      const err = dropped && ui_id && ui_id.dropped
      return err > 0
    },
    btnIcon(name, icon) {
      return this.icon.header[name] ? 'pi pi-spin pi-spinner' : 'pi ' + icon
    },
    cellIcon(_id, field) {
      const cell_id = this.icon.cell[_id]
      return cell_id && cell_id[field] ? cell_id[field] : ''
    },
    cellBtnVisible(_id, field) {
      const ui_id = this.ui[_id]
      if (!ui_id) return false
      const { dropped, changes } = ui_id
      return ui_id.new && !dropped && typeof changes[field] === 'object'
    },
  },
  watch: {
    prodList(v) {
      this.selected = this.list.filter(item => v.some(p => p.orderId === item._id))
    },
  },
  computed: {
    ui() {
      return this.$store.getters.ui('order.film')
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
  created: function() {
    const unwatch = this.$watch('list.length', function(nv) {
      if (nv) {
        if (this.hasProdList) {
          this.selected = this.list.filter(item => this.prodList.some(p => p.orderId === item._id))
          this.enlarge = false
        }
        unwatch()
      }
    })
  },
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

<style>
body .p-paginator .p-dropdown {
  float: left;
}

body .p-paginator .p-paginator-current {
  float: right;
}
</style>
