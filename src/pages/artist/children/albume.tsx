import { defineComponent, onActivated } from 'vue'
import { ArtistActions } from '../module'
import { Grid } from '../components/grid'
import { parentAP } from '../logic/ap'

export const Albume = defineComponent({
  name: 'ArtistAlbume',
  setup() {
    const { state, route, useActions } = parentAP()

    onActivated(() => {
      useActions(ArtistActions.SET_ACTION_ARTIST_ALBUM, route.params.id)
    })

    return () => (
      <div class="artist-albume">
        <Grid source={state.album} />
      </div>
    )
  }
})
