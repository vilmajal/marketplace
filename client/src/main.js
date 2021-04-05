import Vue from 'vue';
import io from 'socket.io-client';
import VueSocketIOExt from 'vue-socket.io-extended';
import { BootstrapVue } from 'bootstrap-vue';
import App from './App.vue';
import router from './router';
import store from './store';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/src/jquery';
import 'bootstrap/dist/js/bootstrap.min';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
const socket = io('https://localhost:8081');
Vue.use(VueSocketIOExt, socket);

(async () => {
  const { authenticated } = await fetch('/api/checkAuth')
    .then((resp) => resp.json())
    .catch(console.error);
  store.commit('authentication', authenticated);

  new Vue({
    store,
    router,
    render: (h) => h(App),
    data: {
      socket: io().connect(),
    },
  }).$mount('#app');
})();
