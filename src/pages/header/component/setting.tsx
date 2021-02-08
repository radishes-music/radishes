import { defineComponent, onMounted, ref } from 'vue'
import { asyncIpc } from '@/electron/event/ipc-browser'
import { MiddlewareView } from '@/electron/event/action-types'
import { Platform } from '@/config/build'
import { shade } from '@/theme/color'
import { Popover } from 'ant-design-vue'
import { setThemeColor } from '@/helpers'
import { useThemeColor, useRouter } from '@/hooks'
import './setting.less'

const { VUE_APP_PLATFORM } = process.env

const setColor = (baseColor: string) => {
  const color = {
    'base-color': baseColor.toLocaleLowerCase(),
    'base-color-lighten': shade(baseColor, 0.1),
    'base-color-darken': shade(baseColor, -0.1),
    'normal-theme-text': shade(baseColor, 0.1),
    'primary-theme-text': baseColor.toLocaleLowerCase(),
    'base-color-background': shade(baseColor, 0.4),
    'secondary-theme-text': shade(baseColor, 0.2)
  }

  for (const [key, value] of Object.entries(color)) {
    document.documentElement.style.setProperty('--' + key, value)
  }

  if (VUE_APP_PLATFORM === Platform.ELECTRON) {
    asyncIpc().then(event => {
      event.sendAsyncIpcRendererEvent(
        MiddlewareView.UPDATE_THEME_COLOR,
        baseColor
      )
    })
  }
}

export const Setting = defineComponent({
  name: 'SettingButton',
  setup() {
    const router = useRouter()
    // eslint-disable-next-line prefer-const
    let themeColor = useThemeColor()
    const visibleColor = ref(false)

    onMounted(() => {
      setColor(themeColor)
    })

    const clickHandler = (value: string) => {
      visibleColor.value = false

      setThemeColor(value)
      setColor(value)
    }

    const ColorPicker = {
      content: () => (
        <ve-color-picker
          simple
          v-model={themeColor}
          onChange={clickHandler}
        ></ve-color-picker>
      ),
      default: () => <icon icon="skin"></icon>
    }

    const handleOpenSetting = () => {
      router.push({
        path: '/setting/source'
      })
    }

    return () => (
      <div class="setting vchj">
        <ve-button
          type="text"
          class="header-window-btn"
          onClick={handleOpenSetting}
        >
          <icon icon="setting-new" size={25}></icon>
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
