<script lang="ts">
import Vue, { VNode } from 'vue'
import Modal from './Modal'

export default Vue.extend({
  name: 'Modal',

  props: {
    title: {
      type: String,
      required: false
    },
    width: {
      type: String,
      default: '300px'
    },
    padding: {
      type: String,
      default: '24px'
    }
  },

  data () {
    return {
      modal: null as null | Modal
    }
  },

  beforeDestroy () {
    if (this.modal) this.modal.detach()
  },

  methods: {
    bindModalActions () {
      if (this.modal) {
        this.modal.onShow = () => this.$emit('show')
        this.modal.onHide = () => this.$emit('hide')
        this.modal.onOk = () => this.$emit('ok')
        this.modal.onCancel = () => this.$emit('cancel')
      }
    },

    show () {
      if (this.modal) {
        this.modal.show()
      } else {
        this.modal = new Modal()
        this.bindModalActions()
        this.modal.show()
      }
    }
  },

  computed: {
    state (): boolean {
      if (!this.modal) return false
      else {
        return this.modal.state
      }
    },
    activator (): VNode {
      return this.$createElement('div', {
        class: ['tr-modal__activator'],
        on: {
          click: this.show
        }
      }, [
        this.$scopedSlots.activator ? this.$scopedSlots.activator(this.modal) : this.$slots.default
      ])
    },

    titleNode (): VNode {
      return this.$createElement('div', {
        class: ['tr-modal__title']
      }, this.title)
    },

    content (): VNode {
      return this.$createElement('div', [
        this.$scopedSlots.content ? this.$scopedSlots.content(this.modal) : ''
      ])
    },

    actions (): VNode {
      return this.$createElement('div', {
        class: ['tr-modal__actions']
      }, [
        this.$scopedSlots.actions ? this.$scopedSlots.actions(this.modal) : ''
      ])
    },

    container (): VNode {
      return this.$createElement('div', {
        class: ['tr-modal__container'],
        style: {
          '--container-width': this.width,
          '--modal-padding': this.padding
        },
        on: {
          click: (e: MouseEvent) => {
            if (e.target === e.currentTarget && this.modal) this.modal.cancel()
          }
        }
      }, [
        this.$createElement('div', {
          class: ['tr-modal__wrapper']
        }, [
          [
            this.title ? this.titleNode : '',
            this.content,
            this.actions
          ]
        ])
      ])
    }
  },

  render (h): VNode {
    return h('div', this.state ? [
      this.activator,
      this.container
    ] : [
      this.activator
    ])
  }
})
</script>

<style lang="scss">
.tr-modal {
  --container-width: 300px;
  --modal-padding: 24px;

  &__title {
    padding: 0px;
    margin: 0px 0px 16px 0px;

    font-weight: 500;
    font-size: 20px;

    line-height: 23px;

    color: #9d9d9d;
  }

  &__actions {
    display: flex;
    justify-content: space-around;

    padding: 0px;
    margin: 15px 0px 0px 0px;
  }

  &__wrapper {
    width: var(--container-width);
    padding: var(--modal-padding);

    background-color: #ffffff;
    cursor: auto;

    border-radius: 4px;
  }

  &__container {
    position: fixed;
    z-index: 6000;

    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    display: flex;
    align-items: center;
    justify-content: center;
    overflow: auto;

    background-color: rgba(0, 0, 0, .5);

    animation: fade 60ms linear;
  }
}

@keyframes fade {
  0% { opacity: 0 }
  100% { opacity: 1 }
}
</style>
