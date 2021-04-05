import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store';
import AdsViews from '../views/Ads.vue';
import InfoView from '../views/infoView.vue';
import LoginView from '../views/Login.vue';
import ProfileView from '../views/Profile.vue';
import RegisterView from '../views/Register.vue';
import NotFoundView from '../views/NotFound.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/', redirect: '/ads' },
  { path: '/ads', component: AdsViews },
  { path: '/infoView', component: InfoView },
  { path: '/login', component: LoginView },
  {
    path: '/profile',
    component: ProfileView,
    beforeEnter: (to, from, next) => {
      if (store.state.authenticated) {
        next();
      } else {
        console.log('Unauthenticated user - redirect to login.');
        next('/login');
      }
    },
  },
  { path: '/register', component: RegisterView },
  { path: '*', component: NotFoundView },

];

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
});

export default router;
