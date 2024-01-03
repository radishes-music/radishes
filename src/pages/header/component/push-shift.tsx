import { defineComponent, nextTick, watch } from 'vue'
import { RootMutations } from '@/store/index'
import classnames from 'classnames'
import { useRoute, useStore, useRouter } from '@/hooks/index'
import './puah-shift.less'

enum COMMAND {
  FORWARD = 'FORWARD',
  BACK = 'BACK'
}

export const PushShift = defineComponent({
  name: 'Logo',
  setup() {
    const store = useStore()
    const setHistoryRoute = (oldRoute: string) => {
      store.commit(RootMutations.SET_HISTORY_ROUTE, oldRoute)
    }
    const routeCanBeCollect = (isCollect: boolean) => {
      store.commit(RootMutations.CAN_BE_COLLECT, isCollect)
    }
    const routeForward = (path: string) => {
      store.commit(RootMutations.FORWARD_HISTORY_ROUTE, path)
    }
    const routeBack = (path: string) => {
      store.commit(RootMutations.BACK_HISTORY_ROUTE, path)
    }

    const route = useRoute()

    watch(
      () => route.fullPath,
      (currentRoute, oldRoute) => {
        const { historyRoute } = store.state
        if (
          !historyRoute.canBeCollect ||
          !route.meta.canBeCollect ||
          oldRoute === '/'
        ) {
          routeCanBeCollect(true)
        } else {
          const { historyRoute } = store.state
          const backRoute = historyRoute.after[historyRoute.after.length - 1]
          const forwardRoute =
            historyRoute.before[historyRoute.before.length - 1]
          if (currentRoute === backRoute) {
            routeForward(oldRoute)
          } else if (currentRoute === forwardRoute) {
            routeBack(oldRoute)
          } else {
            setHistoryRoute(oldRoute)
          }
        }
      }
    )

    const router = useRouter()
    const handleRouteCommand = (payload: COMMAND) => {
      const { historyRoute } = store.state
      routeCanBeCollect(false)
      if (payload === COMMAND.FORWARD) {
        routeForward(route.fullPath)
      }
      if (payload === COMMAND.BACK) {
        routeBack(route.fullPath)
      }
      nextTick(() => {
        // TODO Needs optimization
        const path = historyRoute.needRoute.split('?')
        const params = new URLSearchParams(path[1])
        const query = {} as Record<string, string>
        for (const [key, value] of params.entries()) {
          query[key] = value
        }
        router
          .replace({
            path: path[0],
            query: query
          })
          .then(() => {
            routeCanBeCollect(true)
          })
      })
    }

    return () => {
      const { historyRoute } = store.state

      const cantForward = !historyRoute.after.length
      const cantBack = !historyRoute.before.length

      const forward = () => {
        if (cantForward) {
          return
        }
        handleRouteCommand(COMMAND.FORWARD)
      }
      const back = () => {
        if (cantBack) {
          return
        }
        handleRouteCommand(COMMAND.BACK)
      }
      return (
        <div class="push-shift space-x-4 flex items-center">
          <div
            class={classnames(
              'w-5 h-5 bg-[#0000001c] rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer',
              {
                'opacity-40 !cursor-not-allowed': cantBack
              }
            )}
            onClick={back}
          >
            <icon icon="toLeft" size={12}></icon>
          </div>

          <div
            class={classnames(
              'w-5 h-5 bg-[#0000001c] rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer',
              {
                'opacity-40 !cursor-not-allowed': cantForward
              }
            )}
            onClick={forward}
          >
            <icon icon="toRight" size={12} color={'#fff'}></icon>
          </div>
        </div>
      )
    }
  }
})
