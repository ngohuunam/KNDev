<template>
  <div>
    <NewDataTable :value="list" :selection.sync="selected" :filters="filters" :loading="loading" :rowClass="rowClass" @row-click="onRowClick">
      <!-------------------- < Header > --------------------->
      <template #header>
        <div class="table-header-container">
          <div style="text-align: left">
            <!-------------------- < Button Insert > --------------------->
            <Button :label="enlarge ? 'Insert' : ''" icon="pi pi-plus" @click="create" class="margin-right" v-tooltip.top="'Insert'" />
            <!-------------------- < Button Insert Multi > --------------------->
            <Button :label="enlarge ? 'Insert multi' : ''" icon="pi pi-bars" @click="creates" class="margin-right" v-tooltip.top="'Insert multi'" />
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
      <!-------------------- < Column: Selection > --------------------->
      <Column selectionMode="multiple" bodyStyle="padding: 0" headerStyle="width: 2.5em"></Column>
      <!-------------------- < Column: Product's Name > --------------------->
      <NewColumn field="name" :header="enlarge ? 'Product\'s Name' : 'Name'" bodyStyle="text-align: left;">
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
          <!-- <span>{{ slotProps.data.foreignTitle }} </span> -->
        </template>
      </NewColumn>
      <!-------------------- < Column: Film > --------------------->
      <NewColumn v-if="enlarge" field="parent" header="Film" bodyStyle="text-align: left;">
        <template #filter>
          <InputText type="text" v-model="filters['parent']" class="p-column-filter" />
        </template>
        <template #body="{ data: { _id }, data, column: { field } }">
          <Button
            v-if="cellBtnVisible(_id, field)"
            v-tooltip.top="cellQuickLog(_id, field)"
            :icon="cellIcon(_id, field)"
            :label="data[field]._id.replace(/_/g, ' ')"
            @click="checkChange($event, _id, field)"
          />
          <span v-else> {{ data[field]._id.replace(/_/g, ' ') }} </span>
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
      <!-------------------- < Column: Processes > --------------------->
      <NewColumn v-if="enlarge" field="processes" header="Processes" bodyStyle="text-align: left" headerStyle="width: 300px">
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
      <!-------------------- < Column: Plan > --------------------->
      <NewColumn field="plan" header="Plan">
        <template #filter>
          <InputText type="text" v-model="filters['plan']" class="p-column-filter" />
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
      <!-------------------- < Column: Details > --------------------->
      <NewColumn v-if="enlarge" field="details" header="Details">
        <template #filter>
          <InputText type="text" v-model="filters['details']" class="p-column-filter" />
        </template>
        <template #body="{ data: { _id }, data, column: { field } }">
          <Button
            v-if="cellBtnVisible(_id, field)"
            v-tooltip.top="cellQuickLog(_id, field)"
            :icon="cellIcon(_id, field)"
            :label="data[field]"
            @click="checkChange($event, _id, field)"
          />
          <span v-else> {{ data[field].material }} </span>
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
  name: 'ProdFilmColumn',
  props: ['_enlarge'],
  mixins: [columnMixin],
  components: {},
  data() {
    return {
      selectedProdsHasJob: false,
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
        if (data.dropped || !this.ui[data._id] || !this.ui[data._id].new) this.menuModel = [{ label: 'Check', icon: 'pi pi-thumbs-up', command: () => this.rowCheck('products') }]
        else {
          this.menuModelNormal[0].label = data.name.slice(0)
          if (data.processes.length) this.menuModelNormal[3] = { label: 'Add plan', icon: 'pi pi-upload', command: e => this.add(e, 'plan') }
          else
            this.menuModelNormal[3] = {
              label: 'Add Process',
              icon: 'pi pi-upload',
              items: this.$store.state.standards.reduce(
                (pre, { type, db, cols, _id, label, properties }) => [
                  ...pre,
                  ...(type === 'procs' && db === 'prod' && ['film', data.tag].every(tag => cols.includes(tag))
                    ? [{ label, _id, properties, icon: 'pi pi-sort-numeric-down', command: e => this.add(e, 'process') }]
                    : []),
                ],
                [],
              ),
            }

          this.menuModel = this.menuModelNormal
        }
        this.$refs.cm.show(originalEvent)
      }
    },
    add({ item }, type) {
      console.log(item)
      console.log(type)
      if (type === 'process') {
        const { properties: processes } = item
        const parent_id = this.rowClickData.data._id
        const value = processes.map(prop => prop.key)
        this.$store.dispatch('prod/film/Worker', {
          name: 'adds',
          payload: { parent_id, child: 'processes', value, note: '' },
        })
        this.$store.dispatch('operation/plan/inserts', { _id: parent_id, processes })
      }
    },
  },
  watch: {},
  computed: {
    loadBtnProp() {
      let prop = { label: 'Load', icon: 'pi pi-download', disabled: true }
      // if (!this.selected.length && !this.hasJobList) prop = { label: 'No Select', icon: 'pi pi-download', disabled: true }
      // else if (this.selected.length && !this.selectedProdsHasJob) prop = { label: 'No Job', icon: 'pi pi-ban', disabled: true }
      // else if (!this.selected.length && this.hasJobList) prop = { label: 'Clear', icon: 'pi pi-upload', disabled: false }
      // if (!this.enlarge) prop.label = ''
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
    hasProcesses() {
      return this.rowClickData?.data.processes.length > 0
    },
    ...mapState({
      state: state => state.prod.film,
      processes: state => state.operation.plan.list,
    }),
  },
  created: function() {
    this.dot_path = 'prod.film'
    this.parent_path = 'order.film'
    this.slash_path = 'prod/film'
  },
  mounted: function() {},
}
</script>

<style scoped></style>
