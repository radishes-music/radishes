import { onActivated, onMounted, ref } from 'vue'

export const useOnActivated = (fn: () => void) => {
  const isMounted = ref(false)

  onMounted(() => {
    isMounted.value = true
  })

  onActivated(() => {
    if (isMounted.value) {
      fn()
    }
  })
}
