import {action, getter, Module, mutation, VuexModule} from 'vuex-class-component';
import {PlaceInterface} from '@/interfaces/placeInterface';
import {PlacesBusyInterface} from '@/interfaces/PlacesBusyInterface';
import googleApi from '@/service/googleApi';
import {PlaceTypeEnum} from '@/enums/PlaceTypeEnum';

@Module({namespacedPath: 'googleCalendar'})
export class GoogleStore extends VuexModule {
  @getter public currentPlaceType = PlaceTypeEnum.MEETROOM as string;
  @getter public conferenceRooms = {
    places: {} as PlaceInterface[],
    busy: {} as PlacesBusyInterface,
  };
  @getter public standingTables = {
    places: {} as PlaceInterface[],
    busy: {} as PlacesBusyInterface,
  };

  @mutation
  public setPlaceType(data: string) {
    this.currentPlaceType = data;
  }

  @mutation
  public setConfRoomsBusy(data: PlacesBusyInterface) {
    this.conferenceRooms.busy = data;
  }

  @mutation
  public setTablesBusy(data: PlacesBusyInterface) {
    this.standingTables.busy = data;
  }

  @mutation
  public setPlaces(data: {places: PlaceInterface[], type: PlaceTypeEnum.MEETROOM | PlaceTypeEnum.STANDING_TABLE}) {
    if (data.type === PlaceTypeEnum.MEETROOM) {
      this.conferenceRooms.places = data.places;
      return;
    }
    if (data.type === PlaceTypeEnum.STANDING_TABLE) {
      this.standingTables.places = data.places;
    }
  }

  @action
  public async getCalendarItemsBusy({vm, places, placeType}: any) {
    const calendarsId: any[] = [];
    places.forEach((obj: PlaceInterface) => {
      if (obj.hasOwnProperty('calendarId')) {
        calendarsId.push({
          id: obj.calendarId,
        });
      }
    });
    return googleApi.getGCalendars(vm, calendarsId).then((res: any) => {
        if (res.result.calendars) {
          if (placeType === PlaceTypeEnum.MEETROOM) {
            this.setConfRoomsBusy(res.result.calendars);
            return;
          }
          if (placeType === PlaceTypeEnum.STANDING_TABLE) {
            this.setTablesBusy(res.result.calendars);
          }
        }
      })
      .catch((err: any) => {
        if (placeType === PlaceTypeEnum.MEETROOM) {
          this.setConfRoomsBusy({error: err});
          return;
        }
        if (placeType === PlaceTypeEnum.STANDING_TABLE) {
          this.setTablesBusy({error: err});
        }
      });
  }
}