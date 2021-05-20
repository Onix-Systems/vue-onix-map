import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import {UserStore} from '@/store/modules/user';
import {GeneralStore} from '@/store/modules/general';
import {GoogleStore} from '@/store/modules/google';

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    user: UserStore.ExtractVuexModule(UserStore),
    general: GeneralStore.ExtractVuexModule(GeneralStore),
    googleCalendar: GoogleStore.ExtractVuexModule(GoogleStore),
  },
  strict: process.env.NODE_ENV === 'development',
  plugins: [createPersistedState({paths: ['user']})],
});

export const vxm = {
  user: UserStore.CreateProxy(store, UserStore),
  general: GeneralStore.CreateProxy(store, GeneralStore),
  googleCalendar: GoogleStore.CreateProxy(store, GoogleStore),
};

export default store;
