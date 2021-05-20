import Vue from 'vue';
import VueRouter, {Route} from 'vue-router';
import {VueGtag} from 'vue-gtag';

declare module '*.vue' {
  export default Vue;
}

declare module 'vue/types/vue' {
  interface Vue {
    $router: VueRouter;
    $route: Route;
    $gtag: VueGtag;
    $gapi: any;
  }
}
