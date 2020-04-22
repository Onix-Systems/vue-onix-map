<template lang="pug">
  .page-container
    the-header(
      @userSelected="userSelected"
      @placeSelected="placeSelected"
      @floorChanged="floorChanged"
      @clickOnMobileMenu="showMobileMenu = !showMobileMenu"
      @closeMobileMenu="showMobileMenu = false"
    )
    svg.map-container(@mousedown="mouseDown"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" xml:space="preserve"
      @mouseup="mouseUp"
      @mousemove="mouseMove"
      @touchstart="touchStart"
      @touchend="mouseUp"
      @touchmove="touchMove"
      :class="{grabbing: trackMove, loading: floorLoading || dataLoading}"
      width='100%' height='100%')
      g(:style="mapStyles")
        image(:xlink:href="selectedFloor.planImg" height='1270' :width='floorWidth')
        //- tables rendering
        g(v-for="table in floorTables"
          :table-id="table.id"
          :x="table.x"
          :y="table.y"
          :style="'transform: translate(' + table.x + 'px,' + table.y + 'px)'")
          image(:xlink:href="getTableImg(table)" :height='table.imgHeight' :width='table.imgWidth')
          rect(v-if="getUser(table)"
            :x="table.rect.x"
            :y="table.rect.y"
            :width="table.rect.width"
            :height="table.rect.height"
            fill='transparent'
            @click="showDetails(getUser(table), table, true); logStatistic('user', getUser(table))")
        //- places rendering
        g(v-for="place in floorPlaces"
          @mousemove="setHoveredPlace(place)"
          @mouseout="clearHoveredPlace"
          :place-id="place.id"
          :x="place.x"
          :y="place.y"
          :style="'transform: translate(' + place.x + 'px,' + place.y + 'px)'")
          image(
            :xlink:href="getPlaceImg(place)"
            :height='place.imgHeight'
            :width='place.imgWidth'
            :class="[hiddenIcon === place.id ? 'hideImg' : '']"
          )
          rect(
            :x="place.rect.x"
            :y="place.rect.y"
            :width="place.rect.width"
            :height="place.rect.height"
            fill='transparent'
            @click="showPlaceDetails(place, true); setHiddenIcon(place.id); logStatistic('place', place)"
          )

    place-details(
      ref="placeDetails"
      :showDetailsModal="showPlaceModal"
      :popUpStyles="popUpStyles"
      :selectedPlace="selectedPlace"
      @closed="closeDetails")
    user-details(
      ref="userDetails"
      :showDetailsModal="showUserModal"
      :popUpStyles="popUpStyles"
      :user="selectedUser"
      @closed="closeDetails")

    the-loader(v-if="floorLoading || dataLoading")
    floors-control(:isShowMobile="showMobileMenu" @changed="floorChanged")
    floor-statistics
    notifications(group="foo")
</template>

<script lang="ts">
import FloorsControl from '@/components/FloorsControl.vue';
import TheHeader from '@/components/TheHeader.vue';
import TheLoader from '@/components/TheLoader.vue';
import UserDetails from '@/components/UserDetails.vue';
import PlaceDetails from '@/components/PlaceDetails.vue';

import {TABLES} from '@/data/tables';
import {PLACES} from '@/data/places';

import '@/data/tables.ts';
import {FloorInterface} from '@/interfaces/floorInterface';
import {TableInterface} from '@/interfaces/tableInterface';
import {UserInterface} from '@/interfaces/userInterface';
import {PlaceInterface} from '@/interfaces/placeInterface';

import {store} from '@/store';
import {Component, Vue, Watch} from 'vue-property-decorator';
import FloorStatistics from '@/components/FloorStatistics.vue';


@Component({
  components: {FloorStatistics, TheHeader, FloorsControl, TheLoader, UserDetails, PlaceDetails},
})
export default class MainLayout extends Vue {

  get mapStyles(): any {
    return {
      transform: 'translate(' + this.positionX + 'px,' + this.positionY + 'px)',
      transition: this.animateMap ? 'transform 500ms' : '',
    };
  }

  get _selectedFloor(): FloorInterface {
    return this.floors.find((x) => x.num === store.state.currentFloor) as FloorInterface;
  }

  get floorTables(): any {
    return this.tables[this.selectedFloor.num];
  }

  get floorPlaces(): any {
    return this.places[this.selectedFloor.num];
  }

  get floorWidth(): number {
    return this.selectedFloor.num === 8 ? 2425 : 2100;
  }

  get popupPosX(): number {
    return this.popupPos.x - 145;
  }

  get popupPosY(): number {
    return this.popupPos.y - this.popupHeight;
  }

