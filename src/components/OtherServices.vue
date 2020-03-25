<template lang="pug">
  .services-block
    ul
      li(v-for="service in services" :key="service.id")
        a.service(
          :href="service.link"
          target="blank"
          :title="service.name"
          @click="clickOnService(service)"
        )
          .icon
            img(:src="require('../assets/images/header-icons/services/' + service.icon)")
          .service-label {{service.name}}
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {SERVICES} from '@/data/services';
import {ServiceInterface} from '@/interfaces/serviceInterface';

@Component({})
export default class OtherServices extends Vue {
  public services: ServiceInterface[] = SERVICES;

  public clickOnService(service: ServiceInterface) {
    this.$parent.$emit('close-dropdown');
    this.$gtag.event('Click on other service', {
      event_category: 'Navigate',
      event_label: service.name,
    });
  }
}
</script>

<style lang="scss" scoped>
  @import "../assets/scss/media";

  .services-block {
    display: flex;
    flex-direction: column;
    justify-content: center;
    top: 43px;
    position: absolute;
    width: 255px;
    right: 0;
    padding: 4px 12px;
    margin: 0 !important;
    background-color: #ffff;
    border-radius: 4px;
    border: 1px solid #E2E6ED;
    box-shadow: 0 4px 8px rgba(43, 44, 48, 0.1);
    @include media_mobile {
      top: 54px;
      right: 12px;
    }

    ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      font: normal 12px Inter, sans-serif;
      font-weight: 500;
      line-height: 15px;

      li {
        padding: 20px 0;
        width: 60px;
      }
    }

    .service {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #363A42;
      text-decoration: none;

      &:hover {
        .icon {
          background: #EBEEF2;
        }
      }
    }

    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      background: #F2F7FF;
      border-radius: 50%;
    }

    .service-label {
      padding-top: 8px;
    }
  }
</style>
