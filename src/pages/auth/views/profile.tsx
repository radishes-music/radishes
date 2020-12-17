import { useLogout } from '@/hooks/auth'
import { defineComponent } from 'vue'
import { Button } from 'vant'

export const Profile = defineComponent({
  name: 'Profile',
  setup() {
    const doLogout = useLogout()

    return () => (
      <div class="vh-center">
        <Button type="primary" onClick={doLogout}>
          logout
        </Button>
      </div>
    )
  }
})
