<template lang="pug">
  .user-block(@click="isExpand = !isExpand" :class="{expand: isExpand}")
    .user-main-info
      .user-photo
        img(:src="user.attachment ? user.attachment.link70 : require('../assets/images/def-img.png')")
      .user-name
        .additional-info
          .place {{user.tableNumber ? `${$tc('place')} ${user.tableNumber}` : $t('remote')}}
          .sorted-info {{ sortedInfo }}
        .full-name(
          v-html="$i18n.locale === localeEnum.En ? $options.filters.wrapText(user.firstName + ' ' + user.lastName, query) : $options.filters.wrapText(user.firstNameRu + ' ' + user.lastNameRu, query)"
        )
        .user-role(v-if="userRoles")
          span(v-for="(role, i) in userRoles") {{role + (userRoles.length - 1 === i ? '' : ', ')}}
      img.pin-icon(:src="require('../assets/images/pin.svg')" @click="$emit('selectUser')")
      img.down-icon(:src="require('../assets/images/header-icons/header_down-arrow.svg')" :class="{'arrow-up': isExpand}")
    .user-contacts
      .skype(v-if="user.skypeId" @click.stop="copyToClipboard(user.skypeId)")
        | {{user.skypeId}}
      .tel(v-if="user.phone" @click.stop="copyToClipboard(user.phone)")
        | {{user.phone}}
      .email(v-if="user.email" @click.stop="copyToClipboard(user.email)")
        | {{user.email}}
      .email(v-if="user.gmailId" @click.stop="copyToClipboard(user.gmailId)")
        | {{user.gmailId}}
</template>

<script lang="ts">
import {Component, Prop, Mixins} from 'vue-property-decorator';
import CommonMixin from '@/components/mixins/CommonMixin';
import {SearchSortEnum} from '@/enums/SearchSortEnum';
import moment from 'moment';
import UserMixin from '@/components/mixins/UserMixin';
import {LocaleEnum} from '@/enums/LocaleEnum';

@Component({
  name: 'UserSearchCard',
})
export default class UserSearchCard extends Mixins(CommonMixin, UserMixin) {
  @Prop({type: String, default: ''}) public query!: string;
  @Prop({type: String, default: SearchSortEnum.Floor}) public sort!: string;
  public isExpand: boolean = false;
  public localeEnum = LocaleEnum;

  get sortedInfo() {
    if (this.sort === SearchSortEnum.NearestBirthday) {
      return `${this.$t('birthday')}: ` + (this.user.birthDate ? moment(this.user.birthDate).format('DD/MM/YYYY') : this.$t('unknown'));
    }

    if (this.sort === SearchSortEnum.Experience) {
      return `${this.$t('birthday')}: ` + (this.user.birthDate ? moment(this.user.workStartDate).format('DD/MM/YYYY') : this.$t('unknown'));
    }

    return (this.user.tableNumber ? `${this.$tc('floor')}: ` + Math.floor(parseInt(this.user.tableNumber, 10) / 100) : '');
  }
}
</script>

