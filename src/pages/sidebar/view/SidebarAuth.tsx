import { useAuth } from '@/hooks/auth'
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

export const SidebarAuth = defineComponent({
  name: 'SidebarAuth',
  setup() {
    const { isLogin, profile } = useAuth()

    return () => (
      <RouterLink class="sidebar-nav-login" to="/profile">
        <icon icon="denglu" color="#e0e0e0" size={40} />
        <span>{isLogin.value ? profile.value.nickname : '未登录'}</span>
      </RouterLink>
    )
  }
})
