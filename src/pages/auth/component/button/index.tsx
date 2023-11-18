import { defineComponent } from 'vue'
import { Button as VantButton } from 'vant'
import './index.less'

const VanButtonProps = {
  onClick: Function,
  text: String,
  icon: String,
  color: String,
  block: Boolean,
  plain: Boolean,
  round: Boolean,
  square: Boolean,
  loading: Boolean,
  hairline: Boolean,
  disabled: Boolean,
  iconPrefix: String,
  loadingText: String,
  loadingType: String,
  tag: {
    type: String,
    default: 'button'
  },
  type: {
    type: String,
    default: 'default'
  },
  size: {
    type: String,
    default: 'normal'
  },
  nativeType: {
    type: String,
    default: 'button'
  },
  loadingSize: {
    type: String,
    default: '20px'
  },
  iconPosition: {
    type: String,
    default: 'left'
  }
}

export const Button = defineComponent({
  props: VanButtonProps,

  setup(props: any, { slots }) {
    return () => (
      <VantButton
        disabled={props.disabled}
        loading={props.loading}
        onClick={props.onClick}
        class="auth-button"
        type="primary"
        block
      >
        {slots.default?.()}
      </VantButton>
    )
  }
})
