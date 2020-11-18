import { reactive } from 'vue'
export const useHttp = (fetchFn: Function): any => {
  const state = reactive({
    loading: false
  })

  const doFetch = async (...args: any[]) => {
    state.loading = false
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
