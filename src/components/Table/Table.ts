import Vue from 'vue'

export interface Column {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  width?: number | string;
  access?: true | false;
};

export type Columns = Column[];

export interface Cell { [key: string]: any };
export type Cells = Cell[]

interface TrTableOptions {
  columns: Columns;
  title?: string;
  selection?: boolean;
  filter?: boolean;
  dense?: boolean;
  fixed?: boolean;
  heigth?: boolean;
};

class TableProps {
  onDelete?: () => void

  private _index: { value: number }
  get index () { return this._index.value }
  set index (value: number) { Vue.set(this._index, 'value', value) }

  private _selected: { value: boolean | null }
  get selected () { return this._selected.value }
  set selected (value: boolean | null) { Vue.set(this._selected, 'value', value) }

  private _loading: { value: boolean }
  get loading () { return this._loading.value }
  set loading (value: boolean) { Vue.set(this._loading, 'value', value) }

  constructor (index: number) {
    this._index = Vue.observable({ value: index })
    this._selected = Vue.observable({ value: false })
    this._loading = Vue.observable({ value: false })
  }

  toggle = () => {
    this.selected = !this.selected
  }

  delete = () => {
    this.selected = false
    if (this.onDelete) this.onDelete()
  }
};

export default class TrTable {
  static prop = { type: Object as () => TrTable }

  columns: Columns
  items: any[]

  title?: string | null

  selection?: boolean
  filter?: boolean
  dense?: boolean
  fixed?: boolean
  heigth?: boolean

  _filter: { value: string | null }

  private _selected: any[]

  add (item: any) {
    this.items.unshift(item)
  }

  constructor (options: TrTableOptions) {
    this.columns = options.columns
    this.items = []
    this._selected = []

    this.title = options.title || null

    this.selection = options.selection || false
    this.filter = options.filter || false
    this.dense = options.dense || false
    this.fixed = options.fixed || false
    this.heigth = options.heigth || false

    this._filter = { value: null }
  }

  static row (index: number) {
    return new TableProps(index)
  }

  toggleAll (items: any[], state: boolean | null) {
    items.forEach(item => {
      item._table.selected = state
    })

    if (!state) {
      this._selected.splice(0, this.selected.length)
    } else {
      this._selected = items.filter(item => {
        return item._table.selected
      })
    }
  }

  get selected () {
    return this.items.filter(item => {
      return item._table.selected
    })
  }

  deleteRows = () => {
    for (let i = this.selected.length - 1; i >= 0; i--) {
      this.selected[i]._table.delete()
    }
  }
}
