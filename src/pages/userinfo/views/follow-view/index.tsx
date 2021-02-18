/**
 * Created by buddy on 2021/2/18.
 */
import { defineComponent, onMounted, reactive } from 'vue'
import { useGetFollowList } from '@/pages/userinfo/hooks'
import { EmptyList } from '@/pages/userinfo/component/empty-list'
import { FollowCard } from '@/pages/userinfo/views/follow-view/Card'

export const FollowView = defineComponent({
  name: 'FollowView',
  setup() {
    const loadData = useGetFollowList()
    const state = reactive({
      list: []
    })

    onMounted(() => {
      loadData().then((res: any) => {
        if (res) {
          state.list = res
        }
      })
    })

    return () =>
      state.list.length === 0 ? (
        <EmptyList text="暂无关注"></EmptyList>
      ) : (
        <div class="list-view">
          {state.list.map((info: any) => (
            <FollowCard info={info}></FollowCard>
          ))}
        </div>
      )
  }
})
