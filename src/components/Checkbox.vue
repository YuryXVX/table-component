<script lang="ts">
import Vue, { VNode } from 'vue'

export default Vue.extend({
  props: {
    value: {
      default: false,
      validator: (prop) =>
        prop === null ||
        typeof prop === 'boolean' ||
        typeof prop === 'number' ||
        typeof prop === 'string' ||
        typeof prop === 'object'
    },
    label: { type: String, default: undefined },
    color: { type: String, default: undefined },
    disabled: { type: Boolean, default: false },
    indeterminate: { type: Boolean, default: false },
    indeterminateValue: { type: [Boolean, String, Number], default: null },
    fillCheckbox: { type: String, default: 'transparent' },
    fillCheck: { type: String, default: '#000000' }
  },

  computed: {
    indeterminateState (): boolean | undefined {
      return this.indeterminate
        ? this.value === this.indeterminateValue
        : undefined
    }
  },

  watch: {
    checked: {
      handler () {
        if (!this.indeterminateState && !this.value) {
          this.stateCheck = false
        } else {
          this.stateCheck = true
        }
      },
      immediate: true
    }
  },

  data () {
    return {
      stateCheck: false
    }
  },

  render (h): VNode {
    const chageBorderColor = () => {
      if (this.fillCheckbox !== 'transparent') {
        if (this.value || this.indeterminateState) {
          return `${this.fillCheckbox}`
        }
      }
    }

    const onCheck = (e: MouseEvent) => {
      const el = e.target as HTMLInputElement
      const check = el.checked
      this.stateCheck = check

      this.$emit('input', el.checked)
    }

    const input = h('input',
      {
        domProps: {
          checked: this.value,
          indeterminate: this.indeterminateState,
          type: 'checkbox',
          disabled: this.disabled
        },

        on: { change: onCheck }
      }
    )

    const span = h('span', [this.label])

    const label = h('label',
      {
        class: ['tr-checkbox'],
        style: {
          '--color-checkbox': chageBorderColor() || this.color,
          '--color-check': this.fillCheck,
          '--fill-checkbox': this.fillCheckbox
        }
      },
      [input, span]
    )

    return h('div',
      {
        class: ['tr-checkbox__wrap']
      },
      [label]
    )
  }
})
</script>

<style lang="scss">
.tr-checkbox {
  --fill-checkbox: transparent;
  --color-checkbox: #000000;
  --color-check: black;
  --indeterminate-check: black;
  --border-color-checkbox: #000000;

  position: relative;

  display: flex;
  align-items: center;

 &--select {
    width: 100%;

    flex-direction: column;

    &::before,
    &::after {
      content: '';

      width: 100%;
      height: 15px;
    }

    & > label {
      width: 100%;
      cursor: pointer;
    }
  }

  &__wrap {
    display: inline-flex;
    padding: 10px;

    &--select {
      padding: 0;
    }
  }
}

// wrap
.tr-checkbox > input {
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;

  display: block;
  box-sizing: border-box;

  z-index: 1;

  margin: 3px 1px;

  border: solid 2px;
  border-color: var(--color-checkbox);
  border-radius: 2px;

  width: 18px;
  height: 18px;

  outline: none;

  cursor: pointer;

  transition: border-color 0.2s, background-color 0.2s;
}

// span

.tr-checkbox > input + span {
  display: inline-block;

  box-sizing: border-box;

  padding-left: 1rem;

  cursor: pointer;
}

// ripple

.tr-checkbox > input + span::before {
  content: "";

  display: block;
  width: 40px;
  height: 40px;

  position: absolute;
  left: -10px;
  top: -8px;

  border-radius: 50%;

  // background-color: rgba(0, 0, 0, 0);

  opacity: 0;

  pointer-events: none;

  transform: scale(1);
  transition: opacity 0.3s, transform 0.2s;
}

// check

.tr-checkbox > input + span::after {
  content: "";

  display: block;
  width: 10px;
  height: 5px;

  position: absolute;
  z-index: 1;
  top: 3px;
  left: 1px;

  box-sizing: content-box;

  border: solid 2px;
  border-color: transparent;
  border-right-width: 0;
  border-top-width: 0;

  pointer-events: none;

  transform: translate(3px, 4px) rotate(-45deg);
  transition: border-color 0.2s;
}

// checked, indeterminate

.tr-checkbox > input:checked,
.tr-checkbox > input:indeterminate {
  border-color: (var(--color-checkbox));
  background-color: (var(--fill-checkbox));
}

// check active

.tr-checkbox > input:indeterminate + span::after {
  border-left-width: 0;
  transform: translate(4px, 3px);
}

// ripple active

.tr-checkbox > input:checked + span::before,
.tr-checkbox > input:indeterminate + span::before {
  background-color: var(--color-checkbox);
  border-color: var(--color-check);
}

.tr-checkbox > input:checked + span::after,
.tr-checkbox > input:indeterminate + span::after {
  border-color: var(--color-check);
}

// hover, focus

.tr-checkbox:hover > input + span::before {
  opacity: 0.04;
}

.tr-checkbox:focus > input + span::before {
  opacity: 0.04;
}

.tr-checkbox > input:focus + span::before {
  opacity: 0.12;
}

.tr-checkbox:hover > input:focus + span::before {
  opacity: 0.16;
}

// active

// .tr-checkbox:active > input,
// .tr-checkbox:active:hover > input {
//   // border-color: var(--fill-checkbox);
// }

// .tr-checkbox:active > input:checked {
//   border-color: transparent;
//   background-color: rgba(0, 0, 0,  0.6);
// }

.tr-checkbox:active > input + span::before {
  opacity: 1;
  transform: scale(0);
  transition: transform 0s, opacity 0s;
}

// disabled

.tr-checkbox > input:disabled {
  border-color: rgb(0, 0, 0.38);

  cursor: initial;
}

.tr-checkbox > input:checked:disabled,
.tr-checkbox > input:indeterminate:disabled {
  border-color: rgba( 0, 0, 0, 0.38);
  background-color: transparent;
}

.tr-checkbox > input:disabled + span {
  color: rgba(0, 0, 0, 0.38);
  cursor: initial;
}

.tr-checkbox > input:disabled + span::before {
  opacity: 0;
  transform: scale(0);
}
.tr-checkbox > input:disabled + span::after {
  opacity: 0;

  color: rgba(0, 0, 0, 0.38);
}
</style>
