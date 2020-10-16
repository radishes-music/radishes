import { defineComponent, computed } from 'vue'
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
    }
  },
  setup(props) {
    const sizeOM = computed(() => {
      return props.size + 'px'
    })
    return {
      sizeOM
    }
  },
  render() {
    const { icon, color } = this.$props
    const { sizeOM } = this
    return (
      <svg
        class="icon"
        aria-hidden="true"
        style={{ width: sizeOM, height: sizeOM, fill: color }}
      >
        <use href={'#icon-' + icon}></use>
      </svg>
    )
  }
})
