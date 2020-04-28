<template>
  <div>
    <NewDataTable :value="list" :selection.sync="selected" :filters="filters" :loading="loading" :rowClass="rowClass" @row-click="onRowClick">
      <!-------------------- < Header > --------------------->
      <template #header>
        <div class="table-header-container">
          <div style="text-align: left">
            <!-------------------- < Button Insert > --------------------->
            <Button :label="enlarge ? 'Insert' : ''" icon="pi pi-plus" @click="create('newOrderForm')" class="margin-right" v-tooltip.top="'Insert'" />
            <!-------------------- < Button Insert Multi > --------------------->
            <Button :label="enlarge ? 'Insert multi' : ''" icon="pi pi-bars" @click="creates('newOrderForm')" class="margin-right" v-tooltip.top="'Insert multi'" />
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
              @click="load(null, 'products', 'prod.film')"
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
      <NewColumn field="foreignTitle" :header="enlarge ? 'Foreign Title' : 'Title'" :headerStyle="enlarge ? 'width: 250px' : ''">
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
      <NewColumn v-if="enlarge" field="premiereDate" header="NKC" headerStyle="width: 120px">
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
          <span v-else> {{ $tToString(data[field]) }} </span>
        </template>
      </NewColumn>
      <!-------------------- < Column: Status > --------------------->
      <NewColumn v-if="enlarge" field="status" header="Status" filterMatchMode="in" headerStyle="width: 120px">
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
      <NewColumn field="products" header="Products" :headerStyle="enlarge ? 'width: 300px' : ''">
        <template #filter>
          <InputText type="text" v-model="filters['products']" class="p-column-filter" />
        </template>
        <template #body="{ data: { _id, logs }, data, column: { field } }">
          <div class="child-cell">
            <div v-for="(child_name, i) in data[field]" :key="i">
              <Button
                v-if="childBtnVisible(_id, child_name, 'prod.film')"
                v-tooltip.top="childQuickLog(logs, child_name)"
                :icon="childIcon(_id, child_name, 'prod.film')"
                :label="child_name"
                @click="childCheck($event, _id, child_name, data[field], field)"
              />
              <span v-else> {{ childText(child_name, i, data[field].length) }} </span>
            </div>
          </div>
        </template>
      </NewColumn>
      <!-------------------- < Column: Create At > --------------------->
      <NewColumn v-if="enlarge" field="createdAt" header="Create" headerStyle="width: 120px">
        <template #filter>
          <InputText type="text" v-model="filters['createdAt']" class="p-column-filter" />
        </template>
        <template #body="{ data, column: { field } }">
          <span> {{ $tToString(data[field]) }} </span>
        </template>
      </NewColumn>
      <!-------------------- < Column: End At > --------------------->
      <NewColumn v-if="enlarge" field="endAt" header="End" headerStyle="width: 120px">
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
          <span v-else> {{ $tToString(data[field]) }} </span>
        </template>
      </NewColumn>
      <!-------------------- < Column: Finish At > --------------------->
      <NewColumn v-if="enlarge" field="finishAt" header="Finish" headerStyle="width: 120px">
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
          <span v-else> {{ $tToString(data[field]) }} </span>
        </template>
      </NewColumn>
      <!-------------------- < Column: Vietnamese Title > --------------------->
      <NewColumn v-if="enlarge" field="vietnameseTitle" header="Vietnamese Title" headerStyle="width: 250px" bodyStyle="text-align: left">
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
      <!-------------------- < Column: Processes > --------------------->
      <NewColumn v-if="enlarge" field="processes" header="Processes" bodyStyle="text-align: left" headerStyle="width: 400px">
        <template #filter>
          <InputText type="text" v-model="filters['processes']" class="p-column-filter" />
        </template>
        <template #body="{ data: { _id, logs }, data, column: { field } }">
          <div class="child-cell">
            <div v-for="(child_name, i) in data[field]" :key="i">
              <Button
                v-if="childBtnVisible(_id, child_name, 'operation.plan')"
                v-tooltip.top="childQuickLog(logs, child_name)"
                :icon="childIcon(_id, child_name, 'operation.plan')"
                :label="child_name"
                @click="childCheck($event, _id, child_name, data[field], field)"
              />
              <span v-else> {{ childText(child_name, i, data[field].length) }} </span>
            </div>
          </div>
        </template>
      </NewColumn>
      <!-------------------- < Footer > --------------------->
      <template v-if="messages.length" #footer>
        <NewMessage v-for="({ text, severity }, i) in messages" :key="i" @close-message="closeMessage" :index="i" :severity="severity">{{ text }}</NewMessage>
      </template>
      <template #empty><div class="text-center">No records found.</div></template>
    </NewDataTable>
    <ContextMenu :model="menuModel" ref="cm" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import columnMixin from '../../../mixin/column-mixin'

