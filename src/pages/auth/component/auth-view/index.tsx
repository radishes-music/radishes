import { defineComponent, onMounted } from 'vue'
import { MaskView } from '../mask-view'
import './index.less'
import { useStore } from 'vuex'

export const AuthView = defineComponent({
  setup(props, { slots }) {
    const $store = useStore()
    const doClose = () => {
      $store.commit('Auth/HIDE_VIEW')
    }

    onMounted(() => {
      window.history.pushState(null, '123', location.href)
      window.addEventListener(
        'popstate',
        () => {
          doClose()
        },
        {
          once: true
        }
      )
    })

    // TODO 怎么操作呢??
    return () => {
      return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        <MaskView class="vh-center">
          <div class="auth-view">
            <icon
              icon="cross-fill"
              color="rgb(153,153,153)"
              size={18}
              class="auth-view__close"
              onClick={doClose}
            />
            {/* 想在这里加一个动画效果，让它做一个类似页面翻转的动画 */}
            <div class="auth-view__box">{slots.default?.()}</div>
          </div>
        </MaskView>
      )
    }
  }
})
