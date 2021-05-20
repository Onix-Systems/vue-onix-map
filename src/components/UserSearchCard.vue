<template lang="pug">
  .user-block(@click="isExpand = !isExpand" :class="{expand: isExpand}")
    .user-main-info
      .user-photo
        a(
          :href="`${env.VUE_APP_PASSPORT_API_URL}/employees/${user.id}`"
          target="blank"
          @click="checkUserLinkStatistics"
        )
          img(:src="user.attachment ? user.attachment.link70 : require('../assets/images/def-img.png')")
        .lvl-icon-wrapper(v-if="section === 'skills'" :class="skillLevel")
          .lvl-icon(:class="skillLevel")
      .user-name
        .additional-info
          .place {{user.tableNumber ? `${$tc('place')} ${user.tableNumber}` : $t('remote')}}
          .sorted-info {{ sortedInfo }}
        a.full-name(
          :href="`${env.VUE_APP_PASSPORT_API_URL}/employees/${user.id}`"
          target="blank"
          @click="clickOnName($event)"
          v-html="$i18n.locale === localeEnum.En ? $options.filters.wrapText(user.firstName + ' ' + user.lastName, query) : $options.filters.wrapText(user.firstNameRu + ' ' + user.lastNameRu, query)"
        )
        .user-role(v-if="userRoles")
          div(v-for="(role, i) in userRoles") {{role + (userRoles.length - 1 === i ? '' : ', ')}}
          .user-skills(v-if="section === 'skills' && !isExpand") {{skill}}

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
import {SkillInterface} from '@/interfaces/skillInterface';
import {UserExperienceEnum} from '@/enums/UserExperienceEnum';

@Component({
  name: 'UserSearchCard',
})
export default class UserSearchCard extends Mixins(CommonMixin, UserMixin) {
  @Prop({type: String, default: ''}) public query!: string;
  @Prop({type: String, default: SearchSortEnum.Floor}) public sort!: string;
  @Prop({type: String, default: ''}) public section!: string;
  @Prop({type: Array, default: () => []}) public skillList!: string[];
  public isExpand = false;
  public skill = '';
  public skillLevel = 'none';
  public userExpEnum = UserExperienceEnum;

  public mounted() {
    this.skill = this.getSkillToView();
  }

  get sortedInfo() {
    if (this.sort === SearchSortEnum.NearestBirthday) {
      return `${this.$t('birthday')}: ` +
        (this.user.birthDate ? moment(this.user.birthDate).format('DD/MM/YYYY') : this.$t('unknown'));
    }

    if (this.sort === SearchSortEnum.Experience) {
      return `${this.$t('workStart')}: ` +
        (this.user.workStartDate ? moment(this.user.workStartDate).format('DD/MM/YYYY') : this.$t('unknown'));
    }

    return (this.user.tableNumber ? `${this.$tc('floor')}: ` + Math.floor(parseInt(this.user.tableNumber, 10) / 100) : '');
  }

  public clickOnName($event: Event) {
    window.innerWidth > 1024 ? this.checkUserLinkStatistics() : $event.preventDefault();
  }

  public getSkillToView(): string {
    let result = '';
    if (this.user.filteredSkillLvl) {
      /* set user level for the image icon */
      switch (this.user.filteredSkillLvl) {
        case this.userExpEnum.WANT_TO_LEARN:
          this.skillLevel = 'want';
          break;
        case this.userExpEnum.SOME_KNOWLEDGE:
          this.skillLevel = 'some';
          break;
        case this.userExpEnum.GOOD_KNOWLEDGE:
          this.skillLevel = 'good';
          break;
        case this.userExpEnum.EXPERIENCED:
          this.skillLevel = 'experienced';
          break;
        case this.userExpEnum.EXPERT:
          this.skillLevel = 'expert';
          break;
        default: this.skillLevel = 'none';
      }
      result = `${this.user.filteredSkillName} : ${this.user.filteredSkillLvl}`; // TODO refactor this useless result
    }
    return result;
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
    @include media_tablet {
      cursor: pointer;
    }
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
      position: relative;
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
        text-align: center;
        font-weight: 600;
        color: #888888;
        margin-top: 12px;
        @media only screen and (max-width: 539px) {
          margin-top: 4px;
          align-self: flex-start;
          font: normal normal 14px Inter, sans-serif;
          line-height: 17px;
          color: #979797;
        }
      }

      .user-skills {
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin-top: 8px;
        align-items: center;
        font: normal normal 12px Inter, sans-serif;
        color: #888888;

        @media only screen and (max-width: 539px) {
          text-align: start;
          align-self: flex-start;
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
        text-decoration: none;
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
      .user-role, .user-skills {
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
        .lvl-icon-wrapper {
          display: none;
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
    @media only screen and (min-width: 540px) and (max-width: 1024px) {
      .lvl-icon-wrapper {
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

          .user-role {
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
      .lvl-icon-wrapper {
        display: none;
      }
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

  .lvl-icon-wrapper {
    position: absolute;
    width: 24px;
    height: 24px;
    background-color: #fff;
    right: -6px;
    bottom: 0;
    border-radius: 50%;
    border: 1px solid rgba(#000000, .1);
    &.want, &.none {
      display: none;
    }
  }

  .lvl-icon {
    margin: 2px auto;
    height: 18px;
    width: 18px;
    mask-size: cover;
    background-color: rgba(#0070dd, 1);
    &.want, &.none {
      background-color: transparent;
    }
    &.some {
      mask-image: url("../assets/images/experience/chevron_4.svg");
    }
    &.good {
      mask-image: url("../assets/images/experience/chevron_3.svg");
    }
    &.experienced {
      mask-image: url("../assets/images/experience/chevron_2.svg");
    }
    &.expert {
      margin-top: 1px;
      mask-image: url("../assets/images/experience/chevron_1.svg");
    }
  }
}
</style>
