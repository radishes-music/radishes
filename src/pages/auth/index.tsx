import {
  computed,
  defineComponent,
  reactive,
  Transition,
  provide,
  watch
} from 'vue'
import { useAuth } from '@/hooks/auth'
import { PhoneLogin } from './PhoneLogin'
import { ResetPwd } from './ResetPwd'
import { Signup } from './Signup'
import { EmailLogin } from './EmailLogin'
import { AuthView } from './component/AuthView'
import { AUTH_TYPE } from './constant'

const authComponent = [PhoneLogin, EmailLogin, Signup, ResetPwd]

export const AuthBox = defineComponent({
  name: 'AuthBox',

  setup() {
    const { isShow } = useAuth()
    const state = reactive({
      authType: AUTH_TYPE.PHONE_LOGIN
    })

    const Component: any = computed(() => authComponent[state.authType as any])

    provide('authUtil', {
      to: (type: any) => {
        state.authType = type
      }
    })

    watch(
      () => isShow.value,
      n => {
        if (n) {
          state.authType = AUTH_TYPE.PHONE_LOGIN
        }
      }
    )

    return () => (
      <Transition name="fade">
        {isShow.value ? (
          <AuthView>
            <Transition name="fade">
              <Component.value></Component.value>
            </Transition>
          </AuthView>
        ) : null}
      </Transition>
    )
  }
})
