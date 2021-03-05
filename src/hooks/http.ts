import { reactive } from 'vue'
// 有时间去迁移一下到axios
export const useHttp = (fetchFn: Function): any => {
  const state = reactive({
    loading: false
  })

  const doFetch = async (...args: any[]) => {
    state.loading = true
    try {
      const res = await fetchFn(...args)
      state.loading = false
      if (res.code !== 200) {
        throw res
      }
      return res
    } catch (e) {
      state.loading = false
      throw e
    }
  }

  return [state, doFetch]
}
