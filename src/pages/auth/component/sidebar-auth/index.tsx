import { defineComponent, onMounted, onUnmounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Image } from 'vant'
import { useAuth } from '@/hooks/auth'
import { showLogin } from '@/helpers'
import { FloatBox } from '@/pages/auth/component/sidebar-auth/float-box'
import './style.less'

const DEFAULT_AVATAR =
  'https://p4.music.126.net/VnZiScyynLG7atLIZ2YPkw==/18686200114669622.jpg'

// TODO 由于没有提供对应的绑定接口，绑定社交账号该功能无法完成[Disabled]
export const SidebarAuth = defineComponent({
  name: 'SidebarAuth',
  setup() {
    const state = reactive({
      show: false
    })
    const { isLogin, profile } = useAuth()
    const $router = useRouter()

    const unLoginClick = () => {
      if (!isLogin.value) {
        showLogin()
      }
    }

    const goProfile = () => {
      if (isLogin.value) $router.push(`/userinfo/${profile.value.userId}`)
    }

    const popupProfile = (e: MouseEvent) => {
      if (isLogin.value) {
        e.stopPropagation()
        state.show = !state.show
      }
    }

    const clickListener = () => {
      if (state.show) {
        state.show = false
      }
    }

    onMounted(() => {
      document.addEventListener('click', clickListener)
    })
    onUnmounted(() => {
      document.removeEventListener('click', clickListener)
    })

    return () => {
      const text = isLogin.value ? profile.value.nickname : '未登录'
      const head = isLogin.value ? profile.value.avatarUrl : DEFAULT_AVATAR
      return (
        <div class="sidebar-nav-login m-4" onClick={unLoginClick}>
          <div class="sidebar-nav-loginbox">
            <Image
              width="40"
              height="40"
              src={head}
              round
              fit="cover"
              onClick={goProfile}
              class="cursor-pointer"
            ></Image>
            <span onClick={popupProfile}>{text}</span>
            {isLogin.value && state.show && (
              <FloatBox
                onClose={() => {
                  state.show = false
                }}
              ></FloatBox>
            )}
          </div>
        </div>
      )
    }
  }
})
