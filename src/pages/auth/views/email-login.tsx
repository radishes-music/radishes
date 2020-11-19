import { defineComponent, inject, reactive } from 'vue'
import { Button } from '../component/button'
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
        setErrorMsg('请输入帐号')
      } else if (!state.password) {
        setErrorMsg('请输入密码')
      } else {
        httpEmailLogin(state.email, state.password)
          .then((res: LoginRes) => {
            commitLogin(res)
            $router.back()
          })
          .catch((e: any) => {
            if (e.code !== 200) {
              setErrorMsg(e.msg || 'Invalid request')
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
            placeholder="邮箱账号"
            v-slots={{
              left: () => (
                <div style="padding-left:8px;">
                  <icon icon="xinfeng" size={18} color={inputColor}></icon>
                </div>
              )
            }}
            v-model={state.email}
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            onFocus={onFocus}
          ></InputField>
          <InputField
            placeholder="密码"
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            type="password"
            v-slots={{
              left: () => (
                <div style="padding-left:8px;">
                  <icon icon="suodakaimima" size={18} color={inputColor}></icon>
                </div>
              ),
              right: () => <div style="padding:0 8px;">忘记密码？</div>
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
          登 录
        </Button>
        <div
          class="auth-back cursor-pointer"
          onClick={() => authUtil.to(AUTH_TYPE.PHONE_LOGIN)}
        >{`< 返回其他登录`}</div>
      </>
    )
  }
})
