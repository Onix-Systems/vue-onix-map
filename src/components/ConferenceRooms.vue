<template lang="pug">
  ul.dropdown-container
    li.dropdown-item(
      v-for="(object, index) in confRooms"
      :key="index"
      @click.self="selectRoom(object)"
    ) {{getTranslate(object.name)}}
      button.btn-booking(@click="toTheCalendar()") {{$t('confRoomMenu.book')}}
</template>

<script lang="ts">
import {Component, Mixins} from 'vue-property-decorator';
import CommonMixin from '@/components/mixins/CommonMixin';
import {PLACES} from '@/data/places';

@Component
export default class ConferenceRooms extends Mixins(CommonMixin) {
  get confRooms(): any[] {
    let places: any[] = [];
    Object.values(PLACES).forEach( (value) => {
      value.forEach( (place) => {
        if (this.isMeetRoom(place.placeType)) {
          places = [...places, place];
        }
      });
    });
    return places;
  }
  private isMeetRoom(place: string): boolean {
    return place === 'meetroom';
  }

  private selectRoom(room: any) {
    this.$parent.$emit('roomSelected', room);
    this.$parent.$emit('close-dropdown');
    this.$gtag.event('Select conference room from header menu', {
      event_category: 'Search places',
      event_label: room.name,
    });
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
      padding: 0 16px;
      width: 100%;
      height: 45px;
      opacity: 0.8;
      position: relative;
      &:last-child {
        margin-bottom: 0;
      }
    }
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
      width: fit-content;
      height: 20px;
      padding: 0 10px;
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
    }

  }
</style>
