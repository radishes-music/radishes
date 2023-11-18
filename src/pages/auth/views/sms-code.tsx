import { defineComponent, inject, reactive } from 'vue'
import { AUTH_TYPE } from '../constant'
import { Button } from '../component/button'
import { themeColor } from '../theme'
import { useText } from '../hooks'
import { InputField } from '../component/input-field'
import { CountDown, Toast } from 'vant'
import { useHttp, useLogin, useRouter } from '@/hooks'
import { resetPwd, sendMsgCode } from '../api'

export const SmsCode = defineComponent({
  name: 'SmsCode',
  setup() {
    const authUtil: any = inject('authUtil')

    const { phone, password } = authUtil.getConfig() || {}

    const state = reactive({
      code: '',
      time: 60000
    })

    const [httpSendStatus, httpSend] = useHttp(sendMsgCode)
    const [httpResetStatus, httpReset] = useHttp(resetPwd)

    const commitLogin = useLogin()
    const $router = useRouter()

    const [errorMsg, setErrorMsg] = useText()

    const onSubmit = async () => {
      if (state.code === '') {
        setErrorMsg('请输入验证码')
      } else {
        try {
          const res = await httpReset(phone, password, state.code)
          commitLogin(res)
          Toast('登录成功')
          $router.back()
        } catch (e) {
          if (e.response?.data) {
            setErrorMsg(
              e.response.data.msg || e.response.data.message || '请求异常'
            )
          } else if (e.msg) {
            setErrorMsg(e.msg)
          }
        }
      }
    }

    const onSend = async () => {
      await httpSend(phone)
      state.time = 60000
    }

    const onFocus = () => {
      setErrorMsg('')
    }

    return function () {
      return (
        <>
          <div class="vh-center auth-view__icon">
            <icon icon="diepian" size={96} />
          </div>

          <div class="auth-view__tipstrong">
            为了安全，我们会向你的手机发送短信验证码
          </div>
          <div class="auth-view__smscode">
            <InputField
              bold
              placeholder="填写验证码"
              v-model={state.code}
              v-slots={{
                left: () => (
                  <div
                    style={{
                      paddingLeft: '6px',
                      paddingTop: '2px',
                      marginRight: '-4px'
                    }}
                  >
                    <icon icon="miyue" size={16} color="#777"></icon>
                  </div>
                )
              }}
              // @ts-ignore
              onFocus={onFocus}
            ></InputField>
            <div class={state.time === 0 ? 'actived' : ''}>
              {state.time === 0 ? (
                <Button
                  disabled={httpSendStatus.loading}
                  loading={httpSendStatus.loading}
                  class="bd-button__auth"
                  onClick={onSend}
                >
                  重新获取
                </Button>
              ) : (
                <CountDown
                  time={state.time}
                  format="mm:ss"
                  onFinish={() => {
                    state.time = 0
                  }}
                ></CountDown>
              )}
            </div>
          </div>

          <div class="auth-view__error">
            <icon
              icon="warning"
              color={themeColor}
              size={18}
              v-show={errorMsg.text !== ''}
            />
            <span v-show={errorMsg.text !== ''}>{errorMsg.text}</span>
          </div>

          <Button
            disabled={httpResetStatus.loading}
            loading={httpResetStatus.loading}
            class="bd-button__auth"
            onClick={onSubmit}
          >
            完成
          </Button>

          <div
            class="auth-back cursor-pointer"
            onClick={() => authUtil.to(AUTH_TYPE.PHONE_LOGIN)}
          >{`< 返回登录`}</div>
        </>
      )
    }
  }
})
