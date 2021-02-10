import { watch } from 'vue'
import { useRoute } from '@/hooks/index'

export const effectWords = (
  cb: (word: string, deps?: unknown[]) => void,
  deps: unknown[]
) => {
  const route = useRoute()

  cb(route.query.words as string)
  watch([() => route.query.words, ...deps], ([words, deps]) => {
    cb((words as unknown) as string, deps as unknown[])
  })
}
