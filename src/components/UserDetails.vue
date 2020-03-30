<template lang="pug">
  //- user pop-up
  .user-details(v-if="showDetailsModal" :style="popUpStyles" ref="popupContainer")
    .popup-body(ref="popupBody")
      .user-img
        img(:src="user.attachment ? user.attachment.link70 : require('../assets/images/def-img.png')")
      .user-info
        .data-row.place {{user.tableNumber ? `${$tc('place')} ${user.tableNumber}` : $t('remote')}}
          .copy-url(@click="copyUrl")
            img(:src="require('@/assets/images/copy-url.svg')" :title="`${$t('copy')} url` | capitalize")
        .data-row.name
          span {{$i18n.locale === localeEnum.En ? `${user.firstName} ${user.lastName}` : `${user.firstNameRu} ${user.lastNameRu}`}}
          i.status(:class="{vocation: checkUserOnVacation}")
            .tooltip
              span {{checkUserOnVacation ? $t('vacation') : $t('inOffice')}}
        .data-row.role(v-if="userRoles")
          span(v-for="(role, i) in userRoles") {{role + (userRoles.length - 1 === i ? '' : ', ')}}
        .data-row.phone(v-if="user.phone" @click="copyToClipboard(user.phone)")
          | {{user.phone}}
        .data-row.gmail(v-if="user.gmailId" @click="copyToClipboard(user.gmailId)")
          | {{user.gmailId}}
        .data-row.skype(v-if="user.skypeId" @click="copyToClipboard(user.skypeId)")
          | {{user.skypeId}}
        .data-row.tech(v-if="userTechnologies.length")
          span(v-for="(tech, i) in userTechnologies") {{tech.name + (userTechnologies.length - 1 === i ? '' : ', ')}}
      button.close(@click="closeDetails")
    .arrow(v-if="user.tableNumber")
</template>

<script lang="ts">
import {Component, Prop, Mixins} from 'vue-property-decorator';
import CommonMixin from '@/components/mixins/CommonMixin';
import UserMixin from '@/components/mixins/UserMixin';
import {LocaleEnum} from '@/enums/LocaleEnum';


@Component({})
export default class UserDetails extends Mixins(CommonMixin, UserMixin) {
  @Prop(Boolean) public showDetailsModal!: boolean;
  @Prop(String) public popUpStyles!: boolean;
  public localeEnum = LocaleEnum;
  public closeDetails() {
    this.$router.push(this.$route.path);
    this.$emit('closed');
  }
}
</script>

<style lang="scss" scoped>
  .user-details {
    position: fixed;
    overflow: hidden;

    .popup-body {
      padding: 16px;
      background-color: #ffffff;
      border: 1px solid #d2d4cf;
      border-radius: 4px;
      display: flex;
      position: relative;

      .user-img {
        display: flex;
        align-items: center;
        padding-right: 16px;
        width: 80px;
        height: 64px;
        justify-content: center;

        img {
          max-height: 100%;
          max-width: 100%;
          border-radius: 50%;
        }
      }

      .user-info {
        display: flex;
        flex-direction: column;
        font-family: 'Inter', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 12px;
        line-height: 15px;
        width: 204px;

        .data-row {
          padding-left: 20px;
          background-size: 12px;
          background-position: 0 25%;
          background-repeat: no-repeat;
          color: #363A42;

          &.place {
            color: #8891A3;
            padding: 0;
            display: flex;
            align-items: center;
            text-transform: capitalize;

            .copy-url {
              border-radius: 50%;
              background: #E5F0FF;
              width: 16px;
              height: 16px;
              display: flex;
              justify-content: center;
              align-items: center;
              margin-left: 8px;
              cursor: pointer;

              &:hover {
                background: #d2e5ff;
              }
            }
          }

          &.name {
            color: #363A42;
            font-weight: 600;
            font-size: 14px;
            line-height: 17px;
            padding: 8px 0;
            display: flex;
            align-items: center;

            span {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              padding-right: 10px;
            }

            .status {
              &:before {
                display: block;
                content: '';
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background-color: #28a745;
              }

              .tooltip {
                display: none;
                width: 0;
                height: 0;
                overflow: visible;
                margin-left: -20px;
                margin-top: -27px;
                font-size: 11px;
                font-style: normal;
                text-shadow: none;

                span {
                  color: #ffffff;
                  background: #555555;
                  border-radius: 6px;
                  padding: 0 5px;
                  text-transform: capitalize;
                }
              }

              &:hover {
                .tooltip {
                  display: block;
                }

                &:before {
                  margin-top: -5px;
                }
              }

              &.vocation:before {
                background-color: #dc3545;
              }
            }
          }

          &.role {
            color: #8891A3;
            padding: 0;
          }

          &.gmail, &.skype, &.phone, &.tech {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-top: 12px;
            height: 16px;
          }

          &.gmail, &.skype, &.phone {
            position: relative;
            padding-right: 20px;
            cursor: pointer;

            &:after {
              display: none;
              content: "";
              background: url("../assets/images/copy.svg") no-repeat;
              position: absolute;
              width: 16px;
              height: 16px;
              top: 0;
              right: 0;
            }

            &:hover {
              &:after {
                display: block;
              }
            }
          }

          &.phone {
            background-image: url("../assets/images/tel.svg");
            margin-top: 22px;
          }

          &.skype {
            background-image: url("../assets/images/skype-blue.svg");
          }

          &.gmail {
            background-image: url("../assets/images/mail.svg");
            background-position: 0 50%;
          }

          &.tech {
            background-image: url("../assets/images/user-tech.svg");
          }
        }
      }

      .close {
        position: absolute;
        right: 16px;
        top: 16px;
        border: none;
        background: url("../assets/images/close.svg") no-repeat;
        padding: 6px;
        cursor: pointer;
      }
    }

    .arrow {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: -2px;

      &:after, &:before {
        content: '';
        display: block;
        left: 100%;
        width: 0;
        height: 0;
        border-style: solid;
      }

      &:after {
        margin-left: -21px;
        margin-top: -1px;
        border-color: #ffffff transparent transparent transparent;
        border-width: 10px;
        z-index: 1;
      }

      &:before {
        margin-top: 1px;
        margin-left: 5px;
        border-color: #d2d4cf transparent transparent transparent;
        border-width: 11px;
      }
    }
  }
</style>
