import {Moment} from 'moment';

export interface ConfRoomTimeListInterface {
  id: number;
  startTime: Moment;
  endTime: Moment;
  isFree: boolean;
  till: Moment;
}
