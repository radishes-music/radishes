import { defineComponent, nextTick, watch, toRefs } from 'vue'
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
    const setHistoryRoute = (routeObj: { oldRoute: string }) => {
      store.commit(RootMutations.SET_HISTORY_ROUTE, {
        oldRoute: routeObj.oldRoute
      })
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

    const { fullPath } = toRefs(useRoute())

    watch(fullPath, (route, oldRoute) => {
      const { historyRoute } = store.state
      if (!historyRoute.canBeCollect) {
        routeCanBeCollect(true)
      } else {
        const { historyRoute } = store.state
        const backRoute = historyRoute.after[historyRoute.after.length - 1]
        const forwardRoute = historyRoute.before[historyRoute.before.length - 1]
        if (route === backRoute) {
          routeForward(oldRoute)
        } else if (route === forwardRoute) {
          routeBack(oldRoute)
        } else {
          setHistoryRoute({
            oldRoute: oldRoute
          })
        }
      }
    })

    const router = useRouter()
    const handleRouteCommand = (payload: string) => {
      const { historyRoute } = store.state
      routeCanBeCollect(false)
      if (payload === COMMAND.FORWARD) {
        routeForward(fullPath.value)
      }
      if (payload === COMMAND.BACK) {
        routeBack(fullPath.value)
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
      const forward = () => handleRouteCommand(COMMAND.FORWARD)
      const back = () => handleRouteCommand(COMMAND.BACK)
      return (
        <div class="push-shift">
          <ve-button
            disabled={!historyRoute.before.length}
            class={classnames({
              'push-shift-disabled': !historyRoute.before.length
            })}
            onClick={back}
            type="text"
            circle
          >
            <icon icon="toLeft" size={16}></icon>
          </ve-button>
          <ve-button
            disabled={!historyRoute.after.length}
            class={classnames({
              'push-shift-disabled': !historyRoute.after.length
            })}
            onClick={forward}
            type="text"
            circle
          >
            <icon icon="toRight" size={16} color={'#fff'}></icon>
          </ve-button>
        </div>
      )
    }
  }
})
