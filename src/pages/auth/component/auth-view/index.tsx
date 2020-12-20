import { defineComponent, onMounted } from 'vue'
import { MaskView } from '../mask-view'
import './index.less'
import { useStore } from 'vuex'
import { hideAuth } from '@/helpers'

export const AuthView = defineComponent({
  setup(props, { slots }) {
    onMounted(() => {
      window.history.pushState(null, 'RADISHES', location.href)
      window.addEventListener(
        'popstate',
        () => {
          hideAuth()
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
              onClick={hideAuth}
            />
            {/* 想在这里加一个动画效果，让它做一个类似页面翻转的动画 */}
            <div class="auth-view__box">{slots.default?.()}</div>
          </div>
        </MaskView>
      )
    }
  }
})
