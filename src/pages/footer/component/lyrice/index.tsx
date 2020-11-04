import { defineComponent, watchEffect } from 'vue'
import { uesModuleStore } from '@/hooks/index'
import { NAMESPACED, State, Getter } from '../../module'

export const PlayLyrice = defineComponent({
  name: 'PlayLyrice',
  setup() {
    const { useGetter } = uesModuleStore<State, Getter>(NAMESPACED)
    const lyrice = useGetter('musicLyrics')

    watchEffect(() => {
      console.log(lyrice)
    })
    return () => <div></div>
  }
})
