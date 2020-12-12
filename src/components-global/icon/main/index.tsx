import { defineComponent, toRefs, PropType } from 'vue'
import './index.less'

export interface IconProps {
  icon: string
}

export default defineComponent({
  name: 'Icon',
  props: {
    icon: {
      type: String as PropType<string>,
      required: true
    },
    color: {
      type: String as PropType<string>,
      default: '#ffffff'
    },
    size: {
      type: Number as PropType<number>,
      default: 24
    },
    // eslint-disable-next-line vue/require-default-prop
    height: {
      type: Number as PropType<number>
    },
    className: {
      type: String as PropType<string>,
      default: ''
    }
  },
  setup(props) {
    const { icon, color, height, size, className } = toRefs(props)
    return () => (
      <svg
        class={'icon ' + className.value}
        aria-hidden="true"
        style={{
          width: size.value,
          height: height?.value || size.value,
          fill: color.value
        }}
      >
        <use href={'#icon-' + icon.value}></use>
      </svg>
    )
  }
})
