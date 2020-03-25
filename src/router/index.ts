import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router(
  {
    mode: 'history',

    routes: [
      {
        path: '',
        name: 'mainPage',
        component: () => import('@/components/MainLayout.vue'),
        beforeEnter: (to, from, next) => {
          if (!localStorage.token) {
            next('/login');
          } else {
            next();
          }
        },
      },

      // {
      //   path: '/login',
      //   name: 'login',
      //   component: () => import('@/components/LoginPage.vue'),
      //   beforeEnter: (to, from, next) => {
      //     if (localStorage.token) {
      //       next('/');
      //     } else {
      //       next();
      //     }
      //   },
      // },
      //
      // {
      //   path: '/callback',
      //   name: 'callback',
      //   component: () => import('@/components/AuthenticationCallback.vue'),
      // },

      {
        path: '*',
        redirect: {name: 'mainPage'},
      },
    ],
  },
);
