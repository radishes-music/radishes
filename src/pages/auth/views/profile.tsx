import { useLogout } from '@/hooks/auth'
import { defineComponent } from 'vue'

export const Profile = defineComponent({
  name: 'Profile',
  setup() {
    const doLogout = useLogout()

    return () => (
      <div class="vh-center">
        <van-button type="primary" onClick={doLogout}>
          logout
        </van-button>
      </div>
    )
  }
})