export default {
  name: 'OrderFilmColumn',
  components: {},
  mixins: [columnMixin],
  props: ['_enlarge'],
  data() {
    return {
      sectedOrdersHasProd: false,
      socketError: 'Disconnected',
    }
  },
  methods: {
    onRowClick({ originalEvent, data, index }) {
      const {
        target: {
          classList,
          parentElement: { classList: pClassList },
        },
      } = originalEvent
      if (!classList.contains('p-checkbox-box') && !pClassList.contains('p-checkbox-box')) {
        this.rowClickData = { data, index }
        if (data.dropped || !this.ui[data._id] || !this.ui[data._id].new) this.menuModel = [{ label: 'Check', icon: 'pi pi-thumbs-up', command: () => this.rowCheck() }]
        else {
          this.menuModelNormal[0].label = 'Title: '.concat(data._id)
          this.menuModel = this.menuModelNormal
        }
        this.$refs.cm.show(originalEvent)
      }
    },
    add(comp) {
      this.$emit('open-dialog', comp, 'Add', 'Add new Product', this.rowClickData.data)
    },
    // load(child_ids) {
    //   child_ids = child_ids && child_ids.length ? child_ids.filter(child_id => this.prodList.every(p => p._id !== child_id)) : []
    //   const _ids = this.selected.flatMap(item => item.products.map(name => item._id.concat(':').concat(name.to_id()))).concat(child_ids)
    //   const queryObj = { _id: { $in: _ids } }
    //   this.$store.commit('prod/film/Worker', { name: 'query', payload: { queryObj } })
    //   this.$store.commit('user/Worker', { name: 'query', payload: { year: this.year, path: 'prod.film', query: queryObj } })
    //   if (this.enlarge && this.selected.length) this.enlarge = false
    // },
    onRowSelect(e) {
      console.log('onRowSelect: ', e)
    },
    onRowUnselect(e) {
      console.log('onRowUnSelect: ', e)
    },
    onRowUnselectAll(e) {
      console.log('onRowSelectAll: ', e)
    },
  },
  watch: {
    products(v) {
      this.selected = this.list.filter(item => v.some(p => p.parent._id === item._id))
    },
  },
  computed: {
    products() {
      return this.$store.state.prod.film.list
    },
    processes() {
      return this.$store.state.operation.plan.list
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
        return this.state.selected
      },
      set(values) {
        this.$store.commit('order/film/setState', { key: 'selected', data: values })
        this.sectedOrdersHasProd = values.some(v => v.products.length > 0)
      },
    },
    hasProdList() {
      return this.products.length > 0
    },
    ...mapState({
      state: state => state.order.film,
    }),
  },
  created: function() {
    this.dot_path = 'order.film'
    this.slash_path = 'order/film'
    const unwatch = this.$watch('list.length', function(nv) {
      if (nv) {
        if (this.hasProdList) {
          this.selected = this.list.filter(item => this.products.some(p => p.parent._id === item._id))
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
