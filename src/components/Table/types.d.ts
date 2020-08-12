export interface Column {
  key: string,
  label: string,
  align?: 'left' | 'center' | 'right'
  width?: number | string,
  access?: true | false
}
export type Columns = Column[]

export interface Cell { [key: string]: any }
export type Cells = Cell[]
