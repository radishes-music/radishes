import { defineComponent } from 'vue'
import { useRouter } from '@/hooks/index'
import './logo.less'

export const Logo = defineComponent({
  name: 'Logo',
  setup() {
    const router = useRouter()
    const home = () => {
      router.replace({
        path: '/'
      })
    }
    return () => (
      <div class="logo" onClick={home}>
        <icon icon="logo-fill" size={132} height={40}></icon>
      </div>
    )
  }
})
