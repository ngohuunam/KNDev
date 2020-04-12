<template>
  <div class="login-page">
    <img alt="Logo" default-src="../assets/logoKN.png" src="../assets/logoKN.png" />
    <div class="form">
      <div name="loginform" class="login-form">
        <input type="email" name="email" placeholder="email" v-model="email" />
        <input type="password" name="password" placeholder="password" v-model="password" />
        <button type="submit" @click="submit">login</button>
        <p>{{ msg }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {},
  data: () => ({
    email: 'huunam@kimnamdesign.com',
    password: '123',
    msg: 'Type Email & Password and Login',
  }),
  methods: {
    submit() {
      const host = `${window.location.origin}`
      const opttion = {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: this.email, password: this.password }),
      }
      this.$root.$children[0].isLoading = true
      fetch(host, opttion).then(res => {
        console.log(res)
        res.json().then(async json => {
          console.log(json)
          if (res.status === 200) {
            await this.$idbSet('user', json, this.$idbStore)
            this.msg = `${this.email} login success, wait for redirect`
            setTimeout(() => (window.location.href = `${window.location.origin}/${json.dept}/${json.page}/${json.token}`), 1000)
          } else this.msg = `Response ${res.status}: ${json}`
          this.$root.$children[0].isLoading = false
        })
      })
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
