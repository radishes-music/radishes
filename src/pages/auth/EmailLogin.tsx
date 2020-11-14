import { defineComponent, reactive } from 'vue'
import { AuthView } from './component/AuthView'
import { Button } from './component/Button'
import './component/auth.less'
import { Link, LightLink, AuthLink } from './component/Link'
import { InputField } from './component/InputField'

// TODO As there is no plug-in for area code selection in line with Chinese values, only + 86 is supported for the moment
export const EmailLogin = defineComponent({
  name: 'EmailLogin',
  setup() {
    return () => (
      <AuthView>
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

        <Button
          class="bd-button__auth"
          onClick={() => {
            console.log('click')
          }}
        >
          登 录
        </Button>
        <div class="auth-back">{`<返回其他登录`}</div>
      </AuthView>
    )
  }
})
