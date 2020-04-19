<template>
  <div id="app">
    <Loading v-if="isLoading" />
    <HelloWorld v-else />
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import Loading from './components/Loading.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    Loading,
  },
  data: function() {
    return {
      isLoading: true,
      user: window.localStorage.removeItem('user'),
    }
  },
  methods: {
    delLocalInfo() {
      return window.indexedDB.databases().then(infos => {
        console.log('infos: ', infos)
        return Promise.all(
          infos.map(
            info =>
              new Promise((resolve, reject) => {
                const _DBRequest = window.indexedDB.deleteDatabase(info.name)
                _DBRequest.onerror = e => reject(e)
                _DBRequest.onsuccess = r => resolve(r)
              }),
          ),
        )
      })
    },
  },
  watch: {},
  created() {
    this.delLocalInfo()
      .then(() => window.indexedDB.databases().then(infos => console.log('indexedb current: ', infos)))
      .catch(e => {
        console.error(e)
        setTimeout(() => (this.$children[0].msg = `Error: ${e}`), 500)
      })
      .finally(() => (this.isLoading = false))
  },
  mounted() {},
}
</script>

<style></style>
