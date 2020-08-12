<script lang="ts">
import Vue, { VNode } from 'vue'

export default Vue.extend({
  props: {
    value: { type: String, default: '' },
    type: { type: String, default: 'text' },
    label: { type: String, default: undefined },
    activeColor: { type: String, default: '#000000' },
    limit: { type: Number, default: undefined },
    counter: { type: Boolean, default: false },
    outlined: { type: Boolean, default: false },
    clearable: { type: Boolean, default: false },
    area: { type: Boolean, default: false },
    dense: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    hint: { type: Boolean, default: false },
    loader: { type: Boolean, default: false },
    select: { type: Boolean, default: false },
    errors: {
      type: Array as () => string[],
      default: () => []
    }
  },

  data () {
    return {
      clearButton: false,
      focused: false,
      valid: false,
      count: 0
    }
  },

  watch: {
    value: {
      handler () {
        if (this.value !== '') {
          this.clearButton = true
        } else {
          this.clearButton = false
        }
      },
      immediate: true
    }
  },

  render (h): VNode {
    const onInput = (e: KeyboardEvent) => {
      const el = e.target as HTMLTextAreaElement

      if (this.area) {
        el.style.height = 'auto'
        el.style.height = `${el.scrollHeight}px`
      }

      this.$emit('input', el.value)
    }

    const field = () => {
      return this.area
        ? this.$refs.textarea as HTMLTextAreaElement
        : this.$refs.input as HTMLInputElement
    }

    const qtyCharacters = () => {
      const el = field()

      this.count = el.value.length

      if (this.count > this.limit) this.valid = true
      else this.valid = false
    }

    const input = h('input',
      {
        attrs: {
          placeholder: ' ',
          disabled: this.disabled,
          readonly: this.readonly,
          type: this.type,
          tabindex: 0,
          value: this.value
        },

        domProps: { value: this.value },

        on: {
          input: onInput,
          focus: () => { this.focused = true },
          blur: () => {
            this.focused = false
            this.$emit('blur')
          }
        }
      }
    )

    const textarea = h('textarea',
      {
        attrs: {
          placeholder: ' ',
          disabled: this.disabled,
          readonly: this.readonly,
          tabindex: 0
        },

        on: {
          input: onInput,
          focus: () => { this.focused = true },
          blur: () => { this.focused = false }
        },

        style: { '--input-active-color': `${this.activeColor} !important` },

        class: {
          'tr-input__field--outlined': this.outlined,
          'tr-input__field': !this.outlined
        }
      }
    )

    const clear = () => {
      const el = field()

      el.value = ''
      this.count = 0
      this.valid = false

      if (el.value === '') { this.clearButton = false }
      if (this.area) { el.style.height = 'auto' }

      this.$emit('input', el.value)
      this.$emit('clear')
    }

    const clearButton = h('div',
      {
        on: {
          click: clear
        },

        class: {
          'tr-input__button': true,
          'tr-input__button--select': this.select,
          'tr-input__button--active': this.clearButton && !this.loader,
          'tr-input__button--dense': this.dense
        }
      },
      [this.$slots.clear]
    )

    const errorIcon = h('div',
      {
        class: {
          'tr-input__eror-icon': true
        }
      },
      [this.$slots.error]
    )

    const span = h('span', {}, this.label)

    const hintText = h('span',
      {
        class: {
          'tr-input__hint': true,
          'tr-input__hint--active': this.focused
        }
      },

      [this.$slots.hint]
    )

    const counterCharacter = h('span',
      {
        class: {
          'tr-input__counter': true
        }
      },
      [this.$slots.counter, `${this.count}/${this.limit}`]
    )

    const wrap = h('div',
      {
        class: { 'tr-input__text-wrap': true }
      },
      [
        this.hint
          ? hintText
          : [],

        this.counter
          ? [counterCharacter]
          : []
      ]
    )

    const label = h('label',
      {
        class: {
          'tr-input__field': !this.outlined,
          'tr-input__field--outlined': this.outlined,
          'tr-input__field--clearable': this.clearable,
          'tr-input__field--error': this.valid
        }
      },
      [
        this.area ? [textarea, span] : [input, span],
        this.clearable ? [clearButton] : [],
        this.errors.length > 0 ? [errorIcon] : []
      ]
    )

    const error = (e: string) => h('span', { class: { 'tr-input__error': true } }, e)

    const errors = h(
      'div',
      {},
      this.errors
        .map(e => error(e))
    )

    return h('div',
      {
        class: {
          'tr-input__wrap': true,
          'tr-input__wrap--dense': this.dense,
          'tr-input__wrap--eror': this.valid,
          'tr-input__non-focused': !this.focused
        },
        style: {
          '--input-active-color': this.activeColor
        }
      },
      [
        label,
        errors,
        wrap
      ]
    )
  }
})
</script>

