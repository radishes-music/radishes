import { defineComponent, ComponentPublicInstance, ref, nextTick } from 'vue'
import { mapMutations, Store, MutationMethod, mapState } from 'vuex'
import { Mutations } from '@/store/index'
import { RootState } from '@/store/index'
import classnames from 'classnames'
import './puah-shift.less'

interface Mtehods {
  routeForward: MutationMethod
  routeBack: MutationMethod
  setHistoryRoute: MutationMethod
  routeCanBeCollect: MutationMethod
  handleRouteCommand: (payload: string) => void
}

enum COMMAND {
  FORWARD = 'FORWARD',
  BACK = 'BACK'
}

type This = ComponentPublicInstance & {
  $store: Store<RootState>
} & Mtehods

export const PushShift = defineComponent({
  name: 'Logo',
  watch: {
    $route(this: This, route, oldRoute) {
      const { historyRoute } = this.$store.state
      console.log(historyRoute.canBeCollect)
      if (!historyRoute.canBeCollect) {
        this.routeCanBeCollect(true)
      } else {
        this.setHistoryRoute(oldRoute.path)
      }
    }
  },
  methods: {
    ...mapMutations({
      setHistoryRoute: Mutations.SET_HISTORY_ROUTE,
      routeBack: Mutations.BACK_HISTORY_ROUTE,
      routeForward: Mutations.FORWARD_HISTORY_ROUTE,
      routeCanBeCollect: Mutations.CAN_BE_COLLECT
    }),
    handleRouteCommand(this: This, payload: string) {
      this.routeCanBeCollect(false)
      if (payload === COMMAND.FORWARD) {
        this.routeForward(this.$route.path)
      }
      if (payload === COMMAND.BACK) {
        this.routeBack(this.$route.path)
      }
      nextTick(() => {
        const { historyRoute } = this.$store.state
        console.log(historyRoute)
        this.$router
          .replace({
            path: historyRoute.needRoute
          })
          .then(() => {
            this.routeCanBeCollect(true)
          })
      })
    }
  },
  render(this: This) {
    const { historyRoute } = this.$store.state
    const forward = () => this.handleRouteCommand(COMMAND.FORWARD)
    const back = () => this.handleRouteCommand(COMMAND.BACK)
    return (
      <div class="push-shift">
        <ve-button
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
})
