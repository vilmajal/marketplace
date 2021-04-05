<template>
  <b-container>
    <b-card header="Logga in" align="center" header-border-variant="dark">
      <b-form v-on:submit.prevent="done()">
        <b-form-input placeholder="Användarnamn" v-model="username" required>
        </b-form-input>

        <b-form-input
          type="password"
          placeholder="Lösenord"
          v-model="password"
          required
        >
        </b-form-input>
        <b-button variant="dark" type="submit">Logga in </b-button>
      </b-form>
    </b-card>
    <b-alert v-model="failed" variant="danger">Session timedout. Try log in again.</b-alert>
  </b-container>
</template>

<script>
const axios = require('axios').default;

export default {
  name: 'Login',
  components: {},
  data: () => ({
    username: '',
    password: '',
    failed: null,
  }),
  created() {
    const { query } = this.$route;
    if (query.sessionKilled === 'true') {
      this.failed = true;
    }
  },
  methods: {
    done() {
      const postData = {
        usern: this.username,
        passw: this.password,
      };

      axios
        .post('/api/login', postData)
        .then((resp) => {
          if (resp.status === 200 && resp.statusText === 'OK') return resp;
          this.$store.commit('authentication', false);
          this.$router.push({
            path: 'login',
          });
          return 'err';
        })
        .then(() => {
          this.$store.commit('authentication', true);
          this.$router.push({
            path: 'profile',
          });
        })
        .catch((err) => {
          console.log('Authentication failed unexpectedly');
          throw err;
        });
      this.username = '';
      this.password = '';
    },
  },
};
</script>
