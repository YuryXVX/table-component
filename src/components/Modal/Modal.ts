import Vue from 'vue'

class Modal {
  private _state: { value: boolean }

  public errors: string[]
  public data: any

  callback?: () => void
  onShow?: () => void
  onHide?: () => void
  onOk?: () => void
  onCancel?: () => void

  constructor () {
    this._state = Vue.observable({ value: false })
    this.errors = []
  }

  get state () { return this._state.value }
  set state (b: boolean) {
    Vue.set(this._state, 'value', b)

    if (this._state) {
      if (this.onShow) this.onShow()

      this.attachListenClose()
    } else {
      if (this.onHide) this.onHide()

      this.detach()
    }
  }

  detach () {
    if (this.callback) this.callback()

    this.detachListenClose()
    this.clearErrors()
  }

  show () {
    this.state = true
    document.body.style.overflow = 'hidden'
  }

  hide () {
    this.state = false
    document.body.style.overflow = 'auto'
  }

  clearData () { this.data = undefined }

  addError (e: string) { this.errors.push(e) }
  clearErrors () { this.errors = [] }

  close = (e: KeyboardEvent) => {
    if (e.code === 'Escape') this.hide()
    if (e.code === 'Enter') this.ok()
  }

  ok = () => {
    if (this.onOk) this.onOk()
    this.hide()
  }

  cancel = () => {
    if (this.onCancel) this.onCancel()
    this.hide()
  }

  attachListenClose () {
    window.addEventListener('keydown', this.close)
  }

  detachListenClose () {
    window.removeEventListener('keydown', this.close)
  }
}

export default Modal
