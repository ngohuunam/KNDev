<template>
  <div>
    <DataTable :value="selected" dataKey="_id" :selection.sync="willDelete" :rowHover="true">
      <Column selectionMode="multiple" headerStyle="width: 3em"></Column>
      <Column field="foreignTitle" header="Foreign Title"> </Column>
      <Column field="premiereDate" header="NKC">
        <template #body="slotProps">
          <span>{{ $tToString(slotProps.data.premiereDate, false, '', 'numeric') }}</span>
        </template>
      </Column>
    </DataTable>
    <Editor v-model="note" editorStyle="height: 60px" class="margin-top">
      <template slot="toolbar">
        <span class="ql-formats">
          <button class="ql-bold"></button>
          <button class="ql-italic"></button>
          <button class="ql-underline"></button>
        </span>
        <span class="ql-formats">
          <button class="ql-link"></button>
          <button class="ql-image"></button>
          <button class="ql-code-block"></button>
        </span>
        <span class="ql-formats">
          <button class="ql-clean"></button>
        </span>
      </template>
    </Editor>
    <div class="margin-top">
      <FileUpload mode="advanced" name="demo[]" url="./upload" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderFilmDeleteConfirm',
  components: {},
  data: () => ({
    willDelete: [],
    note: '',
  }),
  methods: {
    confirm() {
      // if (this.willDelete.length === this.selected.length) this.$store.dispatch('Order/Film/deleteOrders', this.willDelete)
      if (this.willDelete.length === this.selected.length) this.$store.dispatch('Order/Film/Worker', { name: 'dropOrders', payload: { docs: this.selected, note: this.note } })
      else this.$store.commit('Dialog/setMess', { text: 'Select All to Confirm', severity: 'error' })
    },
  },
  computed: {
    selected() {
      return this.$store.state.Order.Film.selected
    },
  },
  mounted: function() {},
  beforeDestroy: function() {
    this.willDelete = []
  },
}
</script>

<style scoped></style>
