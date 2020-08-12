<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    color: { type: String, default: 'black' },
    size: { type: String, default: '25px' },
    bold: { type: String, default: '1px' }
  },

  render (h) {
    return h('div',
      {
        class: ['circular-loader'],
        style: {
          '--color-circular': this.color,
          '--size-circular': this.size,
          '--bold-circular': this.bold
        }
      }
    )
  }
})
</script>
