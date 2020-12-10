import { defineComponent, onActivated } from 'vue'
import { parentAP } from '../logic/ap'
import { ArtistActions } from '../module'

export const Desc = defineComponent({
  name: 'ArtistDesc',
  setup() {
    const { state, route, useActions } = parentAP()

    onActivated(() => {
      useActions(ArtistActions.SET_ACTION_ARTIST_DESC, route.params.id)
    })

    return () => (
      <div class="artist-desc">
        <h2>{state.artist.name}简介</h2>
        <div>{state.briefDesc}</div>
        {state.introduction.map(item => (
          <>
            <h2>{item.ti}</h2>
            <div v-html={item.txt.replace(/(.+)\n/g, '<div>$1</div>')}></div>
          </>
        ))}
      </div>
    )
  }
})
