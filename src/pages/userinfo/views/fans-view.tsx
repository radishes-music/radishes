/**
 * Created by buddy on 2021/2/18.
 */
import { defineComponent, onMounted, reactive } from 'vue'
import { useGetFansList } from '@/pages/userinfo/hooks'
import { EmptyList } from '@/pages/userinfo/component/empty-list'

export const FansView = defineComponent({
  name: 'FansView',
  setup() {
    const state = reactive({
      list: []
    })
    const getFansList = useGetFansList()

    onMounted(() => {
      getFansList().then((res: any) => {
        if (res) {
          state.list = res
        }
      })
    })

    return () =>
      state.list.length === 0 ? (
        <EmptyList text="暂无粉丝"></EmptyList>
      ) : (
        <div>{JSON.stringify(state.list)}</div>
      )
  }
})
