import { useAuth } from '@/hooks/auth'
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { Image } from 'vant'

const DEFAULT_AVATAR =
  'https://p4.music.126.net/VnZiScyynLG7atLIZ2YPkw==/18686200114669622.jpg'

export const SidebarAuth = defineComponent({
  name: 'SidebarAuth',
  setup() {
    const { isLogin, profile } = useAuth()
    const $router = useRouter()

    const onClick = () => {
      $router.push('/profile')
    }

    return () => {
      const text = isLogin.value ? profile.value.nickname : '未登录'
      const head = isLogin.value ? profile.value.avatarUrl : DEFAULT_AVATAR
      return (
        <a class="sidebar-nav-login" onClick={onClick}>
          <Image width="40" height="40" src={head} round fit="cover"></Image>
          <span>{text}</span>
        </a>
      )
    }
  }
})
