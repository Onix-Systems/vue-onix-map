<template lang="pug">
  #app
    router-view
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {vxm} from '@/store';

@Component({})
export default class App extends Vue {
  public created() {
    document.addEventListener('touchstart', function touchhandler(e) {
      vxm.user.changeTouchDevice(true);
      document.removeEventListener('touchstart', touchhandler, false);
    }, false);
  }
}
</script>
