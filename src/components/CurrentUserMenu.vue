<template lang="pug">
  .current-user(v-click-outside="closeMenu")
    .user-block(@click.stop="showMenu = !showMenu")
      .user-name(:class="{'arrow-up': showMenu}") {{currentUser.name}}
      img.avatar(
        :src="currentUser.attachment ? currentUser.attachment.link70 : require('../assets/images/def-img.png')"
        :alt="currentUser.name"
      )
    .user-dropdown(v-if="showMenu")
      ul(@click.stop="showMenu = false")
        li logout
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {store} from '@/store';
import ClickOutside from '@/directives/clickOutside';

@Component({
  directives: {ClickOutside},
})
export default class CurrentUserMenu extends Vue {
  public showMenu: boolean = false;

  // public created() {
  //   store.dispatch('getCurrentUser');
  // }

  get currentUser() {
    return {
      name: 'John Doe',
    };
  }

  public logout() {
    this.$gtag.event('Logout', {
      event_category: 'Login/logout',
    });
    localStorage.removeItem('token');
    this.$router.push('/login');
  }

  public closeMenu() {
    this.showMenu = false;
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
        padding: 8px 16px;
        width: 100%;

        &:hover {
          background: #EBEEF2;
        }
      }
    }
  }
</style>
