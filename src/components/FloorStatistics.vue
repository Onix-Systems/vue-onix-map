<template lang="pug">
  .statistics-block(:class="{left: !isSidebarOnLeft}")
    .floor {{ currentFloor }}
      span  FLOOR
    .statistics {{ currentFloorStatistic.all }} people, {{ currentFloorStatistic.free }} free seats
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {store} from '@/store';


  @Component({})
  export default class UserDetails extends Vue {
    get currentFloor(): number {
      return store.state.currentFloor;
    }

    get currentFloorStatistic() {
      return store.state.tablesStatistic[this.currentFloor];
    }

    get isSidebarOnLeft(): boolean {
      return store.state.isSidebarOnLeft;
    }
  }
</script>

<style lang="scss" scoped>
  @import "../assets/scss/media";
  .statistics-block {
    position: absolute;
    top: 82px;
    left: 96px;
    background: #FFFFFF;
    border-radius: 100px;
    padding: 8px 32px;
    @include media_mobile {
      display: none;
    }

    &.left {
      left: 24px;
    }

    .floor {
      font: normal bold 24px Open Sans, sans-serif ;
      line-height: 28px;

      & span {
        font-size: 18px;
      }
    }

    .statistics {
      font: normal 12px Inter, sans-serif ;
      line-height: 15px;
      color: #8891A3;
    }
  }
</style>
