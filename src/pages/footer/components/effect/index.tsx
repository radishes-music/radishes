import { defineComponent } from 'vue'
import { Tooltip } from 'ant-design-vue'
import { useRouter } from '@/hooks/index'
import './index.less'

export default defineComponent({
  name: 'Effect',
  setup() {
    const router = useRouter()
    const handleAudioEffect = () => {
      router.push({
        path: '/setting/effect'
      })
    }

    return () => (
      <div class="effect-trigger" onClick={handleAudioEffect}>
        <Tooltip
          v-slots={{
            title: () => <span>音效</span>
          }}
        >
          <icon icon="music" color="#5a5a5a" size={18} />
        </Tooltip>
      </div>
    )
  }
})
