import Vue from 'vue';
import Notifications from 'vue-notification';
import App from './App.vue';
import './assets/scss/style.scss';
import './registerServiceWorker';
import store from './store';
import VueScrollTo from 'vue-scrollto';


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
  render: (h) => h(App),
}).$mount('#app');
