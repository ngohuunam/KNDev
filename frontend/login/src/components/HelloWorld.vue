<template>
  <div class="login-page">
    <img alt="Logo" default-src="../assets/logoKN.png" src="../assets/logoKN.png" />
    <div class="form">
      <form name="loginform" class="login-form">
        <input type="email" name="email" placeholder="email" v-model="email" />
        <input type="password" name="password" placeholder="password" v-model="password" autocomplete="on" />
        <button type="submit" @click.prevent="submit">login</button>
        <p>{{ msg }}</p>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {},
  data() {
    return {
      email: 'huunam@kimnamdesign.com',
      password: '123',
      msg: 'Type Email & Password and Login',
    }
  },
  methods: {
    submit() {
      const host = `${window.location.origin}`
      const opt = {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: this.email, password: this.password }),
      }
      this.isLoading = true
      fetch(host, opt)
        .then(res => {
          console.log(res)
          res.json().then(json => {
            console.log(json)
            if (res.status === 200) {
              window.localStorage.setItem('user', JSON.stringify(json))
              this.msg = `${this.email} login success, redirect...`
              const { dept, page, token } = json
              setTimeout(() => (window.location.href = `${host}/${dept}/${page}/${token}`), 500)
            } else this.msg = `Response ${res.status}: ${json}`
          })
        })
        .catch(e => (this.msg = `Fetch Error${e.message}`))
        .finally(() => (this.isLoading = false))
    },
  },
  computed: {
    loading: {
      get() {
        return this.$root.$children[0].isLoading
      },
      set(v) {
        this.$root.$children[0].isLoading = v
      },
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
