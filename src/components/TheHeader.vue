<template lang="pug">
  header
    .header-section-1
      .floors-icon
        img(src="../assets/images/floors.icon.svg" alt="floors")
      .mobile-menu(@click="$emit('clickOnMobileMenu')" v-click-outside="closeMobileMenu")
        img(src="../assets/images/header-icons/menu.svg" alt="Menu")
      .logo
        a(href="http://onix-systems.com/" target="blank" @click.stop="clickOnLogo")
      custom-search(@selected="userSelected" @searchIsActive="hideButtons")
    .header-section-2(:class="{'hideSection': hideRightSection}")
      header-button(
        :title="$tc('conferenceRoom', 2)"
        :icon="require('../assets/images/header-icons/header_clock.svg')"
        @roomSelected="placeSelected"
      )
        conference-rooms
      header-button(
        :title="$tc('place', 2)"
        :icon="require('../assets/images/header-icons/header_places.svg')"
        @place-selected="placeSelected"
      )
        places-menu
      header-button(:icon="require('../assets/images/header-icons/header_links.svg')")
        other-services
      current-user-menu
</template>

<script lang="ts">
import CustomSearch from '@/components/CustomSearch.vue';
import HeaderButton from '@/components/HeaderButton.vue';
import ConferenceRooms from '@/components/ConferenceRooms.vue';
import ClickOutside from '@/directives/clickOutside';
import {UserInterface} from '@/interfaces/userInterface';
import {store} from '@/store';
import {Component, Vue} from 'vue-property-decorator';
import OtherServices from '@/components/OtherServices.vue';
import PlacesMenu from '@/components/PlacesMenu.vue';
import CurrentUserMenu from '@/components/CurrentUserMenu.vue';


@Component({
  components: {CurrentUserMenu, PlacesMenu, OtherServices, CustomSearch, HeaderButton, ConferenceRooms},
  directives: {ClickOutside},
})
export default class TheHeader extends Vue {
  public floors: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
  public isShowMenu: boolean = false;
  public hideRightSection: boolean = false;

  get currentFloor(): number {
    return store.state.currentFloor;
  }

  get tablesStatistic() {
    return store.state.tablesStatistic;
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

  public floorChanged(e: any) {
    this.isShowMenu = false;
    store.commit('changeFloor', parseInt(e.target.value, 10));
    this.$emit('floorChanged');
  }

  public placeSelected(place: any) {
    this.$emit('placeSelected', place);
  }

  public hideButtons(searchIsActive: boolean) {
    this.hideRightSection = searchIsActive;
  }

  public clickOnLogo() {
    this.$gtag.event('Click on logo link', {
      event_category: 'Navigate',
    });
  }
}
</script>

<style lang="scss" scoped>
  @import "../assets/scss/media";

  header {
    position: fixed;
    top: 0;
    height: 57px;
    border-bottom: 1px solid #E5E5E5;
    width: 100%;
    padding: 0 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: "Helvetica";
    background: #fff;
    z-index: 2;

    .header-section-1, .header-section-2 {
      display: flex;
      * {
        margin: auto 12px;
      }
      @media only screen and (max-width: 340px) {
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
        background: url("../assets/images/HYDRA.onixmap.svg") no-repeat center;
        background-size: contain;
        display: block;
        height: 100%;
        width: 100%;
      }
    }
  }
</style>
