import {TABLES} from '@/data/tables';
import {TableInterface} from '@/interfaces/tableInterface';
import {UserInterface} from '@/interfaces/userInterface';
import Vue from 'vue';
import Vuex from 'vuex';
import api from '@/api';
import users from '@/data/users.ts';
import createPersistedState from 'vuex-persistedstate';


Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    users: [] as UserInterface[],
    currentFloor: 8,
    tablesStatistic: {} as any,
    isSidebarOnLeft: true,
  },
  mutations: {
    changeFloor(state, floor) {
      state.currentFloor = floor;
    },
    setUserData(state, data) {
      state.users = data;
      const statistic: any = {
        total: {
          all: 0,
          free: 0,
        },
      };
      Object.keys(TABLES).forEach((floor) => {
        statistic[floor] = {};
        statistic[floor].all = (TABLES as any)[floor].length;
        statistic[floor].free = (TABLES as any)[floor]
          .filter((x: TableInterface) => !data.find((y: UserInterface) => x.id === parseInt(y.tableNumber, 10))).length;
        statistic.total.all += statistic[floor].all;
        statistic.total.free += statistic[floor].free;
      });
      state.tablesStatistic = statistic;
    },
    changeSidebarPosition(state, isLeft) {
      state.isSidebarOnLeft = isLeft;
    },
  },
  actions: {
    getUserData(context) {
      return context.commit('setUserData', users);
    },
  },
  modules: {},
  plugins: [createPersistedState()],
});

export default store;