  get isSidebarOnLeft(): boolean {
    return store.state.isSidebarOnLeft;
  }
  public floors: FloorInterface[] = [
    {num: 1, planImg: require('../assets/images/floors-plan/onix-office_1.png'), width: 2100, height: 1270},
    {num: 4, planImg: require('../assets/images/floors-plan/onix-office_4.png'), width: 2100, height: 1270},
    {num: 6, planImg: require('../assets/images/floors-plan/onix-office_6.png'), width: 2100, height: 1270},
    {num: 7, planImg: require('../assets/images/floors-plan/onix-office_7.png'), width: 2100, height: 1270},
    {num: 8, planImg: require('../assets/images/floors-plan/onix-office_8.png'), width: 2425, height: 1270},
  ];
  public selectedUser: UserInterface | null = null;
  public showUserModal: boolean = false;
  public showPlaceModal: boolean = false;
  public showDetailsModal: boolean = false;
  public showMobileMenu: boolean = false;
  public floorLoading: boolean = false;
  public dataLoading: boolean = false;
  public selectedFloor: FloorInterface = this.floors[0];
  public popupHeight: number = 132;
  private animateMap: boolean = false;
  private selectedTable: any = null;
  private tables: any = TABLES;
  private places: any = PLACES;
  private positionX: number = 0;
  private positionY: number = 0;
  private touchPosX: number = 0;
  private touchPosY: number = 0;
  private trackMove: boolean = false;
  private popupPos = {x: 0, y: 0};
  private popUpStyles: string = 'top: 0; left: 0';
  private selectedPlace: any = null;
  private hiddenIcon: number = -1;
  private hoveredPlace: number = -1;

  @Watch('_selectedFloor', {immediate: true})
  public onFloorChanged(newVal: any, oldVal: any) {
    if (!oldVal || oldVal.num !== newVal.num) {
      this.floorLoading = true;
      setTimeout(() => {
        this.selectedFloor = newVal;
        const planImg = document.createElement('img');
        planImg.src = newVal.planImg;
        planImg.onload = () => {
          this.floorLoading = false;
          this.centerMap();
          if (this.selectedUser) {
            this.userSelected(this.selectedUser);
          }
          if (this.selectedPlace) {
            this.placeSelected(this.selectedPlace);
          }
        };
      }, 500);
    }
  }

  public created() {
    this.dataLoading = true;
    store.dispatch('getUserData').then(() => {
      this.dataLoading = false;
      if (this.$route.query.userId) {
        const id = parseInt(this.$route.query.userId as string, 10);
        this.userSelected(this.getUserById(id));
      }
    });

    // store.dispatch('getEmployeesSkills');
    // store.dispatch('getEmployeesData');
    // store.dispatch('getTechnologies');
    // store.dispatch('getSkillsList');
    // store.dispatch('getEmployeesOnVacation');

    if (this.$route.query.placeId) {
      const id = parseInt(this.$route.query.placeId as string, 10);
      this.placeSelected(this.getPlaceById(id));
    }

  }

  public floorChanged() {
    this.selectedUser = null;
    this.selectedPlace = null;
    this.showPlaceModal = false;
    this.showUserModal = false;
    this.setHiddenIcon(-1);
    if (this.$route.query.userId || this.$route.query.placeId) {
      this.$router.push(this.$route.path);
    }
  }

  public userSelected(user: UserInterface) {
    const userFloor = Math.floor(parseInt(user.tableNumber, 10) / 100);
    if (userFloor && userFloor !== this.selectedFloor.num) {
      this.showUserModal = false;
      this.showPlaceModal = false;
      this.selectedUser = user;
      this.selectedPlace = null;
      this.setHiddenIcon(-1);
      store.commit('changeFloor', userFloor);
    } else {
      this.showDetails(
        user,
        user.tableNumber ?
          this.tables[userFloor].find((x: TableInterface) => x.id === parseInt(user.tableNumber, 10)) :
          undefined);
      let count = 0;
      const stepX = ((-(this.popupPos.x * 2 - window.innerWidth) / 2) - this.positionX) / 25;
      const stepY = ((-(this.popupPos.y * 2 - window.innerHeight) / 2) - this.positionY) / 25;
      const timerId = setInterval(() => {
        this.positionX += stepX;
        this.positionY += stepY;
        this.setPopUpStyles();
        count++;
        if (count === 25) {
          clearInterval(timerId);
        }
      }, 20);
    }
  }

