/* eslint-disable @typescript-eslint/camelcase,vue/require-default-prop,@typescript-eslint/ban-ts-ignore*/
import { defineComponent, inject, reactive } from 'vue'
import { Button } from '../component/button'
import { Link } from '../component/link'
import '../component/auth-view/index.less'
import { InputField } from '../component/input-field'
import { AUTH_TYPE } from '../constant'
import { inputColor, leakThemeColor, themeColor } from '../theme'
import { useText } from '../hooks'
import { useHttp, useRouter } from '@/hooks'
import { doEmailLogin, LoginRes } from '../api'
import { useLogin } from '@/hooks/auth'

// TODO As there is no plug-in for area code selection in line with Chinese values, only + 86 is supported for the moment
export const EmailLogin = defineComponent({
  name: 'EmailLogin',
  setup() {
    const state = reactive({
      email: '',
      password: ''
    })
    const $router = useRouter()

    const commitLogin = useLogin()

    const [errorMsg, setErrorMsg, isNullMsg] = useText()

    const authUtil: any = inject('authUtil')

    const onFocus = () => {
      setErrorMsg('')
    }

    const [httpStatus, httpEmailLogin] = useHttp(doEmailLogin)

    const doLogin = () => {
      if (!state.email) {
        setErrorMsg(j18n.load('src__pages__auth__views__email-login___37'))
      } else if (!state.password) {
        setErrorMsg(j18n.load('src__pages__auth__views__email-login___39'))
      } else {
        httpEmailLogin(state.email, state.password)
          .then((res: LoginRes) => {
            if (!res.profile) {
              setErrorMsg(
                j18n.load('src__pages__auth__views__email-login___44')
              )
            } else {
              commitLogin(res)
              $router.back()
            }
          })
          .catch((e: any) => {
            if (e.response?.data) {
              setErrorMsg(
                e.response.data.msg ||
                  e.response.data.message ||
                  j18n.load('src__pages__auth__views__email-login___53')
              )
            } else if (e.msg) {
              setErrorMsg(e.msg)
            }
          })
      }
    }

    return () => (
      <>
        <div class="vh-center auth-view__icon">
          <icon icon="mail" color={leakThemeColor} size={96} />
        </div>
        <div class="auth-view__inputbox">
          <InputField
            bold
            placeholder={j18n.load('src__pages__auth__views__email-login___70')}
            v-slots={{
              left: () => (
                <div style="padding-left:8px;">
                  <icon icon="xinfeng" size={18} color={inputColor}></icon>
                </div>
              )
            }}
            v-model={state.email}
            // @ts-ignore
            onFocus={onFocus}
          ></InputField>
          <InputField
            placeholder={j18n.load('src__pages__auth__views__email-login___83')}
            // @ts-ignore
            type="password"
            v-slots={{
              left: () => (
                <div style="padding-left:8px;">
                  <icon icon="suodakaimima" size={18} color={inputColor}></icon>
                </div>
              ),
              right: () => (
                <Link
                  type="normal"
                  style="padding:0 8px;"
                  to="https://reg.163.com/naq/findPassword#/verifyAccount"
                  external
                >
                  {j18n.load('src__pages__auth__views__email-login___99')}？
                </Link>
              )
            }}
            v-model={state.password}
            onFocus={onFocus}
          ></InputField>
        </div>
        <div class="auth-view__error">
          <icon
            icon="warning"
            color={themeColor}
            v-show={!isNullMsg.value}
            size={18}
          />
          <span v-show={!isNullMsg.value}>{errorMsg.text}</span>
        </div>

        <Button
          class="bd-button__auth"
          onClick={doLogin}
          disabled={httpStatus.loading}
        >
          {j18n.load('src__pages__auth__views__email-login___122')}
        </Button>
        <div
          class="auth-back cursor-pointer"
          onClick={() => authUtil.to(AUTH_TYPE.PHONE_LOGIN)}
        >
          {j18n.load('src__pages__auth__views__email-login___127')}
        </div>
      </>
    )
  }
})
