import { defineComponent } from 'vue'
import './index.less'

export interface IconProps {
  icon: string
}

export default defineComponent({
  name: 'Icon',
  props: {
    icon: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: '#ffffff'
    },
    size: {
      type: Number,
      default: 24
    },
    height: {
      type: Number
    }
  },
  render() {
    const { icon, color, height, size } = this.$props
    return (
      <svg
        class="icon"
        aria-hidden="true"
        style={{ width: size, height: height || size, fill: color }}
      >
        <use href={'#icon-' + icon}></use>
      </svg>
    )
  }
})