<style lang="scss" >
.tr-input__wrap {
  width: 100%;
  position: relative;

  --input-line-heigth: 56px;
  --input-padding: 10px 10px 10px;
  --input-default-padding: 0 0 4px 0;
  --input-border-color: black;
  --input-active-color: #000000;
}

.tr-input__wrap--eror {
  --input-border-color: #B00020;
}

.tr-input__field {
  width: 100%;

  position: relative;
  display: flex;
  align-items: center;

  font-size: 14px;
  line-height: 2;
  overflow: hidden;
}

.tr-input__field--outlined {
    position: relative;

    display: inline-block;

    width: 100%;

    padding-top: 6px;

    font-size: 14px;

    overflow: hidden;

    & > input,
    & > textarea {

    width: 100%;
    height: inherit;
    margin: 0;

    padding: var(--input-padding);

    background-color: transparent;

    color: var(--input-border-color);
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;

    border: solid 1px;
    border-color: var(--input-border-color);
    border-top-color: transparent;
    border-radius: 4px;

    box-shadow: none;

    transition: border 0.2s, box-shadow 0.2s;

    box-sizing: border-box;
  }

  & > input + span,
  & > textarea + span {
    display: flex;

    width: 100%;
    max-height: 100%;

    position: absolute;
    top: 0;
    left: 0;

    color: var(--input-border-color);
    font-size: 75%;
    line-height: 15px;
    border-color: var(--input-border-color);

    cursor: text;

    transition: color 0.2s, font-size 0.2s, line-height 0.2s;
  }

  & > input + span,
  & > textarea + span {
    position: absolute;
    top: 0;
    left: 0;

    display: flex;
    width: 100%;
    max-height: 100%;

    border-color: var(--input-border-color);

    color: var(--input-border-color);
    font-size: 75%;
    line-height: 15px;
    cursor: text;

    transition: color 0.2s, font-size 0.2s, line-height 0.2s;
  }

  & > input + span::before,
  & > input + span::after,
  & > textarea + span::before,
  & > textarea + span::after {
    content: "";

    min-width: 10px;
    height: 8px;

    display: block;
    box-sizing: border-box;

    margin-top: 6px;

    border-top: solid 1px;
    border-top-color: var(--input-active-color);

    pointer-events: none;

    box-shadow: inset 0 1px transparent;

    transition: border-color 0.2s, box-shadow 0.2s;
  }

  & > input + span::before,
  & > textarea + span::before {
    margin-right: 4px;
    border-left: solid 1px transparent;
    border-radius: 4px 0;
  }

  & > input + span::after,
  & > textarea + span::after {
    flex-grow: 1;

    margin-left: 4px;

    border-right: solid 1px transparent;
    border-radius: 0 4px;
  }

  .tr-input__field--outlined:hover > input,
  .tr-input__field--outlined:hover > textarea {
    border-top-color: transparent;
  }

  .tr-input__field--outlined:hover > input + span::before,
  .tr-input__field--outlined:hover > textarea + span::before,
  .tr-input__field--outlined:hover > input + span::after,
  .tr-input__field--outlined:hover > textarea + span::after {
    border-top-color: rgba(var(--input-border-color, 0, 0, 0), 0.87);
  }

  .tr-input__field--outlined:hover > input:not(:focus):placeholder-shown,
  .tr-input__field--outlined:hover > textarea:not(:focus):placeholder-shown {
      border-color: rgba(0, 0, 0, 0.7);
  }

    & > input:not(:focus):placeholder-shown,
    & > textarea:not(:focus):placeholder-shown {
      border-top-color: rgba(var(--input-border-color, 0, 0, 0), 0.87);
    }

    & > input:not(:focus):placeholder-shown + span,
    & > textarea:not(:focus):placeholder-shown + span {
      font-size: inherit;
      line-height: var(--input-line-heigth);
    }

    & > input:not(:focus):placeholder-shown + span::before,
    & > textarea:not(:focus):placeholder-shown + span::before,
    & > input:not(:focus):placeholder-shown + span::after,
    & > textarea:not(:focus):placeholder-shown + span::after {
      border-top-color: transparent;
  }

  /* Focus */

  & > input:focus,
  & > textarea:focus,
  & > input:active,
  & > textarea:active
  & > input::placeholder,
  & > textarea:focus {
    border-color: var(--input-active-color);
    border-top-color: transparent;
    outline: none;
  }

  & > input:focus + span,
  & > textarea:focus + span,
  & > input:active + span,
  & > textarea:active + span {
    color: var(--input-active-color);
  }

  & > input:focus + span::before,
  & > input:focus + span::after,
  & > textarea:focus + span::before,
  & > textarea:focus + span::after {
    border-top-color: var(--input-active-color) !important;
  }

  .tr-input__field--outlined > input:focus + span::before,
  .tr-input__field--outlined > input:focus + span::after,
  .tr-input__field--outlined > textarea:focus + span::before,
  .tr-input__field--outlined > textarea:focus + span::after {
    border-top-color: var(--input-active-color);
  }

  /* Disabled */

  & > input:disabled,
  & > input:disabled + span,
  & > textarea:disabled,
  & > textarea:disabled + span {
    border-color: rgba( 0, 0, 0, 0.38) !important;
    border-top-color: transparent !important;

    color: rgba(0, 0, 0, 0.38);

    pointer-events: none;
  }

  & > input:disabled + span::before,
  & > input:disabled + span::after,
  & > textarea:disabled + span::before,
  & > textarea:disabled + span::after {
    border-top-color: rgba(0, 0, 0, 0.38) !important;
  }

  & > input:disabled:placeholder-shown,
  & > input:disabled:placeholder-shown + span,
  & > textarea:disabled:placeholder-shown,
  & > textarea:disabled:placeholder-shown + span {
    border-top-color: rgba(0, 0, 0, 0.38) !important;
  }

  & > input:disabled:placeholder-shown + span::before,
  & > input:disabled:placeholder-shown + span::after,
  & > textarea:disabled:placeholder-shown + span::before,
  & > textarea:disabled:placeholder-shown + span::after {
    border-top-color: transparent !important;
  }
}

