import {
  computed,
  defineComponent,
  reactive,
  Transition,
  provide,
  watch,
  KeepAlive
} from 'vue'
import { useAuth } from '@/hooks/auth'
import { PhoneLogin } from './phone-login'
import { ResetPwd } from './reset-pwd'
import { Signup } from './signup'
import { EmailLogin } from './email-login'
import { AuthView } from '../component/auth-view'
import { AUTH_TYPE, PROVIDER_AUTH_UTIL } from '../constant'
import { SmsCode } from './sms-code'

const authComponent = [PhoneLogin, EmailLogin, Signup, ResetPwd, SmsCode]

export const AuthBox = defineComponent({
  name: 'AuthBox',

  setup() {
    const { isShow } = useAuth()
    const state = reactive({
      authType: AUTH_TYPE.PHONE_LOGIN,
      config: null
    })

    const Component: any = computed(() => authComponent[state.authType])

    provide(PROVIDER_AUTH_UTIL, {
      to: (type: number, config: any) => {
        state.authType = type
        state.config = config
      },
      getConfig: () => {
        return state.config
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
            <KeepAlive
              exclude={['SmsCode', 'ResetPwd', 'EmailLogin', 'Signup']}
            >
              <Component.value></Component.value>
            </KeepAlive>
          </AuthView>
        ) : null}
      </Transition>
    )
  }
})
