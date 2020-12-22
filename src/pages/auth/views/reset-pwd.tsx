/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/camelcase,vue/require-default-prop,@typescript-eslint/ban-ts-ignore*/
import { defineComponent, reactive, inject } from 'vue'
import { Button } from '../component/button'
import '../component/auth-view/index.less'
import { InputField } from '../component/input-field'
import { AUTH_TYPE } from '../constant'
import { inputColor, leakThemeColor, themeColor } from '../theme'

// TODO As there is no plug-in for area code selection in line with Chinese values, only + 86 is supported for the moment
export const ResetPwd = defineComponent({
  name: 'ResetPwd',
  setup() {
    const state = reactive({
      errorMsg: ''
    })

    const authUtil: any = inject('authUtil')

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
          ></InputField>
          <InputField
            placeholder="设置登陆密码，不少于6位"
            // @ts-ignore
            type="password"
            v-slots={{
              left: () => (
                <div style="padding-left:8px;">
                  <icon icon="suodakaimima" size={18} color={inputColor}></icon>
                </div>
              )
            }}
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
            console.log('click')
          }}
        >
          下一步
        </Button>

        <div
          class="auth-back cursor-pointer"
          onClick={() => authUtil.to(AUTH_TYPE.PHONE_LOGIN)}
        >{`< 返回登录`}</div>
      </>
    )
  }
})
