import {Component, Vue} from 'vue-property-decorator';
import {PLACES} from '@/data/places';
import {vxm} from '@/store';
import moment, {Moment} from 'moment';
import {PlaceInterface} from '@/interfaces/placeInterface';
import {PlacesBusyInterface} from '@/interfaces/PlacesBusyInterface';
import {PlaceTypeEnum} from '@/enums/PlaceTypeEnum';

@Component({})
export default class ConfRoomMixin extends Vue {
  public timeNow: Moment = moment();

  get isSignInGoogleAccount() {
    return vxm.user.isSignInGoogleAccount;
  }

  get placesBusy() {
    return this.placeType === PlaceTypeEnum.MEETROOM ?
      vxm.googleCalendar.conferenceRooms.busy : vxm.googleCalendar.standingTables.busy;
  }

  public placesOfType(type: string): PlacesBusyInterface {
    if (type === PlaceTypeEnum.MEETROOM) {
      return vxm.googleCalendar.conferenceRooms.busy;
    }
    if (type === PlaceTypeEnum.STANDING_TABLE) {
      return vxm.googleCalendar.standingTables.busy;
    }
    return {};
  }

  get placeType() {
    return vxm.googleCalendar.currentPlaceType;
  }

  public isSamePlace(place1: string, place2: string): boolean {
    return place1 === place2;
  }

  public checkFree(
    startTime: Moment,
    endTime: Moment,
    calendarId: string,
    placeType: string,
  ): boolean {
    return this.placesOfType(placeType)[calendarId].busy.every((value: any) => {
      return (
        startTime.isSameOrAfter(moment(value.end)) ||
        endTime.isSameOrBefore(moment(value.start))
      );
    });
  }

  public isBusyNow(
    calendarId: string,
    placeType: string,
  ): boolean {
    return !!this.placesOfType(placeType)[calendarId].busy.find((value: any) => {
      return (
        this.timeNow.isSameOrAfter(moment(value.start)) &&
        this.timeNow.isSameOrBefore(moment(value.end))
      );
    });
  }

  public getTill(
    startTime: Moment,
    endTime: Moment,
    calendarId: string
  ): Moment {
    let result = startTime;
    this.placesBusy[calendarId].busy.forEach((value: any) => {
      const isFree =
        startTime.isSameOrAfter(moment(value.end)) ||
        endTime.isSameOrBefore(moment(value.start));
      if (!isFree && result.isBefore(moment(value.end))) {
        result = moment(value.end);
      }
    });

    if (result.isAfter(endTime)) {
      result = endTime;
    }

    return result;
  }

  public getNextFree(calendarId: string): Moment {
    return this.placesBusy[calendarId].busy.reduce((acc: Moment, value: {start: string, end: string}) => {
      if(acc.isBefore(moment(value.end))) {
        return moment(value.end);
      }
      return acc;
    }, this.timeNow);
  }

  public hasCalendar(room: any): boolean {
    return room.hasOwnProperty('calendarId');
  }

  public getCalendarBusyTimes() {
    return Promise.all([
      vxm.googleCalendar.getCalendarItemsBusy({
        vm: this,
        places: this.filterPlaces(PlaceTypeEnum.MEETROOM),
        placeType: PlaceTypeEnum.MEETROOM,
      }),
      vxm.googleCalendar.getCalendarItemsBusy({
        vm: this,
        places: this.filterPlaces(PlaceTypeEnum.STANDING_TABLE),
        placeType: PlaceTypeEnum.STANDING_TABLE,
      })
    ]);
  }

  protected filterPlaces(placeType: string): PlaceInterface[] {
    let places: PlaceInterface[] = [];
    Object.values(PLACES).forEach((floor: any[]) => {
      floor.forEach((place) => {
        if (this.isSamePlace(placeType, place.placeType)) {
          places = [...places, place];
        }
      });
    });
    return places;
  }
}
