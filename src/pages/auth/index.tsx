import { defineComponent, Transition } from 'vue'
import { useAuth } from '@/hooks/auth'

import { PhoneLogin } from './PhoneLogin'

export const AuthBox = defineComponent({
  name: 'AuthBox',

  setup() {
    const { isShow } = useAuth()

    return () => (
      <Transition name="fade">
        {isShow.value ? <PhoneLogin></PhoneLogin> : null}
      </Transition>
    )
  }
})
