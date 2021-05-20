import {Component, Vue} from 'vue-property-decorator';
import {LocaleEnum} from '@/enums/LocaleEnum';
import {PlaceInterface} from '@/interfaces/placeInterface';
import {PlaceTypeEnum} from '@/enums/PlaceTypeEnum';

@Component({
  filters: {
    capitalize(value: any) {
      if (!value) {
        return '';
      }
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
  },
})
export default class CommonMixin extends Vue {
  public env = process.env;
  public localeEnum = LocaleEnum;

  public copyToClipboard(value: string) {
    const dummy = document.createElement('textarea');
    document.body.appendChild(dummy);
    dummy.value = value;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
    this.$notify({
      group: 'foo',
      type: 'success',
      title: 'Copied!',
      text: 'Data was copied to clipboard',
    });
    this.$gtag.event('Copy info', {
      event_category: 'Search users',
      event_label: value,
    });
  }

  public copyUrl() {
    this.copyToClipboard(window.location.href);
  }
  public toTheCalendar(place: PlaceInterface) {
    window.open(
      `https://calendar.google.com/calendar/u/0/r/eventedit?add=${
        place.calendarId}&text=${place.placeType === PlaceTypeEnum.MEETROOM ? 'Room': 'Table'} book&details=${place.name.en}`,
      '_blank'
    );
    this.$gtag.event('Click on google calendar link', {
      event_category: 'Search places',
    });
  }

  public getTranslate(field: any) {
    if (field.hasOwnProperty(this.$i18n.locale)) {
      return field[this.$i18n.locale];
    }
    if (field.hasOwnProperty(this.$i18n.fallbackLocale)) {
      return field[this.$i18n.fallbackLocale];
    }
    return field;
  }

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  // https://levelup.gitconnected.com/debounce-in-javascript-improve-your-applications-performance-5b01855e086
  public debounce(func: any, wait: number, immediate: boolean) {
    let timeout: number | undefined;

    return function executedFunction() {
      // @ts-ignore
      const context = this;
      const args = arguments;

      const later = () => {
        timeout = undefined;
        if (!immediate) {
          func.apply(context, args);
        }
      };

      const callNow = immediate && !timeout;

      clearTimeout(timeout);

      timeout = setTimeout(later, wait);

      if (callNow) {
        func.apply(context, args);
      }
    };
  }
}
