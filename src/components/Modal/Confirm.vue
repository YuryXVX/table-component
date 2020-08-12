<script lang="ts">
import Vue, { VNode } from 'vue'

import ModalComponent from './ModalComponent.vue'
import CustomButton from '../CustomButton.vue'
import Modal from './Modal'

export default Vue.extend({
  name: 'Prompt',

  props: {
    title: { type: String, default: null },
    label: { type: String, default: null },
    description: { type: String, default: null }
  },

  render (h): VNode {
    return h(ModalComponent, {
      props: {
        title: this.title
      },

      on: {
        cancel: () => this.$emit('cancel'),
        ok: () => this.$emit('ok')
      },

      scopedSlots: {
        activator: this.$scopedSlots.activator
          ? this.$scopedSlots.activator
          : () => this.$slots.default,

        content: this.$scopedSlots.content
          ? this.$scopedSlots.content
          : () => [this.description],

        actions: (modal: Modal) => [
          h(CustomButton, {
            attrs: {
              rounded: true
            },
            on: {
              click: () => modal.cancel()
            }
          }, 'Cancel'),
          h(CustomButton, {
            attrs: {
              rounded: true
            },
            on: {
              click: () => modal.ok()
            }
          }, 'Ok')
        ]
      }
    })
  }
})
</script>
