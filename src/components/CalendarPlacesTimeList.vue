<template lang="pug">
  .container
    google-signin-btn(
      v-if="!isSignInGoogleAccount"
      :label="$t('signInWithGoogle')"
      customClass="sign-in-button"
      @click="$emit('signIn')"
    )
    template(v-if="isSignInGoogleAccount")
      .error-block(v-if="timeList.errors.length")
        .error-message(v-if="timeList.errors[0].reason === 'notFound'") {{$t('permissionGapiError')}}
        .error-message(v-else) {{$t('generalGapiError')}}
      ul.time-list(v-if="!timeList.errors.length")
        li(v-for="time in timeList.list" :key="time.id")
          .time-container(:class="{'busy-label': !time.isFree}")
            .status(:class="{busy: !time.isFree}")
            .time {{time.startTime.format('HH:mm')}}
            .till(v-if="!time.isFree") {{$t('till')}} {{time.till.format('HH:mm')}}
</template>

<script lang="ts">
import {Component, Mixins, Prop} from 'vue-property-decorator';
import CommonMixin from '@/components/mixins/CommonMixin';
import ConfRoomMixin from '@/components/mixins/ConfRoomMixin';
import {TimeListInterface} from '@/interfaces/TimeListInterface';

@Component({})
export default class CalendarPlacesTimeList extends Mixins(CommonMixin, ConfRoomMixin) {
  @Prop({type: Object, default: () => ({
      errors: [],
      list: [],
    }) }) public timeList!: TimeListInterface;
}
</script>

<style lang="scss" scoped>
  .container {
    padding: 16px;
  }

  .time-list {
    li {
      border-bottom: 1px solid #F5F8FC;
      padding: 4px 0;

      &:last-child {
        border-bottom: none;
      }
    }
  }

  .time-container {
    display: flex;
    align-items: center;
    height: 48px;

    &.busy-label {
      background-color: #FFEDED;
      border-radius: 4px;
    }
  }

  .status {
    border-radius: 50%;
    min-width: 6px;
    min-height: 6px;
    margin-left: 16px;
    margin-right: 9px;
    background-color: #31D723;

    &.busy {
      background-color: #FF0000;
    }
  }

  .time{
    flex-grow: 1;
    font: normal normal 14px Inter;
    color: #363A42;
  }

  .till{
    font: normal normal 12px Inter;
    color: #8891A3;
    margin-right: 16px;
  }

  .sign-in-button {
    max-width: 206px;

    /deep/ span.text {
      padding: 0 16px;
    }
  }
</style>
