<template lang="pug">
  #app
    .page-container
      the-header(@userSelected="userSelected" @roomSelected="roomSelected" @floorChanged="floorChanged")
      svg.map-container(@mousedown="mouseDown"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" xml:space="preserve"
        @mouseup="mouseUp"
        @mousemove="mouseMove"
        @touchstart="touchStart"
        @touchend="mouseUp"
        @touchmove="touchMove"
        :class="{grabbing: trackMove, loading: floorLoading}"
        width='100%' height='100%')
        g(:style="mapStyles")
          image(:xlink:href="selectedFloor.planImg" height='1270' :width='floorWidth')
          g(v-for="room in floorRooms"
            :x="room.x"
            :y="room.y"
            :style="'transform: translate(' + room.x + 'px,' + room.y + 'px)'")
            path(:d="room.path" fill="transparent" stroke="#28a745" stroke-width="2")
            g.conf-bubble(:style="'transform: translate(' + room.bubble.x + 'px,' + room.bubble.y + 'px)'")
              path(:d="room.bubble.path" fill="#ffffff" stroke="#d2d4cf")
              text(x="9px" y="21px") {{room.bubble.text}}
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
              @click="showDetails(getUser(table), table, true)")
      user-details(
        ref="userDetails"
        :showDetailsModal="showDetailsModal"
        :popUpStyles="popUpStyles"
        :selectedUser="selectedUser"
        @closed="closeDetails")
      the-loader(v-if="floorLoading")
      floors-control(@changed="floorChanged")
    notifications(group="foo")

</template>

<script lang="ts">
import FloorsControl from '@/components/FloorsControl.vue';
import TheHeader from '@/components/TheHeader.vue';
import TheLoader from '@/components/TheLoader.vue';
import UserDetails from '@/components/UserDetails.vue';
import {ROOMS} from '@/data/conferenceRooms';
import {TABLES} from '@/data/tables';
import '@/data/tables.ts';
import {FloorInterface} from '@/interfaces/floorInterface';
import {TableInterface} from '@/interfaces/tableInterface';
import {UserInterface} from '@/interfaces/userInterface';
import {store} from '@/store';
import {Component, Vue, Watch} from 'vue-property-decorator';


@Component({
  components: {TheHeader, FloorsControl, TheLoader, UserDetails},
})
export default class PageMap extends Vue {
  public floors: FloorInterface[] = [
    {num: 1, planImg: require('./assets/images/floors-plan/onix-office_1.png'), width: 2100, height: 1270},
    {num: 4, planImg: require('./assets/images/floors-plan/onix-office_4.png'), width: 2100, height: 1270},
    {num: 6, planImg: require('./assets/images/floors-plan/onix-office_6.png'), width: 2100, height: 1270},
    {num: 7, planImg: require('./assets/images/floors-plan/onix-office_7.png'), width: 2100, height: 1270},
    {num: 8, planImg: require('./assets/images/floors-plan/onix-office_8.png'), width: 2425, height: 1270},
  ];
  public selectedUser: UserInterface | null = null;
  public showDetailsModal: boolean = false;
  public floorLoading: boolean = false;
  public selectedFloor: FloorInterface = this.floors[0];
  public popupHeight: number = 132;
  private animateMap: boolean = false;
  private selectedTable: any = null;
  private tables: any = TABLES;
  private rooms: any = ROOMS;
  private positionX: number = 0;
  private positionY: number = 0;
  private touchPosX: number = 0;
  private touchPosY: number = 0;
  private trackMove: boolean = false;
  private popupPos = {x: 0, y: 0};
  private popUpStyles: string = 'top: 0; left: 0';
  private selectedRoom: any = null;

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
          if (this.selectedRoom) {
            this.roomSelected(this.selectedRoom);
          }
        };
      }, 500);
    }
  }

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

  get floorRooms(): any {
    return this.rooms[this.selectedFloor.num];
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

  public created() {
    store.dispatch('getUserData');
  }

  public floorChanged() {
    this.selectedUser = null;
    this.selectedRoom = null;
    this.showDetailsModal = false;
  }

  public userSelected(user: UserInterface) {
    const userFloor = Math.floor(parseInt(user.tableNumber, 10) / 100);
    if (userFloor && userFloor !== this.selectedFloor.num) {
      this.showDetailsModal = false;
      this.selectedUser = user;
      this.selectedRoom = null;
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

  public roomSelected(room: any) {
    const roomFloor = Math.floor(room.id / 10);
    if (roomFloor && roomFloor !== this.selectedFloor.num) {
      this.showDetailsModal = false;
      this.selectedUser = null;
      this.selectedRoom = room;
      store.commit('changeFloor', roomFloor);
    } else {
      this.animateMap = true;
      this.positionX = -((room.x + room.width / 2) * 2 - window.innerWidth) / 2;
      this.positionY = -((room.y + room.height / 2) * 2 - window.innerHeight) / 2;
      const timerId = setInterval(() => this.setPopUpStyles(), 20);
      setTimeout(() => {
        clearInterval(timerId);
        this.animateMap = false;
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
    if (this.showDetailsModal) {
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
      if (this.showDetailsModal) {
        this.setPopUpStyles();
      }
    }
  }

  public getUser(table: TableInterface): UserInterface {
    return store.state.users.find((x: UserInterface) => parseInt(x.tableNumber, 10) === table.id) as UserInterface;
  }

  public getTableImg(table: TableInterface): string {
    const user = this.getUser(table);
    return require('./assets/images/tables/' + (user ? (user.gender === 'male' ? 'man/' : 'woman/') : '') + table.img);
  }

  public showDetails(user: UserInterface, table?: TableInterface, scrollInToView?: boolean) {
    this.showDetailsModal = false;
    this.selectedUser = null;
    if (table) {
      this.popupPos.x = table.x + table.rect.x;
      this.popupPos.y = table.y + table.rect.y;
    } else {
      this.popupPos.x = this.selectedFloor.width / 2;
      this.popupPos.y = this.selectedFloor.height / 2;
    }
    setTimeout(() => {
      this.selectedUser = user;
      this.showDetailsModal = true;
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
            const timerId = setInterval(() => {
              if (popup.top < 60) {
                this.positionY += Math.abs(popup.top - 60) / 25;
              }
              if (this.isSidebarOnLeft && popup.left < 72) {
                this.positionX += (Math.abs(popup.left) + 72) / 25;
              }
              if (!this.isSidebarOnLeft && popup.left < 0) {
                this.positionX += Math.abs(popup.left) / 25;
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

  public closeDetails() {
    this.selectedUser = null;
    this.showDetailsModal = false;
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
}
</script>

<style lang="scss" scoped>
  .page-container {
    width: 100vw;
    height: 100vh;
    background-color: #E5F0FF;

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
  }
</style>
