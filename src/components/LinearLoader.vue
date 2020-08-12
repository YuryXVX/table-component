<script lang="ts">
import Vue, { CreateElement } from 'vue'

interface LoaderOptions {
  [key: string]: string;
}

const Props = {
  fill: { type: String, default: '#000000' },
  color: { type: String, default: 'var(--primary-color)' }
}

const linearLoader = (h: CreateElement, props: LoaderOptions) => {
  const { fill, color } = props
  const div = h('div', { class: ['linear-loader__indeterminate'] })

  return h('div',
    {
      class: ['linear-loader'],
      style: {
        '--fill-bar': fill,
        '--indeterminate-color': color
      }
    },
    [div]
  )
}

export default Vue.extend({
  props: Props,

  render (h) {
    return linearLoader(h, this.$props)
  }
})
</script>
