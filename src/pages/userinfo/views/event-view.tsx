/**
 * Created by buddy on 2021/2/18.
 */
import { defineComponent, onMounted, reactive } from 'vue'
import { useGetEventList } from '@/pages/userinfo/hooks'
import { EmptyList } from '@/pages/userinfo/component/empty-list'

export const EventView = defineComponent({
  name: 'EventView',
  setup() {
    const state = reactive({
      list: []
    })

    const getEventList = useGetEventList()

    onMounted(() => {
      getEventList().then((res: any) => {
        if (res) {
          state.list = res
        }
      })
    })

    return () =>
      state.list.length === 0 ? (
        <EmptyList
          text={$t('src__pages__userinfo__views__event-view___26')}
        ></EmptyList>
      ) : (
        <div>{JSON.stringify(state.list)}</div>
      )
  }
})
