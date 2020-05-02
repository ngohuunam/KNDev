export default {
  data() {
    return {
      filters: {},
      rowClickData: null,
      menuModel: [],
      menuModelNormal: [
        { label: ``, icon: 'pi pi-dollar' },
        { separator: true },
        { separator: true },
        { label: 'Add plan', icon: 'pi pi-upload', command: e => this.add(e) },
        { label: 'View', icon: 'pi pi-search', command: () => this.edit() },
        { label: 'Delete', icon: 'pi pi-times', command: () => this.delete() },
      ],
    }
  },
  dot_path: '',
  slash_path: '',
  parent_path: '',
  methods: {
    childBtnVisible(_id, child_name, child_path) {
      const child_id = _id.concat(':').concat(child_name.to_id())
      const ui = this.$store.getters.ui(child_path)
      const ui_id = ui[child_id]
      return !ui_id || !ui_id.new
    },
    childIcon(_id, child_name, child_path) {
      const child_id = _id.concat(':').concat(child_name.to_id())
      const icon = this.$store.getters.icon(child_path)
      return icon?.row?.[child_id] || ''
    },
    childText(child_name, i, len) {
      return child_name + (i < len - 1 ? ', ' : '')
    },
    childQuickLog(logs, child_name) {
      const log = logs.find(_log => _log.type === 'Add' && _log.update?.$unshift?.products === child_name) || logs[0]
      // log = log || logs[0]
      return `${log.by.slice(0, log.by.indexOf('@'))} - ${this.$tToString(log.at, true)}`
    },
    childCheck(e, _id, child_name, childs, field) {
      console.log(field)
      const child_id = _id.concat(':').concat(child_name.to_id())
      const visible = this[field].every(p => p._id !== child_id)
      this.menuModel = [
        {
          label: 'Load',
          icon: 'pi pi-download',
          command: () => this.load([child_id]),
          visible,
        },
        {
          label: 'Edit',
          icon: 'pi pi-pencil',
          command: () => this.editChild(child_id, field),
          visible,
        },
        {
          label: 'Check',
          icon: 'pi pi-thumbs-up',
          command: () => {
            this.$store.commit('user/Worker', { name: 'rowCheck', payload: { type: 'new', year: this.year, path: this.dot_path, _id: child_id } })
            const remains = childs.filter(name => name !== child_name)
            const allChecked = remains.every(name => !this.childBtnVisible(_id, name))
            console.log('allChecked', allChecked)
            if (allChecked) this.$store.commit('user/Worker', { name: 'changeCheck', payload: { _id, field, year: this.year, path: this.dot_path } })
          },
        },
      ]
      this.$refs.cm.show(e)
    },
    reSync() {
      this.$store.dispatch(this.slash_path + '/reSync', this.ui)
    },
    cellQuickLog(_id, field) {
      const _change = this.ui[_id].changes[field]
      const log = _change.logs[0]
      return `${log.by.slice(0, log.by.indexOf('@'))} - ${this.$tToString(log.at, true)}`
    },
    rowCheck(field) {
      const { _id, dropped, parent } = this.rowClickData.data
      const payload = { type: 'new', year: this.year, path: this.dot_path, _id }
      if (dropped) payload.type = 'dropped'
      this.$store.commit('user/Worker', { name: 'rowCheck', payload })
      if (field) this.$store.commit('user/Worker', { name: 'changeCheck', payload: { _id: parent._id, field, year: this.year, path: this.parent_path } })
    },
    checkChange(e, _id, field) {
      console.log('checkChange field:', field)
      const _change = this.ui[_id].changes[field]
      const _logs = _change.logs.map(log => ({
        label: `${log.type}${log.name ? ` - ${log.name}` : ''} - ${log.by.slice(0, log.by.indexOf('@'))} - ${this.$tToString(log.at, true)}${log.note ? ` - ${log.note}` : ''}`,
      }))
      this.menuModel = [
        { label: `Old: ${_change.old}`, icon: 'pi pi-minus-circle' },
        { label: `New: ${_change.new}`, icon: 'pi pi-check-circle' },
        { label: `Logs`, icon: 'pi pi-list', items: _logs },
        { separator: true },
        {
          label: 'Check',
          icon: 'pi pi-thumbs-up',
          command: () => this.$store.commit('user/Worker', { name: 'changeCheck', payload: { _id, field, year: this.year, path: this.dot_path } }),
        },
      ]
      this.$refs.cm.show(e)
    },
    edit() {
      console.log(this.rowClickData)
    },
    editChild(child_id, field) {
      console.log(child_id)
      console.log(field)
    },
    allRowCheck(type) {
      this.$store.commit('user/Worker', { name: 'allRowCheck', payload: { year: this.year, path: this.dot_path, list: this.list, type } })
    },
    allChangedCheck() {
      this.$store.commit('user/Worker', { name: 'allChangeCheck', payload: { year: this.year, path: this.dot_path } })
    },
    delete() {
      this.tempSelected = [this.rowClickData.data]
      this.confirmDel()
    },
    load(child_ids, childKey, child_dot_path) {
      child_ids = child_ids && child_ids.length ? child_ids.filter(child_id => this[childKey].every(p => p._id !== child_id)) : []
      const _ids = this.selected.flatMap(item => item[childKey].map(name => item._id.concat(':').concat(name.to_id()))).concat(child_ids)
      const selector = { _id: { $in: _ids } }
      this.$store.commit(child_dot_path.split('.').join('/') + '/Worker', { name: 'query', payload: { queryObj: { selector } } })
      this.$store.commit('user/Worker', { name: 'query', payload: { year: this.year, path: child_dot_path, selector } })
      if (this.enlarge && this.selected.length) this.enlarge = false
    },
    closeMessage(idx) {
      this.$store.commit(this.slash_path + '/spliceMess', idx)
    },
    create(comp) {
      this.$emit('open-dialog', comp, 'Create', 'Add new')
    },
    creates(comp) {
      this.$emit('open-dialog', comp, 'Create', 'Add some new', null, '1200px', true)
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
  created() {},
  computed: {
    year() {
      return this.$store.state.year
    },
    ui() {
      return this.$store.getters.ui(this.dot_path)
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
      let prop = { label: 'Load', icon: 'pi pi-download', disabled: true }
      // if (!this.selected.length && !this.hasJobList) prop = { label: 'No Select', icon: 'pi pi-download', disabled: true }
      // else if (this.selected.length && !this.selectedProdsHasJob) prop = { label: 'No Job', icon: 'pi pi-ban', disabled: true }
      // else if (!this.selected.length && this.hasJobList) prop = { label: 'Clear', icon: 'pi pi-upload', disabled: false }
      // if (!this.enlarge) prop.label = ''
      return prop
    },
    selected: {
      get() {
        return this.state.selected
      },
      set(values) {
        this.$store.commit(this.slash_path + '/setState', { key: 'selected', data: values.filter(v => !v.dropped && this.ui[v._id] && this.ui[v._id].new) })
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
    icon() {
      return this.state.icon
    },
    loading() {
      return this.state.loading
    },
    list() {
      return this.state.list
    },
    messages: {
      get() {
        return this.state.messages
      },
      set(value) {
        this.$store.commit(this.slash_path + '/pushMess', value)
      },
    },
  },
}
