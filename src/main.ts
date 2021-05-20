import Vue from 'vue';
import Notifications from 'vue-notification';
import App from './App.vue';
import './assets/scss/style.scss';
import './registerServiceWorker';
import store from './store';
import router from './router';
import VueScrollTo from 'vue-scrollto';
import VueGtag from 'vue-gtag';
import i18n from '@/translations/i18n';
// @ts-ignore
import VueGoogleApi from 'vue-google-api';


Vue.use(VueGoogleApi, {
  apiKey: process.env.VUE_APP_GOOGLE_API_KEY,
  clientId: process.env.VUE_APP_GOOGLE_API_CLIENT_ID,
  scope: 'https://www.googleapis.com/auth/calendar.readonly',
});
Vue.use(VueGtag, {
  config: { id: process.env.VUE_APP_GOOGLE_ANALYTICS_ID },
});
Vue.use(Notifications);
Vue.use(VueScrollTo);
Vue.config.productionTip = false;
Vue.filter('wrapText', (value: string, query: string) => {
  if (!value) {
    return '';
  }
  if (!query || query.length < 2) {
    return value;
  }
  const searchTextRegExp = new RegExp(query, 'i');
  return value.replace(searchTextRegExp, '<span>$&</span>');
});

new Vue({
  store,
  router,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
