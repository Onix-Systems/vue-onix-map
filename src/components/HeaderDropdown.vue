<template lang="pug">
  ul.dropdown-container(v-if="!dummy")
    li.dropdown-item(v-for="(object, index) in data" :key="index" @click.self="selectRoom(object)") {{object.bubble.text}}
      button.btn-booking(@click="toTheCalendar") book
  ul.dropdown-container(v-else)
    li.dropdown-item comming soon
</template>

<script lang="ts">
import {Component, Vue, Prop} from 'vue-property-decorator';

@Component
export default class HeaderDropdown extends Vue {
  @Prop() private data !: object;
  @Prop({default: false}) private dummy !: boolean;
  private selectRoom(room: any) {
    this.$emit('select-data', room);
  }
  private toTheCalendar() {
    window.open('https://calendar.google.com/calendar/r', '_blank');
  }
}
</script>

<style lang="scss" scoped>
  @import "../assets/scss/media";
  .dropdown-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    top: 43px;
    position: absolute;
    width: 310px;
    right: 0; //- temporary solution for non-user header structure
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #E2E6ED;
    box-shadow: 0px 4px 8px rgba(43, 44, 48, 0.1);
    @include media_mobile {
      top: 54px;
    }
    .dropdown-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-left: 16px; // with after: 32px
      width: 100%;
      height: 45px;
      opacity: 0.8;
      margin-bottom: 4px;
      position: relative;
      &:last-child {
        margin-bottom: 0;
      }
    }
    // .dropdown-item:before {
    //   content : "";
    //   position: absolute;
    //   left: 10px;
    //   width: 6px;
    //   height: 6px;
    //   background-color:#cdcbcc;
    //   border-radius: 50%;
    // }
    .dropdown-item:not(:last-child):after { //border-bottom
      content: "";
      position: absolute;
      left: 16px;
      bottom: -2px;
      height: 1px;
      width: 310px - 16px * 2;
      border-bottom: 1px solid#F6F8FC;
    }
    .btn-booking {
      width: 80px;
      height: 20px;
      margin-right: 10px;
      justify-content: flex-end;
      background-color: #EDF5FF;
      border: none;
      border-radius: 20px;
      color: #232323;
      font-size: 12px;
    }

    .btn-booking:focus {
      outline: none;
    }
    .dropdown-item:hover {
      user-select: none;
      background-color:#EBEEF2;
      cursor: pointer;
      .btn-booking {
        background-color:#fff;
        color:#232323;
        outline: none;
      }
      .btn-booking:hover {
        cursor: pointer;
        background-color:#4D9CFF;
        color:#fff;
        outline: none;
      }
      // &:before {
      //   background-color: #fff;
      // }
    }

  }
</style>
