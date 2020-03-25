<template lang="pug">
  .dropdown-container 
    .text coming soon
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';

@Component
export default class HeaderDropdown extends Vue {

}

</script>

<style lang="scss" scoped>
  .dropdown-container {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    top: 43px;
    position: absolute;
    width: 310px;
    height: 310px;
    right: 0; //- temporary solution for non-user header structure
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #E2E6ED;
    box-shadow: 0px 4px 8px rgba(43, 44, 48, 0.1);

    .text {
      text-align: center;
      opacity: 0.7;
      margin-bottom: 5px;
    }
  }
</style>