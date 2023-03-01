<template lang="pug">
  .conf-rooms-block(v-click-outside="closePlace")
    ul.dropdown-container(v-if="screenWidth > 1024 || !showPlaceTimeList")
      li.dropdown-item(
        v-for="(object, index) in selectedPlaces"
        :key="index"
        @click="selectRoom(object)"
        @touchstart="selectRoom(object)"
        @mouseenter="showTimeList(object)"
        :class="{hovered: currentPlaceCalendarId === object.calendarId}"
      )
        .room-status
        .room-name {{getTranslate(object.name)}}
        button.btn-booking(
          v-if="hasCalendar(object)"
          @click="toTheCalendar(currentPlace)"
          @touchstart="toTheCalendar(currentPlace)"
        ) {{$t('confRoomMenu.book')}}
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import CalendarPlacesTimeList from '@/components/CalendarPlacesTimeList.vue';
import CommonMixin from '@/components/mixins/CommonMixin';
import ConfRoomMixin from '@/components/mixins/ConfRoomMixin';
import { ConfRoomTimeListInterface } from '@/interfaces/confRoomTimeListInterface';
import {vxm} from '@/store';
import moment from 'moment';
import clickOutside from '@/directives/clickOutside';
import {PlaceInterface} from '@/interfaces/placeInterface';
import {PlaceTypeEnum} from '@/enums/PlaceTypeEnum';
import HeaderButton from '@/components/HeaderButton.vue';

@Component({
  components: {
    CalendarPlacesTimeList,
    HeaderButton
  },
  directives: {
    clickOutside,
  },
})
export default class GoogleCalendarPlaces extends Mixins(
  CommonMixin,
  ConfRoomMixin
) {
  public showPlaceTimeList = false;
  public currentPlaceCalendarId = '';
  public currentPlace = {} as PlaceInterface;
  public timeLists: any = {};

  get selectedPlaces() {
    return this.placeType === PlaceTypeEnum.MEETROOM ?
      vxm.googleCalendar.conferenceRooms.places : vxm.googleCalendar.standingTables.places;
  }

  get timeList() {
    return this.timeLists[this.currentPlaceCalendarId];
  }

  get screenWidth() {
    return window.innerWidth;
  }

  public showTimeList(room: any) {
    if (this.hasCalendar(room)) {
      this.currentPlace = room;
      this.currentPlaceCalendarId = room.calendarId;
      this.showPlaceTimeList = true;
    }
  }

  public createTimeLists() {
    const timeLists: any = {};
    this.selectedPlaces.forEach((value: any) => {
      if (this.hasCalendar(value)) {
        const timeList = {
          list: [] as ConfRoomTimeListInterface[],
          errors: [] as any,
        };
        if (this.placesBusy.error) {
          timeList.errors = this.placesBusy.error;
        }

        if (this.placesBusy[value.calendarId].errors) {
          timeList.errors = this.placesBusy[value.calendarId].errors;
        } else {
          timeList.list = this.createTimeList(value.calendarId);
        }

        timeLists[value.calendarId] = timeList;
      }
    });
    return timeLists;
  }

  public createTimeList(calendarId: string): ConfRoomTimeListInterface[] {
    const timeList: ConfRoomTimeListInterface[] = [];
    for (let i = 8; i < 20; i++) {
      const startTime = moment({ hour: i });
      const endTime = moment({ hour: i + 1 });
      timeList.push({
        id: i,
        startTime,
        endTime,
        isFree: this.checkFree(startTime, endTime, calendarId, this.placeType),
        till: this.getTill(startTime, endTime, calendarId),
      });
    }
    return timeList;
  }

  public signIn() {
    if (process.env.VUE_APP_DEMO_MODE) {
      return;
    }
    this.$gapi.signIn().then(() => {
      this.getCalendar()
        .then(() => {
          this.timeLists = this.createTimeLists();
          vxm.user.setSignInGoogleAccount(true);
        })
    });
  }

  private selectRoom(room: any) {
    this.$parent.$emit('close-dropdown', room);
    this.$gtag.event('Select conference room from header menu', {
      event_category: 'Search places',
      event_label: room.name,
    });
  }

  private async getCalendar() {
    return vxm.googleCalendar.getCalendarItemsBusy({
      vm: this,
      places: this.selectedPlaces,
      placeType: this.placeType,
    });
  }

  private closePlace(e: Event) {
    this.$emit('clickOutside', {status: false, type: ''});
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/media';
.conf-rooms-block {
  position: absolute;
  top: 43px;
  right: 0;
}
.dropdown-container {
  position: absolute;
  width: 320px;
  right: -2px; //- temporary solution for non-user header structure
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #e2e6ed;
  box-shadow: 0 4px 8px rgba(43, 44, 48, 0.1);
  overflow-y: auto;
  max-height: calc(100vh - 57px);
  @include media_mobile {
    position: fixed;
    top: 54px;
    max-height: calc(80vh - 57px);
  }
  &.time-list-block {
    width: 240px;
    @media only screen and (min-width: 1025px) {
      right: -242px;
    }
  }

  .dropdown-item {
    display: flex;
    align-items: center;
    font-size: 14px;
    padding-left: 15px;
    padding-right: 15px;
    width: 100%;
    height: 45px;
    min-height: 48px;
    opacity: 0.8;
    position: relative;
    cursor: pointer;
    &:last-child {
      margin-bottom: 0;
    }
    &.hovered {
      @media only screen and (min-width: 1025px) {
        user-select: none;
        background-color: #ebeef2;
        cursor: pointer;
        .btn-booking {
          background-color: #fff;
          color: #232323;
          outline: none;
        }
        .btn-booking:hover {
          cursor: pointer;
          background-color: #4d9cff;
          color: #fff;
          outline: none;
        }
        .btn-booking.warning:hover {
          background-color: #ff9d0f;
        }
      }
    }
  }
  .dropdown-item:not(:last-child):after {
    //border-bottom
    content: '';
    position: absolute;
    left: 16px;
    bottom: -2px;
    height: 1px;
    width: 310px - 16px * 2;
    border-bottom: 1px solid#F6F8FC;
  }

  .room-name {
    flex-grow: 1;
  }

  .busy-till {
    margin-right: 16px;
    font: normal normal 12px Inter;
    color: #8891A3;
    text-align: center;
  }

  .btn-booking {
    width: fit-content;
    height: 20px;
    padding: 0 10px;
    justify-content: flex-end;
    background-color: #edf5ff;
    border: none;
    border-radius: 20px;
    color: #232323;
    font-size: 12px;
  }

  .btn-booking:focus {
    outline: none;
  }

  .arrow-right {
    transform: rotate(-90deg);
    padding: 10px 15px 15px 15px;
  }

  .room-status {
    border-radius: 50%;
    min-width: 6px;
    min-height: 6px;
    background-color: #31d723;
    margin-right: 10px;
  }

  .back-block {
    display: none;
    align-items: center;
    padding: 16px 0 0 16px;
    @include media_tablet {
      display: flex;
    }

    .back-arrow {
      cursor: pointer;
    }

    .time-block-title {
      font: normal 600 14px Inter, sans-serif;
      line-height: 17px;
      padding-left: 15px;
      text-transform: capitalize;
    }
  }

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 1000px;
    background: #f8fbff;
  }

  &::-webkit-scrollbar-thumb {
    color: blue;
    border-radius: 1000px;
    background: #e5e5e5;

    &:hover {
      background: #9ea3af;
    }
  }
}
</style>
