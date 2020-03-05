<template lang="pug">
  .wrapper(v-bind:class="[{'button-active': isActive}]")
    div(
      v-on:click="isActive = true"
      v-bind:class="[isTitleEmpty ? 'button-non-text-container' : 'button-text-container']" )
        img(:src="icon" alt='')
        .text(v-if="!isTitleEmpty") {{title}}
    header-dropdown(v-if="isActive" v-click-outside="closeDropdown" v-bind:data="data" v-on:select-data="emitSelect" v-bind:dummy="dummy")
    //- v-bind:style="[text == '' ? {left: -140 + 'px'} : '']" - temporary solution for non-user header structure
</template>

<script lang="ts">
import HeaderDropdown from '@/components/HeaderDropdown.vue';

import {Component, Vue, Prop} from 'vue-property-decorator';
import ClickOutside from '@/directives/clickOutside';

@Component({
  components: {HeaderDropdown},
  directives: {ClickOutside},
})
export default class HeaderButton extends Vue {
  @Prop({default: ''}) private title !: string;
  @Prop({default: ''}) private icon !: string;
  @Prop({}) private data !: object;

  @Prop({default: false}) private dummy !: boolean;

  private isActive: boolean;

  constructor() {
    super();
    this.isActive = false;
  }

  public emitSelect(obj: any) {
    this.$emit('select-data', obj);
  }

  get isTitleEmpty(): boolean {
    return this.title === '';
  }

  private closeDropdown() {
    this.isActive = false;
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/scss/media";
.wrapper {
  position: relative;
  @include media_mobile {
    position: initial;
  }
}
.button-text-container, .button-non-text-container {
  display: flex;
  height: 36px;
  justify-content: center;
  align-items:center;
  user-select: none;
  white-space: nowrap;
}

.button-text-container {
  border-radius: 20px;
  background-color: #e5f0ff;
  @include media_tablet {
    border-radius: 50%;
    width: 36px;
    height: 36px;
  }
  &:hover {
    cursor: pointer;
    .text {
      opacity: 0.8;
    }
  }
  img {
    padding: 0 10px 0 20px;
    @include media_tablet {
      padding: 0;
    }
  }
  .text {
    opacity: 0.7;
    padding-right: 40px;
    @include media_tablet {
      display: none;
    }
    &:after {
      position: absolute;
      font-size: 10px;
      top: 12px;
      right: 25px;
      transition: transform 0.5s;
      content: url("../assets/images/header-icons/header_down-arrow.svg");
    }
  }
}

.button-non-text-container {
  &:hover {
    cursor: pointer;
  }
  filter: brightness(0.8) invert(0.48);
}

.button-active {
  .button-text-container {
    background-color: #4d9cff;
    .text {
      opacity: 1;
      color: #fff;
      &:after {
        filter: brightness(0) invert(1);
        transform: rotate(-180deg);
      }
    }
    img {
      filter: brightness(0) invert(1);
    }
    .text {
      opacity: 1;
    }
  }
}
.button-active {
  .button-non-text-container {
    filter: invert(0);
  }
}
</style>
