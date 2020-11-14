import { defineComponent, reactive } from 'vue'
import { AuthView } from './component/AuthView'
import { Button } from './component/Button'
import './component/auth.less'
import { AuthLink } from './component/Link'
import { InputField } from './component/InputField'

// TODO As there is no plug-in for area code selection in line with Chinese values, only + 86 is supported for the moment
export const ResetPwd = defineComponent({
  name: 'ResetPwd',
  setup() {
    const state = reactive({ checked: false })

    const clause = [
      { name: '《服务条款》', link: '' },
      { name: '《隐私政策》', link: '' },
      { name: '《儿童隐私政策》', link: '' }
    ]

    return () => (
      <AuthView>
        <div class="vh-center auth-view__icon">
          <icon icon="diepian" color="rgb(242,156,159)" size="96" />
        </div>
        <div class="auth-view__inputbox">
          <InputField
            bold
            placeholder="请输入手机号"
            v-slots={{
              left: () => (
                <div class="country-code">
                  <icon icon="shouji" size={18} color="#b8b8b8"></icon>
                  <div class="country-code__num">+86</div>
                </div>
              )
            }}
          ></InputField>
          <InputField
            placeholder="设置登陆密码，不少于6位"
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            type="password"
            v-slots={{
              left: () => (
                <div style="padding-left:8px;">
                  <icon icon="suodakaimima" size={18} color="#b8b8b8"></icon>
                </div>
              )
            }}
          ></InputField>
        </div>

        <Button
          class="bd-button__auth"
          onClick={() => {
            console.log('click')
          }}
        >
          下一步
        </Button>

        <div class="auth-back">{`< 返回登录`}</div>
      </AuthView>
    )
  }
})
