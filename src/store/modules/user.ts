import {action, getter, Module, mutation, VuexModule} from 'vuex-class-component';
import {CurrentUserInterface} from '@/interfaces/currentUserInterface';
import passportApi from '@/service/passportApi';
import {LocaleEnum} from '@/enums/LocaleEnum';
import me from '@/data/me';

@Module({namespacedPath: 'user'})
export class UserStore extends VuexModule {
  @getter public currentUser = {} as CurrentUserInterface;
  @getter public tokenType = localStorage.token ? JSON.parse(localStorage.token).token_type : '';
  @getter public token = localStorage.token ? JSON.parse(localStorage.token).access_token : '';
  @getter public locale = LocaleEnum.En;
  @getter public isTouchDevice = false;
  @getter public isSignInGoogleAccount = false;

  @mutation
  public setCurrentUser(user: CurrentUserInterface) {
    this.currentUser = user;
  }

  @mutation
  public setToken(token: string) {
    this.token = token;
  }

  @mutation
  public setTokenType(tokenType: string) {
    this.tokenType = tokenType;
  }

  @mutation
  public setLocale(locale: LocaleEnum) {
    this.locale = locale;
  }

  @mutation
  public changeTouchDevice(isTouch: boolean) {
    this.isTouchDevice = isTouch;
  }

  @mutation
  public setSignInGoogleAccount(value: boolean) {
    this.isSignInGoogleAccount = value;
  }

  @action
  public async getCurrentUser() {
    if (process.env.VUE_APP_DEMO_MODE) {
      return me;
    }
    return passportApi.getCurrentUser().then((res) => {
      if (res.data) {
        this.setCurrentUser(res.data);
      }
    });
  }
}