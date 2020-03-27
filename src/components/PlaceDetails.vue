<template lang="pug">
  //- place pop-up
  .place-details(v-if="showDetailsModal" :style="popUpStyles" ref="popupContainer")
    .popup-body(ref="popupBody" :class="[isConfRoom() ? 'conf-room-container' : 'place-container']")
      .popup-header
        img.header-img(v-if="haveImg()" :src="getImg(selectedPlace.img)" alt="")
        .header-text {{getTranslate(selectedPlace.name)}}
        .get-link(@click="copyUrl")
      .btn-booking(v-if="isConfRoom()" @click="toTheCalendar()") {{$t('confRoomMenu.book')}}
      .description(v-if="haveDescription()")
        .info(v-html="getTranslate(selectedPlace.description)")
      button.close(@click="closeDetails")
    .arrow
</template>

<script lang="ts">
import {PlaceInterface} from '@/interfaces/placeInterface';
import {Component, Prop, Mixins} from 'vue-property-decorator';
import CommonMixin from '@/components/mixins/CommonMixin';


@Component({})
export default class PlacesDetails extends Mixins(CommonMixin) {
  @Prop(Boolean) public showDetailsModal!: boolean;
  @Prop(String) public popUpStyles!: boolean;
  @Prop({default: null}) public selectedPlace!: PlaceInterface;
  public closeDetails() {
    this.$router.push(this.$route.path);
    this.$emit('closed');
  }
  private isConfRoom(): boolean {
    return this.selectedPlace.placeType === 'meetroom';
  }
  private haveImg(): boolean {
    return this.selectedPlace.showImg;
  }
  private haveDescription(): boolean {
    return this.selectedPlace.description !== '';
  }
  private getImg(name: string): string {
    return require(`../assets/images/places/icons/${name}`);
  }
  private parseText(text: string) {
    const reg = /\d\. /;
    return text.split(reg).slice(1);
  }
}
</script>

<style lang="scss" scoped>
  .place-details {
    position: fixed;
    overflow: hidden;
    font-family: 'Inter', sans-serif;

    .popup-body {
      padding: 16px;
      background-color: #ffffff;
      border: 1px solid #d2d4cf;
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      position: relative;

      .popup-header {
        display: flex;
        padding-right: 25px;
      }

      //close cross x
      .close {
        position: absolute;
        right: 16px;
        top: 16px;
        border: none;
        background: url("../assets/images/close.svg") no-repeat;
        padding: 6px;
        cursor: pointer;
      }
    }
    //.arrow, centred in the button of the pop-up, look's like V
    .arrow {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: -2px;

      &:after, &:before {
        content: '';
        display: block;
        left: 100%;
        width: 0;
        height: 0;
        border-style: solid;
      }

      &:after {
        margin-left: -21px;
        margin-top: -1px;
        border-color: #ffffff transparent transparent transparent;
        border-width: 10px;
        z-index: 1;
      }

      &:before {
        margin-top: 1px;
        margin-left: 5px;
        border-color: #d2d4cf transparent transparent transparent;
        border-width: 11px;
      }
    }
    .header-text {
      display: flex;
      align-items: center;
      height: 20px;
      font-size: 14px ;
      line-height: 17px;
      font-weight: 600;
      color: #363A42;
    }
    .header-img {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 20px;
      height: 20px;
      margin-right: 10px;
    }
    /deep/ .description {
      flex-basis: 100%;
      .info {
        padding-top: 16px;
        color: #8891A3;
        font-size :  12px;
        line-height: 18px;
      }
      b {
        font-weight: 600;
      }
      ul{
        list-style-position: inside;
        list-style-type: decimal;
        li {
          &:not(:last-child) {
            margin-bottom: 8px;
          }
        }
      }
    }

    .place-container, .conf-room-container {
      flex-wrap: wrap;
      min-height: 35px;
    }
    .conf-room-container {
      width: 286px;
    }
    .place-container {
      width: 235px;
    }
    .btn-booking {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 10px;
      width: fit-content;
      height: 20px;
      padding: 0 10px;
      border: none;
      border-radius: 20px;
      color: #232323;
      background-color: #E5F0FF;
      font-size: 12px;
      &:hover {
        cursor: pointer;
        color: #E5F0FF;
        background-color:#4D9CFF;
      }
      margin-left: 15px;
    }

    .get-link {
      margin-left: 10px;
      &:hover {
        background-color: rgb(210, 229, 255);
      }
    }

    .get-link {
      margin-top: 2px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: url("../assets/images/copy_link.svg") no-repeat center center #E5F0FF;
    }
  }
</style>
