import { useAuth } from '@/hooks/auth'
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

export const SidebarAuth = defineComponent({
  name: 'SidebarAuth',
  setup() {
    const { isLogin, profile } = useAuth()

    return () => {
      const text = isLogin.value ? profile.value.nickname : '未登录'
      const head = isLogin.value
        ? profile.value.avatarUrl
        : 'https://p4.music.126.net/VnZiScyynLG7atLIZ2YPkw==/18686200114669622.jpg'
      return (
        <RouterLink class="sidebar-nav-login" to="/profile">
          <van-image
            width="40"
            height="40"
            src={head}
            round
            fit="cover"
          ></van-image>
          <span>{text}</span>
        </RouterLink>
      )
    }
  }
})
