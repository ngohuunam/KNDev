<template>
  <div id="app">
    <Loading v-show="isLoading" />
    <HelloWorld v-show="!isLoading" />
    <div class="version">V0.202</div>
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
    user: window.localStorage.getItem('user'),
    count: 0,
  }),
  methods: {
    login() {
      if (this.user) {
        const { dept, page, token } = JSON.parse(this.user)
        const url = `${window.location.origin}/${dept}/${page}/${token}`
        console.log('url', url)
        fetch(url, { method: 'get' })
          .then(res => {
            if (res.status === 200) window.location.href = url
            else this.count++
          })
          .catch(e => {
            setTimeout(() => (this.$children[0].msg = `Error: ${e}`), 500)
            this.isLoading = false
          })
      } else this.isLoading = false
    },
  },
  watch: {
    count(value) {
      if (value < 4) setTimeout(() => this.login(), 500)
      else {
        window.localStorage.removeItem('user')
        this.isLoading = false
      }
    },
  },
  created() {},
  mounted() {
    this.login()
  },
}
</script>

<style></style>
