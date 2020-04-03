<template lang="pug">
  .current-user(v-click-outside="closeMenu")
    .user-block(@click="showMenu = !showMenu")
      .user-name(:class="{'arrow-up': showMenu}") {{currentUser.name}}
      img.avatar(
        :src="currentUser.attachment ? currentUser.attachment.link70 : require('../assets/images/def-img.png')"
        :alt="currentUser.name"
      )
    .user-dropdown(v-if="showMenu" :class="{'can-touch': canTouch}")
      ul(v-if="!showLanguageList" @click.stop="showMenu = false")
        li(@click.stop="showLanguageList = true") {{$tc('language')}}: {{$t('languageName')}}
        li(@click="logout") {{$t('logout')}}
      .language-list-block(v-if="showLanguageList")
        .language-list-label-block
          img(:src="require('../assets/images/header-icons/places/arrow.svg')" @click.stop="showLanguageList = false")
          .language-list-label {{$tc('language', 2)}}
        .language-list-name(@click.stop="setLanguage(localeEnum.En)") English
        .language-list-name(@click.stop="setLanguage(localeEnum.Ua)") Українська
</template>

<script lang="ts">
import {Component, Mixins} from 'vue-property-decorator';
import {store} from '@/store';
import ClickOutside from '@/directives/clickOutside';
import CommonMixin from '@/components/mixins/CommonMixin';

@Component({
  directives: {ClickOutside},
})
export default class CurrentUserMenu extends Mixins(CommonMixin) {
  public showMenu: boolean = false;
  public showLanguageList: boolean = false;

  // public created() {
  //   store.dispatch('getCurrentUser');
  // }

  get currentUser() {
    return {
      name: 'John Doe',
    };
  }

  get canTouch() {
    return store.state.isTouchDevice;
  }

  public logout() {
    this.$gtag.event('Logout', {
      event_category: 'Login/logout',
    });
    localStorage.removeItem('token');
    this.$router.push('/login');
  }

  public setLanguage(locale: string) {
    store.commit('setLocale', locale);
    this.$i18n.locale = locale;
    this.showMenu = false;
    this.showLanguageList = false;
    this.$gtag.event('Set language', {
      event_category: 'Settings',
      event_label: locale,
    });
  }

  public closeMenu() {
    this.showMenu = false;
  }

  public clickOnMyProfile() {
    this.$gtag.event('My profile', {
      event_category: 'Navigate',
      event_label: this.currentUser.name,
    });
  }
}
</script>

<style lang="scss" scoped>
  @import "../assets/scss/media";

  .user-block {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .user-name {
    position: relative;
    display: flex;
    padding-right: 14px;
    width: max-content;
    height: 100%;
    text-align: center;
    font: normal normal 16px Inter, sans-serif;
    line-height: 19px;
    margin-right: 15px;
    @media only screen and (max-width: 1300px) {
      display: none;
    }

    &:after {
      content: "";
      position: absolute;
      background: url("../assets/images/header-icons/header_down-arrow.svg") no-repeat;
      width: 6px;
      height: 4px;
      top: calc(50% - 2px);
      right: 0;
      transition: transform 500ms;
    }

    &.arrow-up {
      &:after {
        transform: rotate(180deg);
      }
    }
  }

  .avatar {
    min-width: 40px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    flex-grow: 1;
  }

  .user-dropdown {
    position: absolute;
    display: flex;
    right: 15px;
    border: 1px solid #E2E6ED;
    box-shadow: 0 4px 8px rgba(43, 44, 48, 0.1);
    border-radius: 4px;
    background: #FFFFFF;
    min-width: 150px;
    max-width: 400px;

    ul {
      font-weight: normal;
      font-size: 14px;
      line-height: 32px;
      display: flex;
      flex-direction: column;
      width: 100%;

      li {
        cursor: pointer;
        text-transform: capitalize;
        width: 100%;
        &:not(.link) {
          padding: 8px 16px;
        }

        a {
          display: flex;
          color: inherit;
          text-decoration: none;
          padding: 8px 16px;
        }

        &:hover {
          background: #EBEEF2;
        }
      }
    }
    &.can-touch {
      ul li:hover, .language-list-block .language-list-name:hover {
        background: none;
      }
    }
  }

  .language-list-block {
    width: 100%;
  }

  .language-list-label-block {
    display: flex;
    padding: 24px 0 24px 15px;
    img {
      cursor: pointer;
    }
  }

  .language-list-label {
    font: normal 600 14px Inter, sans-serif;
    line-height: 17px;
    padding-left: 15px;
    text-transform: capitalize;
  }

  .language-list-name {
    font: normal normal 12px Inter, sans-serif;
    line-height: 15px;
    padding: 16px 0 16px 45px;
    border-bottom: 1px solid #F6F8FC;
    cursor: pointer;

    &:hover {
      background: #EBEEF2;
    }

    &:last-child {
      border-bottom: none;
    }
  }
</style>