  public placeSelected(place: PlaceInterface) {
    const placeFloor = Math.floor(place.id / 100);
    if (placeFloor && placeFloor !== this.selectedFloor.num) {
      this.showUserModal = false;
      this.showPlaceModal = false;
      this.selectedUser = null;
      this.selectedPlace = place;
      store.commit('changeFloor', placeFloor);
    } else {
      this.closeDetails();
      this.animateMap = true;
      this.positionX = -((place.x + place.imgWidth / 2) * 2 - window.innerWidth) / 2;
      this.positionY = -((place.y + place.imgHeight / 2) * 2 - window.innerHeight) / 2;
      const timerId = setInterval(() => this.setPopUpStyles(), 20);

      this.setHiddenIcon(place.id);
      setTimeout(() => {
        clearInterval(timerId);
        this.animateMap = false;

        this.showPlaceDetails(place, true);
      }, 500);
    }
  }

  public mouseDown(e: MouseEvent) {
    e.preventDefault();
    this.trackMove = true;
  }

  public touchStart(e: TouchEvent) {
    this.trackMove = true;
    if (e instanceof TouchEvent) {
      const touch = e.changedTouches[0];
      this.touchPosX = touch.pageX;
      this.touchPosY = touch.pageY;
    }
  }

  public mouseUp() {
    this.trackMove = false;
    this.selectedTable = null;
  }

  public mouseMove(e: MouseEvent) {
    e.preventDefault();
    if (this.trackMove) {
      this.positionX = this.positionX + e.movementX;
      this.positionY = this.positionY + e.movementY;
    }
    if (this.selectedTable) {
      this.selectedTable.x = this.selectedTable.x + e.movementX;
      this.selectedTable.y = this.selectedTable.y + e.movementY;
    }
    if (this.showUserModal || this.showPlaceModal) {
      this.setPopUpStyles();
    }
  }

  public touchMove(e: any) {
    e.preventDefault();
    if (this.trackMove) {
      const touch = e.changedTouches[0];
      this.positionX = this.positionX + (touch.pageX - this.touchPosX);
      this.positionY = this.positionY + (touch.pageY - this.touchPosY);
      this.touchPosX = touch.pageX;
      this.touchPosY = touch.pageY;
      if (this.showUserModal || this.showPlaceModal) {
        this.setPopUpStyles();
      }
    }
  }

  public getUser(table: TableInterface): UserInterface {
    return store.state.users.find((x: UserInterface) => parseInt(x.tableNumber, 10) === table.id) as UserInterface;
  }

  public getUserById(id: number): UserInterface {
    return store.state.users.find((user: UserInterface) => user.id === id) as UserInterface;
  }

  public getPlaceById(id: number) {
    return this.places[Math.floor(id / 100)].find((place: any) => place.id === id);
  }

  public getTableImg(table: TableInterface): string {
    const user = this.getUser(table);
    return require('../assets/images/tables/' + (user ? (user.gender === 'male' ? 'man/' : 'woman/') : '') + table.img);
  }
  public getPlaceImg(table: TableInterface): string {
    const user = this.getUser(table);

    if (this.hoveredPlace === table.id) {
      return require('../assets/images/places/map-points/hovered/' + table.img);
    }
    return require('../assets/images/places/map-points/' + table.img);
  }

  public showDetails(user: UserInterface, table?: TableInterface, scrollInToView?: boolean) {
    if (this.$route.query.userId !== user.id.toString()) {
      this.$router.push({query: {userId: user.id.toString()}});
    }
    this.showUserModal = false;
    this.showPlaceModal = false;
    this.selectedUser = null;
    this.selectedPlace = null;
    if (table) {
      this.popupPos.x = table.x + table.rect.x;
      this.popupPos.y = table.y + table.rect.y;
    } else {
      this.popupPos.x = this.selectedFloor.width / 2;
      this.popupPos.y = this.selectedFloor.height / 2;
    }
    setTimeout(() => {
      this.selectedUser = user;
      this.showUserModal = true;
      this.setPopUpStyles();
      Vue.nextTick(() => {
        const userDet = this.$refs.userDetails as any;
        let popup = (userDet.$refs.popupBody as HTMLElement).getClientRects()[0];
        this.popupHeight = popup.height + 10;
        this.setPopUpStyles();
        if (scrollInToView) {
          setTimeout(() => {
            popup = (userDet.$refs.popupContainer as HTMLElement).getClientRects()[0];
            let count = 0;
            let topOffset = 143;
            let leftOffset = this.isSidebarOnLeft ? 72 : 0;
            let rightOffset = this.isSidebarOnLeft ? 0 : 72;
            if (window.innerWidth < 640) {
              leftOffset = 0;
              rightOffset = 0;
              topOffset = 57;
            }
            const timerId = setInterval(() => {
              if (popup.top < topOffset) {
                this.positionY += Math.abs(popup.top - topOffset) / 25;
              }
              if (popup.left < leftOffset) {
                this.positionX += (Math.abs(popup.left) + leftOffset) / 25;
              }
              if (popup.left + popup.width - window.innerWidth + rightOffset > 0) {
                this.positionX -= (popup.left + popup.width - window.innerWidth + rightOffset) / 25;
              }
              if (popup.width >= window.innerWidth - leftOffset) {
                this.positionX -=
                  (popup.width / 2 - (window.innerWidth + leftOffset) / 2) / 25;
              }
              this.setPopUpStyles();
              count++;
              if (count === 25) {
                clearInterval(timerId);
              }
            }, 20);
          }, 10);
        }
      });
    });
  }

