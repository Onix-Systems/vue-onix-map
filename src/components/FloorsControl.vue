<template lang="pug">
  .floors-control(:class="{right: !isLeft}")
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
import {Component, Vue} from 'vue-property-decorator';


@Component({})
export default class FloorsControl extends Vue {
  public floors: number[] = [1, 2, 3, 4, 5, 6, 7, 8];

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
    flex-direction: column-reverse;
    align-items: center;
    justify-content: flex-end;
    top: 57px;
    background-color: #F8FBFF;
    width: 72px;
    height: calc(100vh - 57px);
    font-family: Inter, sans-serif;
    font-style: normal;
    font-weight: 500;
    color: #8891A3;
    @include media_mobile{
      width: 56px;
    }

    &.right {
      right: 0;
    }

    .header {
      order: 1;
      font-size: 12px;
      line-height: 15px;
      padding: 25px 0 17px 0;
    }

    .floor-btn {
      cursor: pointer;
      background-color: inherit;
      border: none;
      font-size: 18px;
      line-height: 22px;
      padding: 17px 31px;
      margin: 8px 0;
      outline: none;
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
      order: -1;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: auto;
      margin-bottom: 40px;
      @media screen and (max-height: 750px){
        display: none;
      }
      @include media_mobile{
        @media screen and (max-height: 640px){
          display: none;
        }
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
  }
</style>
