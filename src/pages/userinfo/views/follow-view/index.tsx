/**
 * Created by buddy on 2021/2/18.
 */
import { defineComponent, reactive } from 'vue'
import { List } from 'vant'
import { EmptyList } from '@/pages/userinfo/component/empty-list'
import { FollowCard } from '@/pages/userinfo/views/follow-view/card'
import { useRoute, useUserFollows } from '@/hooks'

export const FollowView = defineComponent({
  name: 'FollowView',
  setup() {
    const $route: any = useRoute()

    const loadData = useUserFollows($route.params.uid)

    const state: any = reactive({
      loading: false,
      finished: false,
      error: false,
      list: []
    })

    const onLoad = async () => {
      state.loading = true
      try {
        const res: any = await loadData(state.list.length)
        state.finished = !res.more
        state.list = [...state.list, ...res.follow]
        state.loading = false
      } catch (e) {
        state.loading = false
        state.error = true
      }
    }

    return () => {
      return (
        <List
          onLoad={onLoad}
          loading={state.loading}
          finished={state.finished}
          finishedText="没有更多了"
          error={state.error}
          errorText="请求失败，点击重新加载"
        >
          {state.list.length === 0 ? (
            <EmptyList text="暂无关注"></EmptyList>
          ) : (
            <div class="list-view">
              {state.list.map((info: any) => (
                <FollowCard info={info}></FollowCard>
              ))}
            </div>
          )}
        </List>
      )
    }
  }
})
