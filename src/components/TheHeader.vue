<template lang="pug">
  header
    .header-section-1
      .floors-icon
        img(src="../assets/images/floors.icon.svg" alt="floors")
      .mobile-menu(@click="$emit('clickOnMobileMenu')" v-click-outside="closeMobileMenu")
        img(src="../assets/images/header-icons/menu.svg" alt="Menu")
      .logo
        a(href="https://map.onix-systems.com/" target="blank" @click.stop="clickOnLogo")
      custom-search(
        @selected="userSelected"
        @searchIsActive="hideButtons"
      )
    .header-section-2(:class="{'hideSection': hideRightSection}")
      header-button(
        :title="$tc('standingTables')"
        :type="PlaceTypeEnum.STANDING_TABLE"
        :icon="require('../assets/images/header-icons/table.svg')"
        @btnClicked="googlePlacesToggle($event)"
      )
        template(#list)
          google-calendar-places
      header-button(
        :title="$tc('conferenceRoom', 2)"
        :type="PlaceTypeEnum.MEETROOM"
        :icon="require('../assets/images/header-icons/header_clock.svg')"
        @btnClicked="googlePlacesToggle($event)"
      )
        template(#list)
          google-calendar-places
      header-button(
        :title="$tc('place', 2)"
        :icon="require('../assets/images/header-icons/header_places.svg')"
        @btnClicked="googlePlacesToggle($event)"
      )
        places-menu
      header-button(:icon="require('../assets/images/header-icons/header_links.svg')")
        other-services
      current-user-menu
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CustomSearch from '@/components/CustomSearch.vue';
import HeaderButton from '@/components/HeaderButton.vue';
import GoogleCalendarPlaces from '@/components/GoogleCalendarPlaces.vue';
import { UserInterface } from '@/interfaces/userInterface';
import OtherServices from '@/components/OtherServices.vue';
import PlacesMenu from '@/components/PlacesMenu.vue';
import CurrentUserMenu from '@/components/CurrentUserMenu.vue';
import ClickOutside from '@/directives/clickOutside';
import {vxm} from '@/store';
import {PlaceTypeEnum} from '@/enums/PlaceTypeEnum';

@Component({
  components: {
    CurrentUserMenu,
    PlacesMenu,
    OtherServices,
    CustomSearch,
    HeaderButton,
    GoogleCalendarPlaces,
  },
  directives: { ClickOutside },
})
export default class TheHeader extends Vue {
  public floors: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
  public isShowMenu: boolean = false;
  public hideRightSection: boolean = false;
  public isCalendarVisible: boolean = false;

  private PlaceTypeEnum = PlaceTypeEnum;

  get currentFloor(): number {
    return vxm.general.currentFloor;
  }

  get tablesStatistic() {
    return vxm.general.tablesStatistic;
  }

  get placeType() {
    return vxm.googleCalendar.currentPlaceType;
  }

  public closeMobileMenu() {
    this.$emit('closeMobileMenu');
  }

  public isDisabled(floor: number): boolean {
    return floor === 2 || floor === 3 || floor === 5;
  }

  public userSelected(user: UserInterface) {
    this.$emit('userSelected', user);
  }

  public hideButtons(searchIsActive: boolean) {
    this.hideRightSection = searchIsActive;
  }

  public clickOnLogo() {
    this.$gtag.event('Click on logo link', {
      event_category: 'Navigate',
    });
  }
  public googlePlacesToggle(event: {status: boolean, type: string}) {
    this.isCalendarVisible = event.status;
    if(this.isCalendarVisible) {
      vxm.googleCalendar.setPlaceType(event.type);
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/media';

header {
  position: fixed;
  top: 0;
  height: 57px;
  border-bottom: 1px solid #e5e5e5;
  width: 100%;
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: 'Helvetica', sans-serif;
  background: #fff;
  z-index: 2;

  .header-section-1,
  .header-section-2 {
    display: flex;
    * {
      margin: auto 12px;
    }
    @media only screen and (max-width: 380px) {
      * {
        margin: auto 8px;
      }
    }
  }
  .header-section-1 {
    justify-content: flex-start;
    align-items: center;
    width: 100%;
  }
  .header-section-2 {
    justify-content: flex-end;
  }
  .hideSection {
    @media screen and (max-width: 465px) {
      display: none;
    }
  }

  .floors-icon {
    @include media_mobile {
      display: none;
    }

    img {
      height: 24px;
      width: 24px;
      margin: 0;
    }
  }

  .mobile-menu {
    cursor: pointer;
    display: none;
    margin: 0 7px;
    @include media_mobile {
      display: block;
    }

    img {
      margin: 0;
    }
  }

  .logo {
    min-width: 220px;
    height: 40px;
    @media only screen and (max-width: 768px) {
      display: none;
    }

    a {
      background: url('../assets/images/HYDRA.onixmap.svg') no-repeat center;
      background-size: contain;
      display: block;
      height: 100%;
      width: 100%;
    }
  }
}
</style>
