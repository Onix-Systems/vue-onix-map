<template lang="pug">
  //- place pop-up
  .place-details(v-if="showDetailsModal" :style="popUpStyles" ref="popupContainer")
    .popup-body(ref="popupBody" :class="[isCalendarItem ? 'calendar-container' : 'place-container']")
      .popup-header
        img.header-img(v-if="haveImg()" :src="getImg(selectedPlace.img)" alt="")
        .room-status(
          v-if="isCalendarItem() && isSignInGoogleAccount"
          :class="{unknown: !hasCalendar(selectedPlace), busy: hasCalendar(selectedPlace) && \
            !checkFree(timeNow, timeNow, selectedPlace.calendarId, selectedPlace.placeType)}"
        )
        .header-text {{getTranslate(selectedPlace.name)}}
        .get-link(@click="copyUrl")
      .btn-booking(
        v-if="isCalendarItem() && isSignInGoogleAccount"
        :class="{'warning': (isSignInGoogleAccount \
          && hasCalendar(selectedPlace) && isBusyNow(selectedPlace.calendarId, selectedPlace.placeType))}"
        @click="toTheCalendar(selectedPlace) && isSignInGoogleAccount"
      )
        | {{$t('confRoomMenu.book')}}
      google-signin-btn.google-sign-in(v-else-if="isCalendarItem() && !isSignInGoogleAccount" @click="signIn()")
      .description(v-if="haveDescription()")
        .info(v-html="getTranslate(selectedPlace.description)")
      button.close(@click="closeDetails")
    .arrow
</template>

<script lang="ts">
import {PlaceInterface} from '@/interfaces/placeInterface';
import {Component, Prop, Mixins} from 'vue-property-decorator';
import CommonMixin from '@/components/mixins/CommonMixin';
import ConfRoomMixin from '@/components/mixins/ConfRoomMixin';
import {vxm} from '@/store';
import {PlaceTypeEnum} from '@/enums/PlaceTypeEnum';


@Component({})
export default class PlacesDetails extends Mixins(CommonMixin, ConfRoomMixin) {
  @Prop(Boolean) public showDetailsModal!: boolean;
  @Prop(String) public popUpStyles!: boolean;
  @Prop({default: null}) public selectedPlace!: PlaceInterface;

  public closeDetails() {
    this.$router.push(this.$route.path);
    this.$emit('closed');
  }

  private isCalendarItem = () => [
    PlaceTypeEnum.MEETROOM as string,
    PlaceTypeEnum.STANDING_TABLE as string
  ].includes(this.selectedPlace.placeType);

  private haveImg(): boolean {
    return this.selectedPlace.showImg;
  }
  private haveDescription(): boolean {
    return this.getTranslate(this.selectedPlace.description) !== '';
  }
  private getImg(name: string): string {
    return require(`../assets/images/places/icons/${name}`);
  }
  private parseText(text: string) {
    const reg = /\d\. /;
    return text.split(reg).slice(1);
  }

  private signIn() {
    this.$gapi.signIn().then(() => {
      this.getCalendar()
          .then(async () => {
            await this.getCalendarBusyTimes();
            vxm.user.setSignInGoogleAccount(true);
          })
    });
  }

  private getCalendar() {
    return vxm.googleCalendar.getCalendarItemsBusy({
      vm: this,
      places: [this.selectedPlace],
      placeType: this.placeType,
    });
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
    .room-status {
      align-self: center;
      border-radius: 50%;
      width: 6px;
      height: 6px;
      background-color: #31D723;
      margin-right: 10px;

      &.busyAll {
        background-color: #FF0000;
      }

      &.unknown, &.busy {
        background-color: #ff9d0f;
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

    .place-container, .calendar-container {
      flex-wrap: wrap;
      min-height: 35px;
    }
    .calendar-container {
      width: 260px;
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
      &.warning:hover {
        color: white;
        background-color: #ff9d0f;
      }
      margin-left: 15px;
    }

    .get-link {
      margin-left: 10px;
      &:hover {
        cursor: pointer;
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

    .google-sign-in {
      margin-top: 10px;
    }
  }
</style>
