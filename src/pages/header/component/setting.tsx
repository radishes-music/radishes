import { defineComponent, ref } from 'vue'
import './setting.less'

export const Setting = defineComponent({
  name: 'Setting',
  setup() {
    const color = ref('#ef4a4a')
    const visibleColor = ref(false)
    return {
      color,
      visibleColor
    }
  },
  render() {
    const clickHandler = (value: string) => {
      this.visibleColor = false
      document.documentElement.style.setProperty('--base-color', value)
    }
    const { color } = this
    const ColorPicker = {
      content: () => (
        <ve-color-picker
          simple
          v-model={color}
          onChange={clickHandler}
        ></ve-color-picker>
      ),
      default: () => <icon icon="skin"></icon>
    }

    return (
      <div class="setting">
        <ve-button type="text">
          <icon icon="setting"></icon>
        </ve-button>
        <ve-button type="text">
          <a-popover
            v-model={[this.visibleColor, 'visible']}
            trigger="click"
            v-slots={ColorPicker}
          ></a-popover>
        </ve-button>
      </div>
    )
  }
})
