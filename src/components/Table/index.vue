<script lang="ts">
import Vue, { VNode } from 'vue'

import Table, { Cells } from './Table'
import Loader from '../LinearLoader.vue'
import Checkbox from '../Checkbox.vue'

export default Vue.extend({
  name: 'tr-table',
  props: {
    table: Table.prop,
    items: { type: Array as () => Cells, required: true },
    width: { type: String, default: undefined },
    border: { type: Boolean, default: false },
    hover: { type: Boolean, default: false },
    loaderColor: { type: String, default: undefined },
    fillCheck: { type: String, default: undefined },
    fillCheckbox: { type: String, default: undefined },
    colorCheckbox: { type: String, default: undefined }
  },

  data () {
    return {
      tableWidth: 0
    }
  },

  created () {
    this.table.items = this.items
  },

  mounted () {
    const table = this.$refs.table as HTMLElement
    const bounds = table.getBoundingClientRect()
    this.tableWidth = bounds.width
  },

  computed: {
    selection (): boolean | null {
      const all = this.processed
        .every(item => item._table.selected)

      if (all) return all

      const some = this.processed
        .some(item => item._table.selected)

      if (some) return null
      else return false
    },

    processed (): any[] {
      this.items
        .forEach((item, index) => {
          if (item._table) item._table.index = index
          else item._table = Table.row(index)
          item._table.onDelete = () => this.delete(item._table.index)
        })

      return this.items || []
    }
  },

  methods: {
    delete (index: number) {
      this.items.splice(index, 1)
    }
  },

  render (h): VNode {
    const slot = (key: string, item: any) => {
      const s = this.$scopedSlots[key]
      return s ? s(item) : item[key]
    }

    const toggleAll = h('th',
      { class: ['tr-table__th--checkbox'] },
      [
        h(Checkbox, {
          props: {
            value: this.selection,
            indeterminate: true,
            fillCheck: this.fillCheck,
            fillCheckbox: this.fillCheckbox,
            color: this.colorCheckbox
          },
          on: {
            input: (state: boolean) => {
              this.table.toggleAll(this.processed, state)
            }
          }
        })
      ])

    const labels = this.table.columns
      .map(col => h('th', {
        class: 'tr-table__th',
        style: { 'text-align': col.align }
      }, col.label))

    const thead = h('thead', [
      h('tr', this.table.selection ? [toggleAll, labels] : [labels])
    ])

    const loader = h(Loader,
      {
        class: ['tr-table__tr--loader'],
        attrs: { color: this.loaderColor }
      })

    const loaderWrapper = h('div', { class: ['tr-table__tr--loader--wrapper'], style: `--table-width: ${this.tableWidth}px` }, [loader])

    const toggle = (i: number) => h('td', [

      h(Checkbox, {
        props: {
          value: Vue.set({}, 'value', this.processed[i]._table.selected),
          fillCheck: this.fillCheck,
          fillCheckbox: this.fillCheckbox,
          color: this.colorCheckbox
        },
        class: ['tr-table__checkbox'],
        on: {
          input: () => {
            this.processed[i]._table.toggle()
          }
        }
      }),
      [this.processed[i]._table.loading ? loaderWrapper : null]
    ])

    const content = (item: any) => {
      return this.table.columns.map(col => {
        return h(
          'td',
          {

            class: 'tr-table__td',
            style: {
              position: 'relative',
              textAlign: col.align,
              width: col.width
            },
            scopedSlots: { [col.key]: props => props.value }
          },
          slot(col.key, item)
        )
      })
    }

    const tbody = h('tbody', this.processed.map((item, i) => {
      return h('tr', {
        class: {
          'tr-table__tr--bordered': this.border,
          'tr-table__tr--hover': this.hover
        }
      },
      [this.table.selection ? [toggle(i), content(item)] : content(item)])
    }))

    const title = h('span', { class: ['tr-table__title'] }, this.table.title)

    const header = h('div', {
      class: ['tr-table__header']
    }, [
      title,
      this.$scopedSlots.header ? this.$scopedSlots.header(this.processed) : ''
    ])

    const footer: any[] = [
      this.$scopedSlots.footer ? this.$scopedSlots.footer(this.processed) : ''
    ]

    // if (this.table.filter) {
    //   const filter = h('tr-textfield', {
    //     props: {
    //       value: this.table._filter.value,
    //       label: 'Filter'
    //     },
    //     on: {
    //       input: (v: string) => {
    //         v.length > 0
    //           ? this.table._filter.value = v
    //           : this.table._filter.value = null
    //       }
    //     }
    //   })

    //   header.push(filter)
    // }

    return h('div', [
      header,
      h('table',
        {
          class: ['tr-table'],
          style: {
            '--table-width': this.width
          },
          ref: 'table'
        },
        [thead, tbody]
      ),
      h('div', footer)
    ])
  }
})
</script>

<style lang="scss">
@import './styles.scss';
</style>
