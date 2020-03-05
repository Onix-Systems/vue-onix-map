<template lang="pug">
  header
    .header-section-1
      .floors-icon
        img(src="../assets/images/floors.icon.svg" alt="floors")
      .logo
        a(href="http://onix-systems.com/")
      custom-search(@selected="userSelected")
    .header-section-2
      header-button(
        v-bind:title="'Conference Rooms'"
        v-bind:icon="require('../assets/images/header-icons/header_clock.svg')"
        v-bind:data="confRooms"
        v-on:select-data="roomSelected")
      header-button(v-bind:title="'Places'", v-bind:icon="require('../assets/images/header-icons/header_places.svg')" v-bind:dummy="true" )
      header-button(v-bind:icon="require('../assets/images/header-icons/header_links.svg')" v-bind:dummy="true")
      //- .user-container
      //-   .user-name Roman Marusenko
      //-   img(src="../assets/images/header-icons/test_img.png" alt="Roman Marusenko")
    //- .menu(v-click-outside="closeMenu")
      button.menu-btn(@click="isShowMenu = !isShowMenu")
      .side-menu(:class="{expanded: isShowMenu}")
        ul
          li
            span Floor
              select(@change="floorChanged")
                option(v-for="floor in floors"
                  :disabled="isDisabled(floor)"
                  :value="floor"
                  :selected="floor === currentFloor") {{floor}}
          li
            input(type="checkbox" id="confRooms")
            div
              label(for="confRooms") Conference rooms
              ul
                li(v-for="room in confRooms")
                  a(@click="roomSelected(room)") {{room.bubble.text}}
          li(v-if="tablesStatistic.total")
            input(type="checkbox" id="tablesStatistic")
            div
              label(for="tablesStatistic") {{`Number of seats/free: ${tablesStatistic.total.all}/${tablesStatistic.total.free}`}}
              ul
                li(v-for="(data, floor,) in tablesStatistic" v-if="floor !== 'total'")
                  span {{`${floor} floor: ${data.all}/${data.free}`}}
</template>

<script lang="ts">
import CustomSearch from '@/components/CustomSearch.vue';
import HeaderButton from '@/components/HeaderButton.vue';
import HeaderDropdown from '@/components/HeaderDropdown.vue';

import {ROOMS} from '@/data/conferenceRooms';
import ClickOutside from '@/directives/clickOutside';
import {UserInterface} from '@/interfaces/userInterface';
import {store} from '@/store';
import {Component, Vue} from 'vue-property-decorator';


@Component({
  components: {CustomSearch, HeaderButton, HeaderDropdown},
  directives: {ClickOutside},
})
export default class TheHeader extends Vue {
  public floors: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
  public isShowMenu: boolean = false;

  get currentFloor(): number {
    return store.state.currentFloor;
  }

  get confRooms(): any[] {
    let rooms: any[] = [];
    Object.values(ROOMS).forEach((value) => rooms = [...rooms, ...value]);
    return rooms;
  }

  get tablesStatistic() {
    return store.state.tablesStatistic;
  }

  public closeMenu() {
    this.isShowMenu = false;
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

  public roomSelected(room: any) {
    // this.isShowMenu = false;
    this.$emit('roomSelected', room);
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
    }
    .header-section-1 {
      justify-content: flex-start;
      width: 100%;
    }
    .header-section-2 {
      justify-content: flex-end;
    }

    .floors-icon {

      img {
        height: 24px;
        width: 24px;
        margin: 0;
      }
      img:hover {
          cursor: pointer;
        }
    }

    .logo {
      flex-basis: 220px;
      min-width: 175px;
      height: 40px;
      @include media_tablet {
        flex-basis: 135px;
      }
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

    .menu {
      flex-basis: 220px;
      display: flex;
      justify-content: flex-end;

      .menu-btn {
        background: transparent;
        border: none;
        cursor: pointer;

        &:before {
          content: '';
          display: block;
          background-image: url("../assets/images/bars.svg");
          width: 16px;
          height: 16px;
          background-size: 100% 100%;
        }
      }

      .side-menu {
        position: fixed;
        background-color: #ebebeb;
        top: 60px;
        right: 0;
        bottom: 0;
        width: 0;
        overflow-y: auto;
        overflow-x: hidden;
        transition: width 500ms;

        &.expanded {
          width: 270px;
        }

        ul {
          min-width: 270px;

          li {
            font-size: 15px;
            line-height: 44px;

            span, a, label {
              display: block;
              padding: 0 20px;
            }

            label {
              display: flex;
              justify-content: space-between;
              align-items: center;

              &:after {
                content: '';
                display: block;
                background-image: url("../assets/images/chevron.svg");
                width: 16px;
                height: 16px;
                background-size: 100% 100%;
                transition: all 500ms;
              }
            }

            a, label {
              cursor: pointer;

              &:hover {
                background: rgba(50, 50, 50, 0.06);
              }
            }

            li {
              a, label, span {
                padding: 0 40px;
              }
            }

            input[type=checkbox] {
              display: none;

              &:checked + div {
                ul{
                  height: auto;
                }
                label:after {
                  transform: rotate(180deg);
                }
              }
            }

            ul {
              height: 0;
              overflow: hidden;
            }
          }
        }

        select {
          height: 27px;
          border-radius: 10px;
          border: 1px solid #cdcbcc;
          box-shadow: inset 0 0 5px #cdcbcc;
          background-color: #ffffff;
          padding: 0 5px;
          font-size: 13px;
          color: #777372;
          outline: none;
          margin-left: 10px;
        }
      }
      @include media_tablet {
        flex-basis: 40px;
      }
    }
    .user-container {
      display: flex;
      flex-wrap: nowrap;
      justify-content: center;
      align-items: center;
      margin: 0;
    }
  }
</style>
