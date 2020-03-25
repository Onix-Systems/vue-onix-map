import {Component, Vue} from 'vue-property-decorator';

@Component
export default class CommonMixin extends Vue {
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
  public toTheCalendar() {
    window.open('https://calendar.google.com/calendar/r', '_blank');
    this.$gtag.event('Click on google calendar link', {
      event_category: 'Search places',
    });
  }
}
