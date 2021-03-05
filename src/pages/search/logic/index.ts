import { useUrlParams } from '@/hooks/index'

export const useEffectWords = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cb: (...args: any[]) => void,
  deps?: unknown
) => {
  return useUrlParams('words', cb, deps)
}
