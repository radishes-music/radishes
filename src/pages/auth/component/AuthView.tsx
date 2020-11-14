import { defineComponent, onMounted } from 'vue'
import { MaskView } from './MaskView'
import './auth.less'
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

    return () => {
      return (
        <MaskView class="vh-center">
          <div class="auth-view">
            <icon
              icon="cross-fill"
              color="rgb(153,153,153)"
              size={18}
              class="auth-view__close"
              onClick={doClose}
            />
            <div class="auth-view__box">{slots.default?.()}</div>
          </div>
        </MaskView>
      )
    }
  }
})
