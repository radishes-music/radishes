import { defineComponent } from 'vue'
import './index.less'

export const InputField = defineComponent({
  props: {
    icon: {
      type: String,
      default: 'suodakaimima'
    },
    size: {
      type: Number,
      default: 28
    },
    inputColor: {
      type: String,
      default: 'black'
    },
    bold: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    modelValue: String
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const onInput = (e: any) => {
      emit('update:modelValue', e.target.value)
    }

    return function (this: any) {
      return (
        <div class="ra-inputfield">
          {this.$slots.left ? (
            this.$slots.left()
          ) : (
            <icon icon={this.icon} size={this.size}></icon>
          )}
          <div class="ra-inputfield__box">
            <input
              type="text"
              placeholder={this.placeholder}
              {...this.$attrs}
              style={{
                color: this.inputColor,
                fontWeight: this.bold ? 'bold' : undefined
              }}
              value={this.modelValue}
              onInput={onInput}
            />
          </div>

          {this.$slots.right ? this.$slots.right() : null}
        </div>
      )
    }
  }
})