.tr-input {
  &__field {
    & > input,
    & > textarea {
      display: block;

      width: 100%;
      height: inherit;

      margin: 0;
      padding: var(--input-default-padding);

      border: none;
      border-top: solid 19px transparent;

      font-size: inherit;
      line-height: inherit;

      resize: none;

      box-shadow: none;  /* Firefox */
      box-sizing: border-box;

      background-color: transparent;

      transition: border-bottom 0.2s, background-color 0.2s;
    }

    & > input + span,
    & > textarea + span {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      display: block;

      box-sizing: border-box;

      border-bottom: 1px solid;
      border-color: var(--input-border-color);

      padding: 7px 0 0;

      color: rgba(0, 0, 0, 0.6);
      font-size: 75%;
      line-height: 18px;

      pointer-events: none;

      transition: color 0.2s, font-size 0.2s, line-height 0.2s;
    }

    /* Underline */

    & > input + span::after,
    & > textarea + span::after {
      content: "";

      display: block;
      width: 100%;
      height: .15em;

      position: absolute;
      left: 0;
      bottom: -1px;

      background-color: var(--input-active-color);

      transform-origin: bottom center;
      transform: scaleX(0);
      transition: transform 0.2s;
    }

    // hover

    & > input:hover,
    & > textarea:hover {
      border-bottom-color: var(--input-border-color);
    }

    // Placeholder-shown

    & > input:not(:focus):placeholder-shown + span,
    & > textarea:not(:focus):placeholder-shown + span {
      font-size: inherit;
      line-height: 56px;
    }

    //  focus

    & > input:focus,
    & > textarea:focus {
      outline: none;
    }

    & > input:focus + span,
    & > textarea:focus + span {
      color: var(--input-border-color);
    }

    & > input:focus + span::before,
    & > textarea:focus + span::before {
      opacity: 0.12;
    }

    & > input:focus + span::after,
    & > textarea:focus + span::after {
      transform: scale(1);
    }

    // disabled

    & > input:disabled,
    & > textarea:disabled {
      border-bottom-color: rgba(0, 0, 0, 0.38);

      color: rgba( 0, 0, 0, .38);
    }

    & > input:disabled + span,
    & > textarea:disabled + span {
      color: rgba(0, 0, 0, .38);
    }
  }

  &__button {
    display: none;

    align-self: center;
    position: absolute;

    width: 30px;
    height: 30px;

    border: none;

    right: 0;
    top: 13px;

    outline: none;

    background-color: transparent;

    cursor: pointer;
  }

  &__button--active {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__button--select {
    right: 30px;
  }

  &__hint {
    opacity: 0;

    transition: opacity .2s ease-in-out;
  }

  &__hint--active {
    opacity: 1;

    margin-right: auto;

    transform: translateY(0);
  }

  &__counter {
    display: block;
    margin-left: auto;

    text-align: right;
  }

  &__text-wrap {
    display: flex;
    justify-content: space-between;
  }

  &__field--error {
    animation: shake 0.59s cubic-bezier(.36,.07,.19,.97) both;

    transform: translate3d(0, 0, 0);
  }

  &__eror-icon {
    display: flex;
    justify-content: center;
    align-items: center;

    min-width: 35px;
    height: 35px;
    border-radius: 50%;

    position: absolute;
    right: 0;
    top: 50%;

    transform: translateY(-50%);
  }

  &__error {
    display: block;
    color: #B00020;
  }

  &__loader {
  position: absolute !important;
  bottom: 0;

    &--circular {
      right: 2%;
      top: 40%;
    }
  }
}

//  faster transition in Safari for less noticable fractional font-size issue

@media not all and (min-resolution:.001dpcm) {
  @supports (-webkit-appearance:none) {
    .tr-input__field > input,
    .tr-input__field > input + span,
    .tr-input__field > input + span::after,
    .tr-input__field > textarea,
    .tr-input__field > textarea + span,
    .tr-input__field > textarea + span::after,
    .tr-input__field--outlined > input,
    .tr-input__field--outlined > input + span,
    .tr-input__field--outlined > input + span::after,
    .tr-input__field--outlined > textarea,
    .tr-input__field--outlined > textarea + span,
    .tr-input__field--outlined > textarea + span::after {
      transition-duration: 0.1s;
    }
  }
}

// dense

.tr-input__wrap--dense {
  --input-line-heigth: 43px;
  --input-padding: 4px 2px 2px 8px;
}

.tr-input__button--dense {
  top: 7px;
}

// clearable

.tr-input__field--clearable,
.tr-input__field--clearable  {
  & > input,
  & > textarea {
    padding-right: 35px;
  }
}

// animation error

@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
}

</style>
