/* eslint-disable @typescript-eslint/camelcase,vue/require-default-prop,@typescript-eslint/ban-ts-ignore*/
import { defineComponent, reactive, inject } from 'vue'
import { useRouter } from 'vue-router'
import { Toast } from 'vant'
import { Button } from '../component/button'
import { Link, AuthLink } from '../component/link'
import { InputField } from '../component/input-field'
import { AUTH_TYPE, PROVIDER_AUTH_UTIL } from '../constant'
import { doPhoneLogin, LoginRes } from '../api'

import { useLogin } from '@/hooks/auth'
import { useHttp } from '@/hooks'

import '../component/auth-view/index.less'
import { useText } from '../hooks'
import { inputColor, themeColor } from '../theme'

import { Checkbox } from 'vant'
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
      Toast(j18n.load('src__pages__auth__views__phone-login___41'))

    const doLogin = () => {
      if (!state.checked) {
        checkTip()
        return
      }
      if (!state.phone) {
        setErrorMsg(j18n.load('src__pages__auth__views__phone-login___49'))
      } else if (!state.password) {
        setErrorMsg(j18n.load('src__pages__auth__views__phone-login___51'))
      } else if (!/\d{11}/.test(state.phone)) {
        setErrorMsg(j18n.load('src__pages__auth__views__phone-login___53'))
      } else {
        httpPhoneLogin(state.phone, state.password)
          .then((res: LoginRes) => {
            commitLogin(res)
            Toast(j18n.load('src__pages__auth__views__phone-login___58'))
            $router.back()
          })
          .catch((e: any) => {
            if (e.response?.status === 400) {
              setErrorMsg(
                j18n.load('src__pages__auth__views__phone-login___63')
              )
            } else if (e.response?.data) {
              setErrorMsg(e.response.data.msg)
            } else if (e.msg) {
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
          <icon icon="diepian" size={96} />
        </div>
        <div class="auth-view__inputbox">
          <InputField
            bold
            placeholder={j18n.load('src__pages__auth__views__phone-login___97')}
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
            placeholder={j18n.load(
              'src__pages__auth__views__phone-login___114'
            )}
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
                  {j18n.load('src__pages__auth__views__phone-login___132')}
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
          loading={httpStatus.loading}
          class="bd-button__auth"
          onClick={doLogin}
        >
          {j18n.load('src__pages__auth__views__phone-login___157')}
        </Button>
        <div class="register vh-center">
          <Link
            onClick={withChecked(() => {
              authUtil.to(AUTH_TYPE.REGISTER)
            })}
          >
            {j18n.load('src__pages__auth__views__phone-login___165')}
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
          <Checkbox
            icon-size="14px"
            shape="square"
            vModel={state.checked}
            checked-color={themeColor}
          >
            <span>
              {j18n.load('src__pages__auth__views__phone-login___185')}
            </span>
          </Checkbox>

          <div class="vchj">
            <Link
              to="https://github.com/Linkontoask/radishes"
              external
              type="light"
            >
              《radishes
              {j18n.load('src__pages__auth__views__phone-login___194')}》
            </Link>
            {/* {TERMS.map((info: any) => (
              <Link to={info.link} key={info.name} external type="light">
                {info.name}
              </Link>
            ))} */}
          </div>
        </div>
      </>
    )
  }
})
