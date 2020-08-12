<script lang="ts">
import Vue, { VNode } from 'vue'

import ModalComponent from './ModalComponent.vue'
import CustomButton from '../CustomButton.vue'
import Modal from './Modal'

export default Vue.extend({
  name: 'Prompt',

  props: {
    value: { type: String, default: null },
    title: { type: String, default: null },
    label: { type: String, default: null },
    description: { type: String, default: null }
  },

  data () {
    return {
      promptValue: null as null | string
    }
  },

  render (h): VNode {
    return h(ModalComponent, {
      props: {
        title: this.title
      },

      on: {
        show: () => { this.promptValue = this.value },
        hide: () => { this.promptValue = null },
        cancel: () => this.$emit('cancel'),
        ok: () => {
          this.$emit('input', this.promptValue)
          this.$emit('ok', this.promptValue)
        }
      },

      scopedSlots: {
        activator: this.$scopedSlots.activator
          ? this.$scopedSlots.activator
          : () => this.value
            ? this.value
            : this.$slots.default,

        content: this.$scopedSlots.content
          ? this.$scopedSlots.content
          : props => [
            this.description ? this.description : '',
            h('tr-textfield', {
              props: {
                value: this.promptValue,
                label: this.label
              },
              on: {
                input: (v: string) => { this.promptValue = v }
              }
            })
          ],

        actions: (modal: Modal) => [
          h(CustomButton, {
            on: {
              click: modal.cancel
            }
          }, 'Cancel'),
          h(CustomButton, {
            on: {
              click: modal.ok
            }
          }, 'Ok')
        ]
      }
    })
  }
})
</script>
