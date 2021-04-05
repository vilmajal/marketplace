<template>
    <b-container>
        <b-card
            header="Registrera dig som ny användare">
        <b-form v-on:submit.prevent="done()">
            <b-form-group
                id="username-input"
                label="Ditt användarnamn">
                <b-form-input
                v-model="username"
                 placeholder="användarnamn"
                required>
                </b-form-input>
            </b-form-group>

        <b-form-group
        id= "id-input-group"
        label="Email address:">
            <b-form-input
                id="email-input"
                v-model="email"
                type="email"
                placeholder="mejl"
                required>
            </b-form-input>
        </b-form-group>

        <b-form-group
            id="password-input-group"
            label="Ditt lösenord">
            <b-form-input
                type="password"
                placeholder="Lösenord"
                v-model="password"
                required>
            </b-form-input>
        </b-form-group>
        <b-form-group
            id="phonenr-input-group"
            label="Ditt telefonnummer">
            <b-form-input
                type="number"
                placeholder="Telefonnummer"
                v-model="tel"
                required>
            </b-form-input>
        </b-form-group>
            <b-button variant="dark" type="submit">Registrera </b-button>
        </b-form>
        </b-card>
    </b-container>
</template>
<script>
const axios = require('axios').default;

export default {
  name: 'Register',
  components: {},
  data: () => ({
    username: '',
    password: '',
    email: '',
    tel: '',
  }),
  methods: {
    done() {
      const postData = {
        usern: this.username,
        passw: this.password,
        mail: this.email,
        nr: this.tel,
      };
      axios.post('/api/register', postData)
        .then((resp) => {
          if (resp.status === 200) return resp;

          this.$store.commit('authentication', false);
          console.log('registrering nekad');
          this.$router.push({
            path: 'register',
          });
          return 'error';
        })
        .then(() => {
          this.$store.commit('authentication', true);
          console.log('registrering godkänd');
          this.$router.push({
            path: 'login',
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
