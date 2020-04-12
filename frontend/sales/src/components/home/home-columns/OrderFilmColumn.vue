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
    >
      <!-------------------- < Header > --------------------->
      <template #header>
        <div class="table-header-container">
          <div style="text-align: left">
            <Button :label="enlarge ? 'New Order' : ''" icon="pi pi-plus" @click="addNewOrder" class="margin-right" />
            <Button :label="enlarge ? 'Some New Order' : ''" icon="pi pi-bars" @click="addNewOrders" class="margin-right" />
            <Button
              :label="enlarge ? ($socket.connected ? 'Connected' : socketError || 'Disconnected') : ''"
              :icon="'pi ' + ($socket.connected ? 'pi-wifi' : 'pi-ban')"
              :class="'margin-right ' + ($socket.connected ? 'p-button-success' : 'p-button-danger')"
            />
            <Button v-if="selected.length" :label="loadBtnProp.label" :icon="loadBtnProp.icon" @click="loadOrderDetail" :disabled="loadBtnProp.disabled" class="margin-right" />
            <Button v-if="selected.length" :label="enlarge ? 'Delete Orders' : ''" icon="pi pi-minus" @click="confirmDelOrder" class="p-button-danger margin-right" />
            <!-- <ToggleButton v-if="!enlarge" v-model="enlarge" @change="onToggleEnlarge" onIcon="pi pi-angle-left" offIcon="pi pi-angle-right" /> -->
            <InputText v-if="enlarge" v-model="filters['global']" placeholder="Search" style="width: 20%" class="margin-right" />
            <Button v-if="hasOrderChanged" :label="enlarge ? 'Sth Changed' : ''" :icon="btnIcon('allChangedAccept', 'pi-star')" @click="allChangedAccept" class="margin-right" />
            <Button v-if="hasNewOrder" :label="enlarge ? 'New Order' : ''" :icon="btnIcon('allNewOrderCheck', 'pi-file-o')" @click="allNewOrderCheck" class="margin-right" />
            <Button
              v-if="hasDroppedOrder"
              :label="enlarge ? 'Dropped Order' : ''"
              :icon="btnIcon('allDroppedOrderCheck', 'pi-file-o')"
              @click="allDroppedOrderCheck"
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
          <Button type="button" icon="pi pi-pencil" @click="editOrder(slotProps.data._id)"></Button>
        </template>
      </Column> -->
      <!-------------------- < Column: Selection > --------------------->
      <Column selectionMode="multiple" bodyStyle="padding: 0" headerStyle="width: 2.5em" :sortable="true" sortField="selected"></Column>
      <!-------------------- < Column: Foreign Title > --------------------->
      <Column field="foreignTitle" header="Foreign Title" :headerStyle="enlarge ? 'width: 18%' : ''" filterMatchMode="contains" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['foreignTitle']" class="p-column-filter" />
        </template>
        <template #body="slotProps">
          <Button v-if="cellHasChanged(slotProps, 'foreignTitle')" :label="slotProps.data.foreignTitle" @click="changedAccept($event, slotProps.data._id, 'foreignTitle')" />
          <div v-else style="position: relative">
            <span><i v-if="slotProps.data.icon" :class="`pi ${slotProps.data.icon} icon-loading`"></i> {{ slotProps.data.foreignTitle }} </span>
          </div>
        </template>
      </Column>
      <!-------------------- < Column: NKC > --------------------->
      <Column v-if="enlarge" field="premiereDate" header="NKC" filterMatchMode="contains" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['premiereDate']" class="p-column-filter" />
        </template>
        <template #body="slotProps">
          <Button
            v-if="cellHasChanged(slotProps, 'premiereDate')"
            :label="$tToString(slotProps.data.premiereDate, false, '')"
            @click="changedAccept($event, slotProps.data._id, 'premiereDate')"
          />
          <span v-else> {{ $tToString(slotProps.data.premiereDate, false, '') }} </span>
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
            v-if="slotProps.data.ui && slotProps.data.ui.status"
            :icon="slotProps.data.ui.status.checking ? 'pi pi-spin pi-spinner' : ''"
            :label="slotProps.data.status"
            @click="checkChange($event, slotProps)"
          />
          <span v-else> {{ slotProps.data.status }} </span>
        </template>
      </Column>
      <!-------------------- < Column: Products > --------------------->
      <Column v-if="enlarge" field="productNames" header="Products" filterMatchMode="in" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['productNames']" class="p-column-filter" />
        </template>
        <template #body="slotProps">
          <Button v-if="cellHasChanged(slotProps, 'productNames')" :label="slotProps.data.productNames" @click="changedAccept($event, slotProps.data._id, 'productNames')" />
          <span v-else> {{ slotProps.data.productNames }} </span>
        </template>
      </Column>
      <!-------------------- < Column: Create At > --------------------->
      <Column v-if="enlarge" field="createdAt" header="Create" headerStyle="width: 10%" filterMatchMode="contains" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['createdAt']" class="p-column-filter" />
        </template>
        <template #body="slotProps">
          <Button
            v-if="cellHasChanged(slotProps, 'createdAt')"
            :label="$tToString(slotProps.data.createdAt, true, '')"
            @click="changedAccept($event, slotProps.data._id, 'createdAt')"
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
          <Button v-if="cellHasChanged(slotProps, 'endAt')" :label="$tToString(slotProps.data.endAt, true, '')" @click="changedAccept($event, slotProps.data._id, 'endAt')" />
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
            v-if="cellHasChanged(slotProps, 'finishAt')"
            :label="$tToString(slotProps.data.finishAt, true, '')"
            @click="changedAccept($event, slotProps.data._id, 'finishAt')"
          />
          <span v-else> {{ $tToString(slotProps.data.finishAt, true, '') }} </span>
        </template>
      </Column>
      <!-------------------- < Column: Vietnamese Title > --------------------->
      <Column v-if="enlarge" field="vietnameseTitle" header="Vietnamese Title" headerStyle="width: 18%" filterMatchMode="contains" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['vietnameseTitle']" class="p-column-filter" />
        </template>
        <template #body="slotProps">
          <Button
            v-if="cellHasChanged(slotProps, 'vietnameseTitle')"
            :label="slotProps.data.vietnameseTitle"
            @click="changedAccept($event, slotProps.data._id, 'vietnameseTitle')"
          />
          <span v-else> {{ slotProps.data.vietnameseTitle }} </span>
        </template>
      </Column>
      <!-------------------- < Footer > --------------------->
      <template v-if="messages.length" #footer>
        <NewMessage v-for="(message, i) in messages" :key="i" @close-message="closeMessage" :index="i" :severity="message.severity">{{ message.text }}</NewMessage>
      </template>
      <template #empty><div class="text-center">No records found.</div></template>
    </DataTable>
    <!-- <ProgressSpinner v-if="filmOrdersListLoading" /> -->
    <ContextMenu :model="menuModel" ref="cm" />
    <!-- <OverlayPanel ref="op" :showCloseIcon="true" :dismissable="true">
      OK
    </OverlayPanel> -->
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
        { label: 'View', icon: 'pi pi-fw pi-search', command: () => this.editOrder(this.rowClickData) },
        { label: 'Delete', icon: 'pi pi-fw pi-times', command: () => this.deleteThisOrder({ ...this.rowClickData }) },
      ],
      menuNewRowModel: [{ label: 'Check', icon: 'pi pi-thumbs-up', command: () => this.$store.dispatch('Order/Film/newOrderCheck', this.rowClickData) }],
      menuDroppedRowModel: [{ label: 'Check', icon: 'pi pi-thumbs-up', command: () => this.$store.dispatch('Order/Film/droppedOrderCheck', this.rowClickData) }],
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
          command: () => this.$store.dispatch('Order/Film/changeCheck', { _id: slotProps.data._id, key: _field, index: slotProps.index }),
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
        this.menuModelNormal[0].label = data._id
        this.menuModel = data.dropped ? this.menuDroppedRowModel : data.ui ? this.menuModelNormal : this.menuNewRowModel
        this.$refs.cm.show(originalEvent)
        this.rowClickData = { data, index }
      }
    },
    addSimpleProd(order) {
      console.log(order._id)
      this.$emit('open-dialog', 'newProdForm', 'Create', 'Add new Product', order)
    },
    editOrder(_id) {
      console.log(_id)
    },
    allNewOrderCheck() {
      this.$store.dispatch('Order/Film/allNewOrderCheck')
    },
    allDroppedOrderCheck() {
      this.$store.dispatch('Order/Film/allDroppedOrderCheck')
    },
    allChangedAccept() {
      this.$store.commit('Order/Film/allChangedAccept')
    },
    changedAccept(e, _id, key) {
      this.$store.dispatch('Order/Film/changeCheck', { _id: _id, key: key })
    },
    cellHasChanged: () => false,
    addProduct(order) {
      console.log(order)
    },
    deleteThisOrder(order) {
      console.log(order)
    },
    loadOrderDetail() {
      // this.$store.dispatch('Order/Film/getOrderDetail')
      let _prodList = []
      this.selected.map(fo => {
        _prodList = [..._prodList, ...fo.products]
      })
      this.$store.commit('Order/Film/setState', { key: 'prodList', data: _prodList })
    },
    closeMessage(idx) {
      this.$store.commit('Order/Film/spliceMess', idx)
    },
    onToggleEnlarge() {
      this.$emit('toggle-enlarge')
    },
    addNewOrder() {
      this.$emit('open-dialog', 'newOrderForm', 'Create', 'Add new film')
    },
    addNewOrders() {
      this.$emit('open-dialog', 'newOrdersForm', 'Create', 'Add some new films', null, '1200px', true)
    },
    confirmDelOrder() {
      this.$emit('open-dialog', 'deleteConfirm', this.selected.length > 1 ? 'Delete All' : 'Delete', 'Confirm Delete - This action is undone')
    },
    onRowSelect(e) {
      console.log('onRowSelect: ', e)
    },
    onRowUnselect(e) {
      if (this.prodList.length) this.$store.commit('Order/Film/filterSomeByIndexOf', { state: 'prodList', _id: e.data._id })
    },
    onRowUnselectAll() {
      if (this.prodList.length) this.$store.commit('Order/Film/setState', { key: 'prodList', data: [] })
    },
    rowClass(data) {
      return data.dropped ? 'r-deleted' : data.ui ? '' : 'r-new'
    },
    btnIcon(name, icon) {
      return this.$store.state.Order.Film.btnIcon[name] ? 'pi pi-spin pi-spinner' : 'pi ' + icon
    },
  },
  computed: {
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
        return this.$store.state.Order.Film.selected
      },
      set(value) {
        this.$store.commit('Order/Film/setState', { key: 'selected', data: value })
        this.sectedOrdersHasProd = value.some(v => v.products.length > 0)
      },
    },
    hasNewOrder() {
      return this.list.some(o => !o.ui)
    },
    hasDroppedOrder() {
      return this.list.some(o => o.dropped)
    },
    hasOrderChanged() {
      return this.list.some(o => o.ui && this.$isObjEmpty(o.ui) === false)
    },
    messages: {
      get() {
        return this.$store.state.Order.Film.messages
      },
      set(value) {
        this.$store.commit('Order/Film/pushMess', value)
      },
    },
    ...mapState({
      list: state => state.Order.Film.list,
      loading: state => state.Order.Film.loading,
      prodList: state => state.Order.Film.prodList,
      seq: state => state.Order.Film.seq,
    }),
  },
  created: function() {},
  mounted: function() {
    this.$nextTick(() => {
      // if (this.seq) this.$store.dispatch('Order/Film/sync')
      // else this.$store.dispatch('Order/Film/getAll')
      this.$socket.$subscribe('error', payload => {
        console.log(payload)
        this.socketError = payload
      })
    })
  },
}
</script>

<style scoped>
.p-column-filter {
  display: block;
}
.p-column-filter input {
  width: 100%;
}
.text-center {
  width: 100%;
  padding: 0 0 4px 0;
  text-align: center;
  font-size: 20pt;
}
.has-changed {
  font-weight: 700;
  color: #41b783;
}
.margin-right {
  margin-right: 4px;
}
.margin-bot {
  margin-bottom: 4px;
}
.margin-left {
  margin-left: 4px;
}
.margin-top {
  margin-top: 4px;
}
</style>
