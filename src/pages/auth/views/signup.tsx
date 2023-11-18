import { defineComponent, inject, reactive } from 'vue'
import { Button } from '../component/button'
import '../component/auth-view/index.less'
import { AuthLink } from '../component/link'
import { InputField } from '../component/input-field'
import { AUTH_TYPE } from '../constant'
import { inputColor, leakThemeColor, themeColor } from '../theme'
import { useText } from '../hooks'
import { sendMsgCode } from '../api'
import { useHttp } from '@/hooks'

// TODO As there is no plug-in for area code selection in line with Chinese values, only + 86 is supported for the moment
export const Signup = defineComponent({
  name: 'Signup',
  setup() {
    const state = reactive({
      phone: '',
      password: ''
    })

    const authUtil: any = inject('authUtil')

    const [errorMsg, setErrorMsg] = useText()

    const [httpStatus, httpSend] = useHttp(sendMsgCode)

    const onSubmit = () => {
      if (!state.phone) {
        setErrorMsg('请输入手机号')
      } else if (!state.password) {
        setErrorMsg('请输入登录密码')
      } else if (!/\d{11}/.test(state.phone)) {
        setErrorMsg('请输入正确的手机号')
      } else {
        httpSend(state.phone)
          .then(() => {
            authUtil.to(AUTH_TYPE.SMS_CODE, {
              phone: state.phone,
              password: state.password
            })
          })
          .catch((e: any) => {
            if (e.response?.data) {
              setErrorMsg(
                e.response.data.msg || e.response.data.message || '请求异常'
              )
            } else if (e.msg) {
              setErrorMsg(e.msg)
            }
          })
      }
    }

    const onFocus = () => {
      setErrorMsg('')
    }

    return () => (
      <>
        <div class="vh-center auth-view__icon">
          <icon icon="diepian" color={leakThemeColor} size={96} />
        </div>
        <div class="auth-view__inputbox">
          <InputField
            bold
            placeholder="请输入手机号"
            v-slots={{
              left: () => (
                <div class="country-code">
                  <icon icon="shouji" size={18} color={inputColor}></icon>
                  <div class="country-code__num">+86</div>
                </div>
              )
            }}
            v-model={state.phone}
            // @ts-ignore
            onFocus={onFocus}
          ></InputField>
          <InputField
            placeholder="设置登陆密码"
            // @ts-ignore
            type="password"
            v-slots={{
              left: () => (
                <div style="padding-left:8px;">
                  <icon icon="suodakaimima" size={18} color={inputColor}></icon>
                </div>
              )
            }}
            v-model={state.password}
            onFocus={onFocus}
          ></InputField>
        </div>
        {!errorMsg.text ? (
          <div class="auth-view__tiptext">
            密码8-20位，至少包含字母/数字/字符2种组合
          </div>
        ) : (
          <div class="auth-view__error">
            <icon icon="warning" color={themeColor} size={18} />
            <span>{errorMsg.text}</span>
          </div>
        )}

        <Button
          disabled={httpStatus.loading}
          loading={httpStatus.loading}
          class="bd-button__auth"
          onClick={onSubmit}
        >
          注册
        </Button>

        <div class="signup-others">
          <div class="signup-others__label">
            <span>其他注册方式</span>
          </div>
          <div class="others">
            <AuthLink
              icon="wangyi"
              onClick={() => {
                authUtil.to(AUTH_TYPE.EMAIL_LOGIN)
              }}
            >
              网易邮箱
            </AuthLink>
          </div>
        </div>
        <div
          class="auth-back cursor-pointer"
          style={{ textAlign: 'center', color: '#333' }}
          onClick={() => {
            authUtil.to(AUTH_TYPE.PHONE_LOGIN)
          }}
        >{`< 返回登录`}</div>
      </>
    )
  }
})