<style lang="scss" scoped>
  @import "../assets/scss/media";

  .user-block {
    width: 250px;
    height: 218px;
    color: #000000;
    border: 1px solid #F1F1F1;
    font-family: 'Open Sans', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    @include media_tablet {
      cursor: pointer;
    }
    @media only screen and (max-width: 539px) {
      width: 100%;
      height: auto;
      border: none;
      border-bottom: 1px solid #F1F1F1;
    }

    .user-main-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 34px;
      width: 100%;
      @media only screen and (max-width: 539px) {
        flex-direction: row;
        padding: 16px;
      }

      .pin-icon {
        display: none;
        cursor: pointer;
        margin-left: auto;
        @media only screen and (max-width: 539px) {
          display: block;
        }
      }

      .down-icon {
        display: none;
        cursor: pointer;
        margin: 0 16px 0 24px;
        transition: transform 500ms;
        @media only screen and (max-width: 539px) {
          display: block;
        }

        &.arrow-up {
          transform: rotate(180deg);
        }
      }

      .user-photo {
        img {
          width: 56px;
          height: 56px;
          border-radius: 50%;
        }
      }

      .user-name {
        display: flex;
        flex-direction: column;
        @media only screen and (max-width: 539px) {
          padding-left: 8px;
        }

        .user-role {
          font-weight: 600;
          color: #888888;
          margin-top: 12px;
          align-self: center;
          @media only screen and (max-width: 539px) {
            margin-top: 4px;
            align-self: flex-start;
            font: normal normal 14px Inter, sans-serif;
            line-height: 17px;
            color: #979797;
          }
        }

        .additional-info {
          display: none;
          flex-direction: column;
          font-family: 'Inter', sans-serif;
          font-style: normal;
          font-weight: normal;
          font-size: 12px;
          line-height: 15px;
          color: #979797;
          text-transform: capitalize;
          @media only screen and (max-width: 539px) {
            display: flex;
          }
        }

        .full-name {
          font-weight: bold;
          font-size: 18px;
          line-height: 21px;
          text-align: center;
          color: #232323;
          padding-top: 16px;
          @media only screen and (max-width: 539px) {
            padding-top: 5px;
            text-align: left;
          }

          /deep/
          span {
            background-color: #fde910;
            font-style: normal;
            display: inline-block;
            padding: 0 1px;
            margin-bottom: 0;
            margin-top: -3px;
            line-height: 19px;
            color: #333333;
            text-align: center;
            text-shadow: 0 1px 1px rgba(255, 255, 255, 0.75);
            vertical-align: middle;
            background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#fcdd76), to(#ffd700));
            background-image: -webkit-linear-gradient(top, #fcdd76, #ffd700);
            background-image: -o-linear-gradient(top, #fcdd76, #ffd700);
            background-image: linear-gradient(to bottom, #fcdd76, #ffd700);
            background-image: -moz-linear-gradient(top, #fcdd76, #ffd700);
            background-repeat: repeat-x;
            border: 1px solid #bbbbbb;
            border-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);
            border-color: #ffd700 #ffd700 #bfbfbf;
            border-bottom-color: #a2a2a2;
            -webkit-border-radius: 4px;
            -moz-border-radius: 4px;
            border-radius: 4px;
            filter: progid:dximagetransform.microsoft.gradient(startColorstr='#fcdd76ff', endColorstr='#ffffd700', GradientType=0);
            filter: progid:dximagetransform.microsoft.gradient(enabled=false);
            -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);
            -moz-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);
          }
        }
      }
    }

    .user-contacts {
      display: none;
      flex-direction: column;
      width: 100%;

      .skype, .tel, .email {
        padding-left: 36px;
        padding-right: 36px;
        padding-bottom: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        position: relative;
        cursor: pointer;

        &:hover {
          &:after {
            display: block;
          }
        }

        &:before {
          content: "";
          position: absolute;
          width: 12px;
          height: 12px;
          top: 2px;
          left: 16px;
        }

        &:after {
          display: none;
          content: "";
          background: url("../assets/images/copy.svg") no-repeat;
          position: absolute;
          width: 16px;
          height: 16px;
          top: 0;
          right: 6px;

        }
      }

      .skype {
        &:before {
          background: url("../assets/images/skype-blue.svg") no-repeat;
        }
      }

      .tel {
        &:before {
          background: url("../assets/images/tel.svg") no-repeat;
        }
      }

      .email {
        &:before {
          background: url("../assets/images/mail.svg") no-repeat;
        }
      }
    }

    &:hover {
      @media only screen and (min-width: 1025px) {
        .user-role{
          display: none;
        }
        align-items: flex-start;
        background: #F8FAFE;

        .user-main-info {
          flex-direction: row;
          padding: 16px;

          .pin-icon {
            display: block;
          }

          .user-name {
            padding-left: 8px;

            .additional-info {
              display: flex;
            }

            .full-name {
              flex-direction: row;
              font-weight: 600;
              font-size: 14px;
              line-height: 19px;
              padding-top: 5px;
              text-align: left;
            }
          }
        }

        .user-contacts {
          display: flex;
        }
      }
    }

    &.expand {
      @media only screen and (min-width: 540px) and (max-width: 1024px){
        align-items: flex-start;
        background: #F8FAFE;

        .user-main-info {
          flex-direction: row;
          padding: 16px;

          .pin-icon {
            display: block;
          }

          .user-name {
            padding-left: 8px;

            .user-role{
              display: none;
            }

            .additional-info {
              display: flex;
            }

            .full-name {
              flex-direction: row;
              font-weight: 600;
              font-size: 14px;
              line-height: 19px;
              padding-top: 5px;
              text-align: left;
            }
          }
        }

        .user-contacts {
          display: flex;
          .skype, .tel, .email {
            &:after {
              display: block;
            }
          }
        }
      }

      @media only screen and (max-width: 539px) {
        .user-contacts {
          display: flex;
          background: #F8FAFE;
          padding-top: 16px;
          border-top: 1px solid #F1F1F1;

          .skype, .tel, .email {
            &:after {
              display: block;
            }
          }
        }
      }
    }
  }
</style>
