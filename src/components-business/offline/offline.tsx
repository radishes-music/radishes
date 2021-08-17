import { defineComponent, ref } from 'vue'
import { Alert } from 'ant-design-vue'
import { useOnline } from '@vueuse/core'

export default defineComponent({
  name: 'Offline',
  setup() {
    const online = useOnline()

    return () => {
      if (!online.value) {
        return (
          <Alert
            message={$t('src__components-business__offline__offline___13')}
            type="warning"
          />
        )
      }
    }
  }
})
