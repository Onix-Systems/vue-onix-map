import moment from 'moment';

export default {
  getGCalendars(vm: any, calendarsId: any[]) {
    return vm.$gapi.request({
      path: 'https://www.googleapis.com/calendar/v3/freeBusy',
      method: 'POST',
      body: {
        items: calendarsId,
        timeMin: moment({hour: 8}).format(),
        timeMax: moment({hour: 20}).format(),
      },
    });
  }
}