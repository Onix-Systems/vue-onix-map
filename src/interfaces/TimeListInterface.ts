import { Moment } from 'moment';

export interface TimeListInterface {
  [key: string]: {
    endTime: Moment
    id: number
    isFree: true
    startTime: Moment
    till: Moment
  }
}
