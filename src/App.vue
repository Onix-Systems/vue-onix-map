<template lang="pug">
  #app
    main-layout
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import MainLayout from '@/components/MainLayout.vue';
import {store} from '@/store';

@Component({
  components: {MainLayout},
})
export default class App extends Vue {
  public created() {
    document.addEventListener('touchstart', function touchhandler(e) {
      store.commit('changeTouchDevice', true);
      document.removeEventListener('touchstart', touchhandler, false);
    }, false);
  }
}
</script>
