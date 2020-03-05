<template lang="pug">
  .lds-facebook
    div
    div
    div
</template>

<style lang="scss" scoped>
  .lds-facebook {
    display: inline-block;
    width: 80px;
    height: 80px;
    position: fixed;
    top: 50%;
    left: 50%;
    margin-left: -40px;
    margin-top: -40px;
    div {
      display: inline-block;
      position: absolute;
      left: 8px;
      width: 16px;
      background: #cacac2;
      animation: lds-facebook 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;
      &:nth-child(1) {
        left: 8px;
        animation-delay: -0.24s;
      }
      &:nth-child(2) {
        left: 32px;
        animation-delay: -0.12s;
      }
      &:nth-child(3) {
        left: 56px;
        animation-delay: 0s;
      }
    }
  }
  @keyframes lds-facebook {
    0% {
      top: 8px;
      height: 64px;
    }
    50%, 100% {
      top: 24px;
      height: 32px;
    }
  }

</style>
