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
            message="离线只能播放本地音乐（本地客户端）哦，联网后有更优质的体验"
            type="warning"
          />
        )
      }
    }
  }
})
