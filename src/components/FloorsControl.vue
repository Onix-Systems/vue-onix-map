<template lang="pug">
  .floors-control(:class="{right: !isLeft, 'show-mobile': isShowMobile}")
    .buttons-block
      .header FLOORS
      button.floor-btn(v-for="floor in floors"
        @click="selectFloor(floor)"
        :disabled="isDisabled(floor)"
        :class="{active: currentFloor === floor}") {{floor}}
    .position-checkbox-block
      .checkbox-block
        label.label(:class="{right: !isLeft}")
          input.checkbox(
            type="checkbox"
            :checked="isLeft"
            @change="changeSidebarPosition($event)"
          )
      .position-label Move to {{isLeft ? 'right' : 'left'}}
</template>

<script lang="ts">
import {store} from '@/store';
import {Component, Prop, Vue} from 'vue-property-decorator';


@Component({})
export default class FloorsControl extends Vue {
  @Prop({type: Boolean, default: false}) public isShowMobile!: boolean;
  public floors: number[] = [8, 7, 6, 5, 4, 3, 2, 1];

  public selectFloor(floor: number) {
    store.commit('changeFloor', floor);
    this.$emit('changed');
  }

  get currentFloor(): number {
    return store.state.currentFloor;
  }

  get isLeft(): boolean {
      return store.state.isSidebarOnLeft;
  }

  public changeSidebarPosition(event: any) {
      this.$store.commit('changeSidebarPosition', event.target.checked);
  }

  public isDisabled(floor: number): boolean {
    return floor === 2 || floor === 3 || floor === 5;
  }
}
</script>

<style lang="scss" scoped>
  @import "../assets/scss/media";
  .floors-control {
    position: absolute;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: center;
    top: 57px;
    background-color: #F8FBFF;
    width: 72px;
    height: calc(100vh - 57px);
    font-family: Inter, sans-serif;
    font-style: normal;
    font-weight: 500;
    color: #8891A3;
    overflow-y: auto;
    overflow-x: hidden;
    @include media_mobile{
      display: none;
      width: 56px;
    }

    &.right {
      right: 0;
    }

    @include media_mobile {
      &.show-mobile {
        display: flex;
      }
    }

    .header {
      font-size: 12px;
      line-height: 15px;
      padding: 25px 0 17px 0;
      @media only screen and (max-height: 640px) {
        display: none;
      }
      @include media_mobile {
        display: none;
      }
    }

    .buttons-block {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }

    .floor-btn {
      cursor: pointer;
      background-color: inherit;
      border: none;
      font-size: 18px;
      line-height: 22px;
      padding: 17px 31px;
      outline: none;
      width: 100%;
      height: 56px;
      transition: background-color 300ms;
      @include media_mobile{
        padding: 9px 23px;
      }

      &.active {
        color: #0072FF;
        background-color: #E5F0FF;
        border-left: #0072FF 4px solid;
        padding-left: 27px;
        @include media_mobile{
          padding-left: 19px;
        }
      }

      &:hover {
        background-color: #E5F0FF;
      }

      &:disabled {
        cursor: not-allowed;
        background-color: inherit;
      }
    }

    .position-checkbox-block {
      width: 100%;
      display: flex;
      flex: 1;
      flex-direction: column;
      align-items: center;
      margin-top: auto;
      margin-bottom: 40px;
      @include media_mobile{
        display: none;
      }
      @media only screen and (max-height: 680px) {
        margin-bottom: 10px;
      }

      .checkbox-block {
        width: 34px;
        height: 14px;
        background: #DCE3ED;
        border-radius: 100px;
        position: relative;

        .label {
          display: block;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ACC0DD;
          position: absolute;
          top: -3px;
          left: 0;
          cursor: pointer;
          transition: left 300ms ease;

          &:before {
            content: "";
            position: absolute;
            background: url("../assets/images/arrow.svg") no-repeat;
            width: 10px;
            height: 10px;
            top: 4px;
            left: 5px;
            transform: rotate(180deg);
          }

          &.right {
            left: 14px;

            &:before {
              top: 6px;
              transform: rotate(0deg);
            }
          }
        }

        .checkbox {
          visibility: hidden;
        }
      }

      .position-label {
        width: 100%;
        font-size: 12px;
        line-height: 15px;
        padding: 8px 16px;
        text-align: center;
      }
    }

    span {
      text-transform: uppercase;
      margin-left: 6px;
      font-size: 21px;
      color: #777271;
    }

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      border-radius: 1000px;
      background: #F8FBFF;
    }

    &::-webkit-scrollbar-thumb {
      color: blue;
      border-radius: 1000px;
      background: #E5E5E5;

      &:hover {
        background: #9EA3AF;
      }
    }
  }
</style>
