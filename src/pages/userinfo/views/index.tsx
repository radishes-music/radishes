/**
 * Created by buddy on 2021/2/22.
 */
import { defineComponent, onMounted, reactive, watch } from 'vue'
import { useLoadUserInfo, useRoute, useUserInfoLoading } from '@/hooks'

import { Loading } from '@/components/loading'
import { UserInfoWidget } from '@/pages/userinfo/component/userinfo-widget'

export default defineComponent({
  name: 'UserInfo',
  setup() {
    const state: any = reactive({
      res: {}
    })

    const $route: any = useRoute()
    const loadUserInfo = useLoadUserInfo()
    const userInfoLoading = useUserInfoLoading()

    watch(
      () => $route.params.uid,
      (uid: string) => {
        if (!uid) {
          return
        }
        state.res = {}
        loadUserInfo(uid).then(res => (state.res = res))
      }
    )

    onMounted(() => {
      loadUserInfo($route.params.uid).then(res => (state.res = res))
    })

    return function () {
      if (userInfoLoading.value || JSON.stringify(state.res) === '{}') {
        return <Loading></Loading>
      }

      return (
        <UserInfoWidget
          userId={$route.params.uid}
          profile={state.res.profile}
          audio={state.res.audio}
        ></UserInfoWidget>
      )
    }
  }
})
