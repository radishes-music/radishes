import { reactive } from 'vue'

export const useHttp = (fetchFn: Function): any => {
  const state = reactive({
    loading: false
  })

  const doFetch = async (...args: any[]) => {
    state.loading = true
    try {
      const res = await fetchFn(...args)
      state.loading = false
      return res
    } catch (e) {
      state.loading = false
      throw e
    }
  }

  return [state, doFetch]
}
