<template lang="pug">
  .places-block
    .menu(v-show="!showPlacesList")
      .sections(v-for="section in placesMenu" :key="section.sectionName")
        .section-name {{section.sectionName}}
        ul
          li(v-for="(place, i) in section.places" :key="place.id")
            a.place(
              v-if="place.link"
              :href="place.link"
              target="blank"
              :title="getTranslate(place.name)"
              @click.stop="clickOnPlace(place, i)"
            )
              .icon
                img(:src="require('../assets/images/header-icons/places/' + place.icon)")
              .place-name {{getTranslate(place.name)}}
              .place-label.link {{place.label}}

            .place(
              v-else
              :title="getTranslate(place.name)"
              @click.stop="clickOnPlace(place, i)"
            )
              .icon
                img(:src="require('../assets/images/header-icons/places/' + place.icon)")
              .place-name {{getTranslate(place.name)}}
              .place-label {{place.label}}
    .place-list-block(v-if="showPlacesList")
      .place-list-label-block
        img(:src="require('../assets/images/header-icons/places/arrow.svg')" @click.stop="showPlacesList = false")
        .place-list-label {{currentPlace.name}}
      .place-list-name(v-for="place in placesList" :key="place.id" @click="clickOnPlaceList(place)") {{getTranslate(place.name)}}
</template>

<script lang="ts">
import {Component, Mixins} from 'vue-property-decorator';
import {PLACES} from '@/data/places';
import {PlaceInterface} from '@/interfaces/placeInterface';
import {PLACES_MENU} from '@/data/placesMenu';
import {PlacesMenuInterface, PlaceMenuInterface} from '@/interfaces/placesMenuInterface';
import CommonMixin from '@/components/mixins/CommonMixin';

@Component({})
export default class PlacesMenu extends Mixins(CommonMixin) {
  public placesMenu: any = PLACES_MENU;
  public places: any = PLACES;
  public placesList: PlaceInterface[] = [];
  public showPlacesList: boolean = false;
  public currentPlace: PlaceMenuInterface | null = null;

  private clickOnPlace(place: PlaceMenuInterface, placeType: string) {

    this.placesList = this.createList(place, placeType, this.places);

    if (this.placesList.length === 1) {
      this.$parent.$emit('place-selected', this.getPlaceById(this.placesList[0].id));
      this.$parent.$emit('close-dropdown');
      this.$gtag.event('Select place from header menu', {
        event_category: 'Search places',
        event_label: place.name,
      });
    }

    if (this.placesList.length > 1) {
      this.currentPlace = place;
      this.showPlacesList = true;
    }

    if (this.placesList.length === 0) {
      this.$gtag.event('Select place from header menu', {
        event_category: 'Search places',
        event_label: place.name,
      });
      this.$parent.$emit('close-dropdown');
    }
  }

  private clickOnPlaceList(place: PlaceInterface) {
    this.$parent.$emit('place-selected', this.getPlaceById(place.id));
    this.$parent.$emit('close-dropdown');
    this.$gtag.event('Select place from header menu', {
      event_category: 'Search places',
      event_label: place.name,
    });
  }

  private getPlaceById(id: number): PlaceInterface {
    return this.places[Math.floor(id / 100)].find((place: any) => place.id === id);
  }

  private createList(place: PlaceMenuInterface, placeType: string, places: any) {
    return Object.values(places).flat(1).filter( (e: PlaceInterface) => e.placeType === placeType );
  }
}
</script>

<style lang="scss" scoped>
  @import "../assets/scss/media";

  .places-block {
    display: flex;
    justify-content: center;
    top: 43px;
    position: absolute;
    width: 270px;
    right: 0;

    margin: 0 !important;
    background-color: #ffff;
    border-radius: 4px;
    border: 1px solid #E2E6ED;
    box-shadow: 0 4px 8px rgba(43, 44, 48, 0.1);
    overflow-y: auto;
    max-height: calc(100vh - 57px);
    @include media_mobile {
      position: absolute;
      top: 54px;
      right: 12px;
    }

    .sections {
      border-bottom: 1px solid #F6F8FC;

      &:last-child {
        border-bottom: none;
      }
    }

    .section-name {
      padding: 24px 0 4px 24px;
      font: normal 600 14px Inter, sans-serif;
      line-height: 17px;
    }

    ul {
      display: flex;
      flex-wrap: wrap;
      font: normal 500 12px Inter, sans-serif;
      line-height: 15px;

      li {
        display: flex;
        padding: 20px 0;
        flex-basis: 33.33%;
      }
    }

    .place {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #363A42;
      width: 100%;
      text-decoration: none;
      cursor: pointer;

      &:hover {
        .icon {
          background: #EBEEF2;
        }
      }
    }

    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      background: #F2F7FF;
      border-radius: 50%;
    }

    .place-name {
      display: flex;
      justify-content: center;
      padding-top: 8px;
      width: 100%;
    }

    .place-label {
      display: flex;
      justify-content: center;
      font: normal normal 10px Inter, sans-serif;
      line-height: 12px;
      color: #8891A3;
      margin-top: 5px;
      width: 100%;

      &.link {
        position: relative;
        padding-left: 9px;

        &:before {
          content: "";
          position: absolute;
          background: url("../assets/images/header-icons/places/link-to-new-window.svg") center center no-repeat;
          width: 9px;
          height: 9px;
          left: 5px;
        }
      }
    }

    .place-list-block {
      width: 100%;
    }

    .place-list-label-block {
      display: flex;
      padding: 24px 0 24px 15px;
      img {
        cursor: pointer;
      }
    }

    .place-list-label {
      font: normal 600 14px Inter, sans-serif;
      line-height: 17px;
      padding-left: 15px;
    }

    .place-list-name {
      font: normal normal 12px Inter, sans-serif;
      line-height: 15px;
      padding: 16px 0 16px 45px;
      border-bottom: 1px solid #F6F8FC;
      cursor: pointer;

      &:hover {
        background: #EBEEF2;
      }

      &:last-child {
        border-bottom: none;
      }
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
