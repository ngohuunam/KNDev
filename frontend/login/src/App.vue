<template>
  <div id="app">
    <Loading v-if="isLoading" />
    <HelloWorld v-else />
    <div class="version">V.131</div>
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
  data: () => ({
    isLoading: true,
    serverCmd: 'this place for cmd',
    count: 0,
  }),
  methods: {
    handleState() {
      this.$idbGet('info', this.$idbStore)
        .then(info => {
          // const info = this.info
          console.log(info)
          if (info && info.token) {
            const url = `${window.location.origin}/${info.dept}/${info.page}/${info.token}`
            console.log('url', url)
            fetch(url, { method: 'get' }).then(res => {
              if (res.status === 200) {
                window.location.href = url
              } else this.count++
            })
          } else this.isLoading = false
        })
        .catch(e => {
          this.isLoading = false
          setTimeout(() => (this.$children[0].msg = `Error: ${e}`), 500)
        })
    },
  },
  watch: {
    count(value) {
      if (value < 4) setTimeout(() => this.handleState(), 500)
      else {
        this.$idbDel('info', this.$idbStore)
          .then(() => {
            this.isLoading = false
            setTimeout(() => (this.$children[0].msg = 'Expired, re-login'), 500)
          })
          .catch(e => {
            this.isLoading = false
            setTimeout(() => (this.$children[0].msg = `Error: ${e}`), 500)
          })
      }
    },
  },
  created() {},
  mounted() {
    this.handleState()
  },
}
</script>

<style></style>
