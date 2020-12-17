/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/camelcase */
import { defineComponent } from 'vue'
import { Button as VantButton } from 'vant'
import './index.less'

export const Button = defineComponent({
  setup(props: any, { slots }) {
    return () => (
      <VantButton
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
