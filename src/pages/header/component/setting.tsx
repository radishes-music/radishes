import { defineComponent } from 'vue'
import { useRouter } from '@/hooks'

export const Setting = defineComponent({
  name: 'SettingButton',
  setup() {
    const router = useRouter()

    const handleOpenSetting = () => {
      router.push({
        path: '/setting/source'
      })
    }

    return () => (
      <ve-button
        type="text"
        class="header-window-btn"
        onClick={handleOpenSetting}
      >
        <icon icon="setting"></icon>
      </ve-button>
    )
  }
})
