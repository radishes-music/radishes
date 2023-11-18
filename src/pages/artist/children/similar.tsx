import { defineComponent, onActivated } from 'vue'
import { Grid } from '../components/grid'
import { Artists, ArtistActions } from '@/interface/index'
import { parentAP } from '../logic/ap'
import { Jump } from '@/shared/jump-shared'

export const Similar = defineComponent({
  name: 'ArtistSimilar',
  setup() {
    const jump = new Jump()
    const { state, route, useActions } = parentAP()

    onActivated(() => {
      useActions(
        ArtistActions.SET_ACTION_ARTIST_SIMI,
        route.params.id as string
      )
    })

    const handleClick = (item: Artists) => {
      jump.artist(item.id)
    }

    return () => (
      <div class="artist-similar">
        <Grid source={state.simi} onClick={handleClick} />
      </div>
    )
  }
})
