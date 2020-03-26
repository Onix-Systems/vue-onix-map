import Vue from 'vue';
import VueI18n from 'vue-i18n';
import en from '@/translations/en';
import ua from '@/translations/ua';
import store from '@/store';
import {LocaleEnum} from '@/enums/LocaleEnum';


Vue.use(VueI18n);
const messages = {
  [LocaleEnum.En]: en,
  [LocaleEnum.Ua]: ua,
};

export default new VueI18n({
  locale: store.state.locale,
  messages,
  fallbackLocale: LocaleEnum.En,
});