  public showPlaceDetails(place: PlaceInterface, scrollInToView?: boolean) {
    this.showUserModal = false;
    this.showPlaceModal = false;
    this.selectedUser = null;
    this.selectedPlace = null;
    this.popupPos.x = place.x + place.bubble.x;
    this.popupPos.y = place.y + place.bubble.y;
    if (this.$route.query.placeId !== place.id.toString()) {
      this.$router.push({query: {placeId: place.id.toString()}});
    }
    setTimeout(() => {
      this.selectedPlace = place;
      this.showPlaceModal = true;
      this.setPopUpStyles();

      Vue.nextTick(() => {
        const placeDet = this.$refs.placeDetails as any;
        let popup = (placeDet.$refs.popupBody as HTMLElement).getClientRects()[0];
        this.popupHeight = popup.height + 10;
        this.setPopUpStyles();
        if (scrollInToView) {
          setTimeout(() => {
            popup = (placeDet.$refs.popupContainer as HTMLElement).getClientRects()[0];
            let count = 0;
            /* margin left can be 72 and 56 - it's floor control panel size */
            const minMargin = window.innerWidth < 640 ? 56 : 72;
            const marginRight = window.innerWidth - popup.right;
            const timerId = setInterval(() => {
              if (popup.top < 60) {
                this.positionY += Math.abs(popup.top - 60) / 25;
              }
              if (this.isSidebarOnLeft && popup.left < minMargin) {
                this.positionX += Math.abs(minMargin - popup.left + 2) / 25;
              }
              if (!this.isSidebarOnLeft && marginRight < minMargin) {
                this.positionX -= Math.abs(minMargin - marginRight + 2) / 25;
              }
              if (popup.left + popup.width >= window.innerWidth - (window.innerWidth <= 1024 ? 0 : 70)) {
                this.positionX -=
                  (popup.left + popup.width - window.innerWidth + (window.innerWidth <= 1024 ? 0 : 70)) / 25;
              }
              this.setPopUpStyles();
              count++;
              if (count === 25) {
                clearInterval(timerId);
              }
            }, 20);
          }, 10);
        }
      });
    });
  }

  public setHiddenIcon(id: number) {
    this.hiddenIcon = id;
  }

  public closeDetails() {
    this.selectedUser = null;
    this.selectedPlace = null;
    this.showUserModal = false;
    this.showPlaceModal = false;
    this.setHiddenIcon(-1);
  }

  public centerMap() {
    this.positionX = -(this.selectedFloor.width - window.innerWidth) / 2;
    this.positionY = -(this.selectedFloor.height - window.innerHeight) / 2;
  }

  public moveTable(table: any) {
    this.selectedTable = table;
  }

  public setPopUpStyles() {
    Vue.nextTick(() => {
      this.popUpStyles = 'top: ' + (this.positionY + this.popupPosY) + 'px; left: ' +
        (this.positionX + this.popupPosX) + 'px; height: ' + this.popupHeight + 'px';
    });
  }

  public logStatistic(objName: string, obj: any) {
    if (objName === 'user') {
      this.$gtag.event('Show user modal', {
        event_category: 'Search users',
        event_label: obj.firstName + ' ' + obj.lastName,
      });
    }

    if (objName === 'place') {
      this.$gtag.event('Show place modal', {
        event_category: 'Search places',
        event_label: obj.name,
      });
    }
  }

  private setHoveredPlace(place: PlaceInterface) {
    this.hoveredPlace = place.id;
  }
  private clearHoveredPlace() {
    this.hoveredPlace = -1;
  }
}
</script>

<style lang="scss" scoped>
  .page-container {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #E5F0FF;
    overflow: hidden;

    .map-container {
      width: 100%;
      height: 100%;
      cursor: grab;
      opacity: 1;
      transition: opacity 500ms;

      * {
        transform-origin: center; /* or transform-origin: 50% */
        transform-box: fill-box;
      }

      &.loading {
        opacity: 0;
      }

      &.grabbing {
        cursor: grabbing;
      }

      rect {
        cursor: pointer;
      }

      .conf-bubble {
        font-family: "Helvetica";
        font-size: 15px;
      }
    }
    .hideImg {
      display: none;
    }
  }
</style>
