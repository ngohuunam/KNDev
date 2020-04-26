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
  data() {
    return {}
  },
  methods: {
    confirm() {
      const { name, orderId, note } = this.converted
      this.$store.dispatch('order/film/Worker', {
        name: 'add',
        payload: { parent_id: orderId, child: 'products', value: name, note },
      })
      this.$store.dispatch('prod/film/Worker', { name: 'insert', payload: this.converted })
      this.$store.dispatch('operation/plan/Worker', { name: 'insert', payload: this.converted })
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
    this.$store.commit('order/film/setStates', { keys: ['converted', 'loading'], datas: [null, false] })
  },
}
</script>

<style scoped></style>
