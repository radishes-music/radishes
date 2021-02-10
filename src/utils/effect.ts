import { watchEffect } from 'vue'

export const useCallback = (fn: (...args: any[]) => void, deps: any[]) => {
  return fn
}
