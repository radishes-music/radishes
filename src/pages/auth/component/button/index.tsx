/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/camelcase */
import { defineComponent } from 'vue'
import './index.less'

export const Button = defineComponent({
  setup(props: any, { slots }) {
    return () => (
      <van-button
        onClick={props.onClick}
        class="auth-button"
        type="primary"
        block
      >
        {slots.default?.()}
      </van-button>
    )
  }
})
