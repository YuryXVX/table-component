<script lang="ts">
import Vue from 'vue'
import Loader from './CircularProgress.vue'
import { VNode } from 'vue/types/umd'

export default Vue.extend({
  props: {
    outlined: { type: Boolean, default: false },
    raised: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    loader: { type: Boolean, default: false },
    rounded: { type: Boolean, default: undefined },
    block: { type: Boolean, default: false },
    color: { type: String, default: '#363636' },
    colorLoader: { type: String, default: undefined },
    icon: { type: Boolean, default: undefined },
    iconSize: { type: String, default: '18px' },
    iconPosition: { type: String, default: 'left' },
    uppercase: { type: Boolean, default: false },
    background: { type: String },
    circle: { type: Boolean, default: false }
  },

  computed: {
    iconComp (): VNode {
      const margins = () => {
        if (this.circle) return '0'
        return this.iconPosition === 'left' ? '0 5px 0 -7px' : '0 -7px 0 5px'
      }

      return this.$createElement('div', {
        style: {
          margin: margins(),
          width: this.iconSize,
          heigth: this.iconSize
        },
        class: ['btn--icon flex align-center justify-center']
      }, this.$slots.icon)
    },

    spinner (): VNode {
      return this.$createElement(Loader, { style: { '--color-circular': this.colorLoader }, class: ['btn--loader'] })
    },

    button (): VNode {
      const content = () => {
        if (!this.icon) return [this.$slots.default]
        return this.iconPosition === 'left' ? [this.iconComp, this.$slots.default] : [this.$slots.default, this.iconComp]
      }

      const style = () => {
        return {
          minwWidth: this.circle ? '36px' : 'auto',
          color: this.color,
          padding: this.circle ? '0' : '0 16px 0 16px',
          '--bg-color-button': this.background
        }
      }

      return this.$createElement('button', {
        ref: 'button',
        class: {
          'custom-button': true,
          'inline-flex': true,
          'justify-center': true,
          'align-center': true,
          'hover-secondary': true,
          'transition-hover': true,
          'hover-third': this.raised,
          'letter-spacer-xs': true,
          'radius-xs': !this.rounded && !this.circle,
          uppercase: this.uppercase,
          'border-1': this.outlined,
          'shadow-s': this.raised,
          'radius-l': this.rounded && !this.circle,
          'w-full': this.block,
          'radius-full': this.circle
        },

        style: style(),

        attrs: {
          tabindex: 0,
          disabled: this.disabled
        },

        on: { click: (evt: MouseEvent) => this.$emit('click', evt) }
      },
      [this.loader ? this.spinner : content()])
    }
  },

  render (): VNode {
    return this.button
  }
})
</script>

<style lang="scss" scoped>
@import url('../styles/index.scss');
</style>
