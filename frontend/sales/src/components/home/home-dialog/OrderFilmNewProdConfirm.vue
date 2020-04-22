<template>
  <DataTable v-if="value.length" :value="value" data-key="_id">
    <Column field="name" header="Field"> </Column>
    <Column field="value" header="Detail"> </Column>
    <template #empty><div class="text-center">No records found.</div></template>
  </DataTable>
</template>

<script>
export default {
  name: 'OrderFilmNewProdConfirm',
  components: {},
  data: () => ({}),
  methods: {
    confirm() {
      this.$store.dispatch('order/film/Worker', {
        name: 'add',
        payload: { parent_id: this.converted.orderId, child: 'products', value: this.converted.name, note: this.converted.note },
      })
      this.$store.dispatch('prod/film/Worker', { name: 'insert', payload: this.converted })
    },
  },
  computed: {
    converted() {
      return this.$store.state.prod.film.converted
    },
    value() {
      return this.$store.getters['prod/film/newProdConfirmTableProperties']
    },
  },
  mounted: function() {},
  beforeDestroy: function() {
    this.$store.commit('prod/film/setState', { key: 'converted', data: null })
  },
}
</script>

<style scoped></style>
