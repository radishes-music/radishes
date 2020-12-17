import { useAuth } from '@/hooks/auth'
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'
import { Image } from 'vant'

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
          <Image width="40" height="40" src={head} round fit="cover"></Image>
          <span>{text}</span>
        </RouterLink>
      )
    }
  }
})
