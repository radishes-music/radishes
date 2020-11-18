import { reactive, computed } from 'vue'

export const useText = (defaultText = ''): any => {
  const state = reactive<{ text: string }>({
    text: defaultText
  })

  const setText = (text: string): void => {
    state.text = text
  }

  const isNullText = computed(() => state.text === '')

  return [state, setText, isNullText]
}
