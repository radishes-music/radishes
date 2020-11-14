import { defineComponent } from 'vue'
import './button.less'

export const Button = defineComponent({
  setup(props: any, { slots }) {
    return () => (
      <div onClick={props.onClick} class="bd-button">
        {slots.default?.()}
      </div>
    )
  }
})

Button.props = {
  onClick: Function
}
