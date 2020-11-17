import { defineComponent, inject, reactive } from 'vue'
import { Button } from './component/Button'
import './component/auth.less'
import { InputField } from './component/InputField'
import { AUTH_TYPE } from './constant'

// TODO As there is no plug-in for area code selection in line with Chinese values, only + 86 is supported for the moment
export const EmailLogin = defineComponent({
  name: 'EmailLogin',
  setup() {
    const state = reactive({
      errorMsg: ''
    })

    const leakThemeColor = '#f29c9f'
    const inputColor = '#b8b8b8'
    const themeColor = '#d33a31'

    const authUtil: any = inject('authUtil')

    return () => (
      <>
        <div class="vh-center auth-view__icon">
          <icon icon="mail" color="rgb(242,156,159)" size="96" />
        </div>
        <div class="auth-view__inputbox">
          <InputField
            bold
            placeholder="邮箱账号"
            v-slots={{
              left: () => (
                <div style="padding-left:8px;">
                  <icon icon="xinfeng" size={18} color="#b8b8b8"></icon>
                </div>
              )
            }}
          ></InputField>
          <InputField
            placeholder="密码"
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            type="password"
            v-slots={{
              left: () => (
                <div style="padding-left:8px;">
                  <icon icon="suodakaimima" size={18} color="#b8b8b8"></icon>
                </div>
              ),
              right: () => <div style="padding:0 8px;">忘记密码？</div>
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
          登 录
        </Button>
        <div
          class="auth-back"
          onClick={() => authUtil.to(AUTH_TYPE.PHONE_LOGIN)}
        >{`<返回其他登录`}</div>
      </>
    )
  }
})
