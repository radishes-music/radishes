import { defineComponent } from 'vue'
import { useRouter } from '@/hooks/index'
import { isMacOS } from '@/utils'
import classNames from 'classnames'
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
      <div
        class={classNames('logo', {
          'mt-5': isMacOS
        })}
        onClick={home}
      >
        <icon icon="logo-fill" size={132} height={40}></icon>
      </div>
    )
  }
})
