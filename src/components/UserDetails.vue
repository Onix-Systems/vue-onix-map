<template lang="pug">
  .user-details(v-if="showDetailsModal" :style="popUpStyles" ref="popupContainer")
    .popup-body(ref="popupBody")
      .user-img
        img(:src="selectedUser.attachment ? selectedUser.attachment.link70 : require('../assets/images/def-img.png')")
      .user-info
        .data-row.place {{selectedUser.tableNumber ? `Place ${selectedUser.tableNumber}` : 'Remote'}}
        .data-row.name
          span {{selectedUser.firstName}} {{selectedUser.lastName}}
          i.status(:class="{vocation: selectedUser.isVacation}")
            .tooltip
              span {{selectedUser.isVacation ? 'Vacation' : 'In Office'}}
        .data-row.phone(v-if="selectedUser.phone" @click="copyToClipboard(selectedUser.phone)")
          | {{selectedUser.phone}}
        .data-row.gmail(v-if="selectedUser.gmailId" @click="copyToClipboard(selectedUser.gmailId)")
          | {{selectedUser.gmailId}}
        .data-row.skype(v-if="selectedUser.skypeId" @click="copyToClipboard(selectedUser.skypeId)")
          | {{selectedUser.skypeId}}
        .data-row.tech(v-if="selectedUser.technologies.length")
          span(v-for="(tech, i) in selectedUser.technologies") {{tech.name + (selectedUser.technologies.length - 1 === i ? '' : ', ')}}
      button.close(@click="closeDetails")
    .arrow(v-if="selectedUser.tableNumber")
</template>

<script lang="ts">
import {UserInterface} from '@/interfaces/userInterface';
import {Component, Prop, Mixins} from 'vue-property-decorator';
import CommonMixin from '@/components/mixins/CommonMixin';


@Component({})
export default class UserDetails extends Mixins(CommonMixin) {
  @Prop(Boolean) public showDetailsModal!: boolean;
  @Prop(String) public popUpStyles!: boolean;
  @Prop({default: null}) public selectedUser!: UserInterface;
  public closeDetails() {
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
        font-family: Inter, sans-serif;
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

          &.gmail, &.skype, &.phone, &.tech {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-top: 12px;
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