import { defineComponent } from 'vue'
import { Album } from '@/interface'
import { Grid } from '../components/grid'
import { parentAP } from '../logic/ap'

export const Albume = defineComponent({
  name: 'ArtistAlbume',
  setup() {
    const { state, router } = parentAP()

    // Directly coming from search will not trigger the activated event

    const handleClick = (item: Album) => {
      router.push({
        path: '/list/album/' + item.id
      })
    }

    return () => (
      <div class="artist-albume">
        <Grid source={state.album} onClick={handleClick} />
      </div>
    )
  }
})
