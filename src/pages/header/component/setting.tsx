import { defineComponent, ref } from 'vue'
import { importIpc } from '@/electron/event/ipc-browser'
import { MiddlewareView } from '@/electron/event/action-types'
import './setting.less'
import { Platform } from '@/config/build'

const { VUE_APP_PLATFORM } = process.env

export const Setting = defineComponent({
  name: 'Setting',
  setup() {
    const color = ref('#4a6eef')
    const visibleColor = ref(false)

    const clickHandler = (value: string) => {
      visibleColor.value = false
      document.documentElement.style.setProperty('--base-color', value)
      document.documentElement.style.setProperty('--primary-theme-text', value)
      if (VUE_APP_PLATFORM === Platform.ELECTRON) {
        importIpc().then(event => {
          event.sendAsyncIpcRendererEvent(
            MiddlewareView.UPDATE_THEME_COLOR,
            value
          )
        })
      }
    }

    const ColorPicker = {
      content: () => (
        <ve-color-picker
          simple
          v-model={color.value}
          onChange={clickHandler}
        ></ve-color-picker>
      ),
      default: () => <icon icon="skin"></icon>
    }

    return () => (
      <div class="setting">
        <ve-button type="text" class="header-window-btn">
          <icon icon="setting"></icon>
        </ve-button>
        <ve-button type="text" class="header-window-btn">
          <a-popover
            v-model={[visibleColor.value, 'visible']}
            trigger="click"
            v-slots={ColorPicker}
          ></a-popover>
        </ve-button>
      </div>
    )
  }
})
