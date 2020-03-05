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
  }
}
