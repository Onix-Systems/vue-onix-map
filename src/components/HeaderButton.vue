<template lang="pug">
  .wrapper(:class="[{'button-active': isActive}]" v-click-outside="closeDropdown")
    div(
      @click="clicked(type)"
      :class="[isTitleEmpty ? 'button-non-text-container' : 'button-text-container']" )
        img(:src="icon" alt='')
        .text(v-if="!isTitleEmpty") {{title}}
    slot(v-if="isActive")
      //.dropdown-default
        .item Coming soon
    slot(v-if="isActive" name="list")
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ClickOutside from '@/directives/clickOutside';

@Component({
  directives: { ClickOutside },
})
export default class HeaderButton extends Vue {
  @Prop({ default: '' }) private title!: string;
  @Prop({default: ''}) private type!: string;
  @Prop({ default: '' }) private icon!: string;

  private isActive: boolean = false;

  private created() {
    // because slot don't emit event
    this.$on('close-dropdown', (e: Event) => {
      this.isActive = false;
      if(e) {
        this.$parent.$emit('place-selected', e);
      }
    });
  }

  get isTitleEmpty(): boolean {
    return this.title === '';
  }

  private closeDropdown() {
    this.isActive = false;
  }

  private clicked(placeType: string) {
    this.isActive = !this.isActive;
    if (placeType !== '') {
      this.$emit('btnClicked', {status: this.isActive, type: placeType});
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/media';
.wrapper {
  position: relative;
  @include media_mobile {
    position: initial;
  }
}
.button-text-container,
.button-non-text-container {
  display: flex;
  height: 36px;
  justify-content: center;
  align-items: center;
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
    text-transform: capitalize;
    @include media_tablet {
      display: none;
    }
    &:after {
      position: absolute;
      top: 50%;
      width: 6px;
      margin-top: -2px;
      height: 4px;
      right: 25px;
      transition: transform 0.5s;
      content: '';
      background: url('../assets/images/header-icons/header_down-arrow.svg')
        center center no-repeat;
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

.dropdown-default {
  display: flex;
  flex-direction: column;
  justify-content: center;
  top: 43px;
  position: absolute;
  width: 210px;
  right: 0;
  padding: 16px;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #e2e6ed;
  box-shadow: 0 4px 8px rgba(43, 44, 48, 0.1);
  @include media_mobile {
    top: 54px;
  }

  .item {
    font-size: 14px;
    opacity: 0.8;
  }
}
</style>
