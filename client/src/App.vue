<template>
<div>
  <b-navbar toggleable="lg" type="dark" variant="dark">
    <b-navbar-brand v-on:click="redirect('/ads')">LVL</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item v-on:click="redirect('/ads')">Annonser</b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right>
          <!-- Using 'button-content' slot -->
          <template #button-content>
            <em><b-avatar variant="warning"></b-avatar></em>
          </template>
          <b-dropdown-item v-if="!this.$store.state.authenticated" v-on:click="redirect('/login')">
          Logga in</b-dropdown-item>
          <b-dropdown-item v-if="!this.$store.state.authenticated"
          v-on:click="redirect('/register')"> Registrera dig</b-dropdown-item>
          <b-dropdown-item v-if="this.$store.state.authenticated"
          v-on:click="redirect('/profile')" href="#">Profil</b-dropdown-item>
          <b-dropdown-item v-if="this.$store.state.authenticated" v-on:click="logout()">
            Logga ut</b-dropdown-item>
          <!-- <b-dropdown-item >{{ this.$store.state.authenticated }}</b-dropdown-item> -->
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
  <router-view></router-view>
</div>
</template>

<script>
const axios = require('axios').default;

export default {
  methods: {
    redirect(target) {
      this.$router.push(target);
    },
    logout() {
      axios.post('/api/logout')
        .then((resp) => {
          if (resp.status === 200 && resp.statusText === 'OK') return resp;
          throw new Error('Unexpected failure when logging out');
        })
        .then(() => {
          this.$store.commit('authentication', false);
          this.$router.push({
            path: 'login',
          });
        })
        .catch((err) => {
          console.log('Logout failed unexpectedly');
          throw err;
        });
    },
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

@import'~bootstrap/dist/css/bootstrap.css'
</style>
