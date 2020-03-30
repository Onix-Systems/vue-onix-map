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


Vue.use(VueGtag, {
  config: { id: '' },
  params: {
    send_page_view: false,
  },
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
