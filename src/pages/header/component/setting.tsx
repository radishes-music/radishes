import { defineComponent, ref } from 'vue'
import { importIpc } from '@/electron/event/ipc-browser'
import { MiddlewareView } from '@/electron/event/action-types'
import { Platform } from '@/config/build'
import { shade } from '@/theme/color'
import { Popover } from 'ant-design-vue'
import './setting.less'

const { VUE_APP_PLATFORM } = process.env

export const Setting = defineComponent({
  name: 'Setting',
  setup() {
    const color = ref('#4a6eef')
    const visibleColor = ref(false)

    const clickHandler = (value: string) => {
      visibleColor.value = false

      const color = {
        'base-color': value.toLocaleLowerCase(),
        'normal-theme-text': shade(value, 0.1),
        'primary-theme-text': value.toLocaleLowerCase(),
        'base-color-background': shade(value, 0.4),
        'secondary-theme-text': shade(value, 0.2)
      }

      for (const [key, value] of Object.entries(color)) {
        document.documentElement.style.setProperty('--' + key, value)
      }

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
          <Popover
            v-model={[visibleColor.value, 'visible']}
            trigger="click"
            v-slots={ColorPicker}
          ></Popover>
        </ve-button>
      </div>
    )
  }
})
