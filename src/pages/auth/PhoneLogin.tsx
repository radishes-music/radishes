import { defineComponent, reactive } from 'vue'
import { Toast } from 'vant'
import Md5 from 'md5'
import { AuthView } from './component/AuthView'
import { Button } from './component/Button'
import './component/auth.less'
import { Link, ExternalLightLink, AuthLink } from './component/Link'
import { InputField } from './component/InputField'
import http from '@/utils/http'
import { useAuthView, useLogin } from '@/hooks/auth'
import { useRouter } from 'vue-router'

const clause = [
  {
    name: '《服务条款》',
    link: 'https://st.music.163.com/official-terms/service'
  },
  {
    name: '《隐私政策》',
    link: 'https://st.music.163.com/official-terms/privacy'
  },
  {
    name: '《儿童隐私政策》',
    link: 'https://st.music.163.com/official-terms/children'
  }
]

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
      password: '',
      errorMsg: ''
    })

    const leakThemeColor = '#f29c9f'
    const inputColor = '#b8b8b8'
    const themeColor = '#d33a31'

    const commitLogin = useLogin()

    const $router = useRouter()

    const doLogin = () => {
      if (!state.checked) {
        Toast(
          '请先勾选同意《服务条款》、《隐私政策》\n《儿童隐私政策》、《radishes条款》'
        )
        return
      }
      if (!state.phone) {
        state.errorMsg = '请输入手机号'
      } else if (!state.password) {
        state.errorMsg = '请输入登录密码'
      } else if (!/\d+/.test(state.phone)) {
        state.errorMsg = '请输入正确的手机号'
      } else {
        http
          .get('/api/login/cellphone', {
            params: {
              phone: state.phone,
              // eslint-disable-next-line
            md5_password: Md5(state.password),
            }
          })
          .then((res: any) => {
            if (res.code !== 200) {
              state.errorMsg = res.msg
            } else {
              // TODO 记录用户信息,把这段信息放到 vuex 中就完成了登录状态
              commitLogin(res)
              $router.back()
            }
          })
          .catch(e => {
            if (e.response.status === 400) {
              state.errorMsg = '该手机号尚未注册'
            }
          })
      }
    }

    const onFocus = () => {
      state.errorMsg = ''
    }

    return () => (
      <AuthView>
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
                <div class="cursor-pointer" style="padding:0 16px 0 8px;">
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
            v-show={state.errorMsg !== ''}
            size={18}
          />
          <span v-show={state.errorMsg !== ''}>{state.errorMsg}</span>
        </div>

        <Button
          class="bd-button__auth"
          onClick={() => {
            doLogin()
          }}
        >
          登 录
        </Button>
        <div class="register">
          <Link to="/">注册</Link>
        </div>

        <div class="others">
          <AuthLink to="/" icon="wangyi"></AuthLink>
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
            {clause.map((info: any) => (
              <ExternalLightLink to={info.link} key={info.name}>
                {info.name}
              </ExternalLightLink>
            ))}
          </div>
        </div>
        <div class="auth-view__clause">
          <ExternalLightLink to="/">《radishes条款》</ExternalLightLink>
        </div>
      </AuthView>
    )
  }
})
