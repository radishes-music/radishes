import { defineComponent, reactive, inject } from 'vue'
import { useRouter } from 'vue-router'
import { Toast } from 'vant'
import { Button } from '../component/button'

import { Link, ExternalLightLink, AuthLink } from '../component/link'
import { InputField } from '../component/input-field'
import { AUTH_TYPE, PROVIDER_AUTH_UTIL, TERMS } from '../constant'
import { doPhoneLogin, LoginRes } from '../api'

import { useLogin } from '@/hooks/auth'
import { useHttp } from '@/hooks'

import '../component/auth-view/index.less'
import { useText } from '../hooks'
import { inputColor, leakThemeColor, themeColor } from '../theme'

/* 
  As there is no plug-in for area code selection in line with Chinese values,
  only + 86 is supported for the moment
 */

export const PhoneLogin = defineComponent({
  name: 'PhoneLogin',
  setup() {
    const state = reactive({
      checked: false,
      phone: '',
      password: ''
    })

    const [errorMsg, setErrorMsg, isNullMsg] = useText()

    const commitLogin = useLogin()

    const $router = useRouter()

    // TODO ->  用来判断请求的状态
    const [httpStatus, httpPhoneLogin] = useHttp(doPhoneLogin)

    const checkTip = () =>
      Toast(
        '请先勾选同意《服务条款》、《隐私政策》\n《儿童隐私政策》、《radishes条款》'
      )

    const doLogin = () => {
      if (!state.checked) {
        checkTip()
        return
      }
      if (!state.phone) {
        setErrorMsg('请输入手机号')
      } else if (!state.password) {
        setErrorMsg('请输入登录密码')
      } else if (!/\d{11}/.test(state.phone)) {
        setErrorMsg('请输入正确的手机号')
      } else {
        httpPhoneLogin(state.phone, state.password)
          .then((res: LoginRes) => {
            commitLogin(res)
            $router.back()
          })
          .catch((e: any) => {
            if (e.response.status === 400) {
              setErrorMsg('该手机号尚未注册')
            } else if (e.code !== 200) {
              setErrorMsg(e.msg)
            }
          })
      }
    }

    const onFocus = () => {
      setErrorMsg('')
    }

    const withChecked = (fn: Function) => {
      return (...args: any[]) => {
        if (!state.checked) {
          checkTip()
          return
        }
        return fn(...args)
      }
    }

    const authUtil = inject(PROVIDER_AUTH_UTIL) as any

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
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            v-model={state.phone}
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            onFocus={onFocus}
          ></InputField>
          <InputField
            placeholder="请输入密码"
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            type="password"
            v-slots={{
              left: () => (
                <div style="padding-left:8px;">
                  <icon icon="suodakaimima" size={18} color={inputColor}></icon>
                </div>
              ),
              right: () => (
                <div
                  class="cursor-pointer"
                  style="padding:0 16px 0 8px;"
                  onClick={withChecked(() => {
                    authUtil.to(AUTH_TYPE.RESET_PWD)
                  })}
                >
                  重设密码
                </div>
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
          disabled={httpStatus.loading}
          class="bd-button__auth"
          onClick={doLogin}
        >
          登 录
        </Button>
        <div class="register vh-center">
          <Link
            onClick={withChecked(() => {
              authUtil.to(AUTH_TYPE.REGISTER)
            })}
          >
            注册
          </Link>
        </div>

        <div class="others">
          <AuthLink
            icon="wangyi"
            onClick={withChecked(() => {
              authUtil.to(AUTH_TYPE.EMAIL_LOGIN)
            })}
          ></AuthLink>
        </div>

        <div class="auth-view__clause">
          <van-checkbox
            icon-size="10px"
            shape="square"
            vModel={state.checked}
            checked-color={themeColor}
          ></van-checkbox>
          <span>同意</span>
          <div class="vchj">
            {TERMS.map((info: any) => (
              <ExternalLightLink to={info.link} key={info.name}>
                {info.name}
              </ExternalLightLink>
            ))}
          </div>
        </div>
        <div class="auth-view__clause">
          <ExternalLightLink to="https://github.com/Linkontoask/radishes">
            《radishes条款》
          </ExternalLightLink>
        </div>
      </>
    )
  }
})
