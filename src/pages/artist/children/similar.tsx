import { defineComponent, onActivated } from 'vue'
import { ArtistActions } from '../module'
import { Grid } from '../components/grid'
import { Artists } from '@/interface/index'
import { parentAP } from '../logic/ap'

export const Similar = defineComponent({
  name: 'ArtistSimilar',
  setup() {
    const { state, route, router, useActions } = parentAP()

    onActivated(() => {
      useActions(ArtistActions.SET_ACTION_ARTIST_SIMI, route.params.id)
    })

    const handleClick = (item: Artists) => {
      router.push({
        path: '/artist/' + item.id + '/album'
      })
    }

    return () => (
      <div class="artist-similar">
        <Grid source={state.simi} onClick={handleClick} />
      </div>
    )
  }
})
