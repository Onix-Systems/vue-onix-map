<template lang="pug">
  .statistics-block(:class="{left: !isSidebarOnLeft}")
    .floor {{ currentFloor }}
      span  {{$tc('floor', 1)}}
    .statistics {{$t('people')}} {{ currentFloorStatistic ? currentFloorStatistic.all : 0 }},
      |  {{$t('freeSeats')}}
      |  {{ currentFloorStatistic ? currentFloorStatistic.free : 0 }}
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {vxm} from '@/store';


  @Component({})
  export default class UserDetails extends Vue {
    get currentFloor(): number {
      return vxm.general.currentFloor;
    }

    get currentFloorStatistic() {
      return vxm.general.tablesStatistic[this.currentFloor];
    }

    get isSidebarOnLeft(): boolean {
      return vxm.general.isSidebarOnLeft;
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
        text-transform: uppercase;
      }
    }

    .statistics {
      font: normal 12px Inter, sans-serif ;
      line-height: 15px;
      color: #8891A3;
    }
  }
</style>
