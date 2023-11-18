import { defineComponent } from 'vue'
import { Album } from '@/interface'
import { Grid } from '../components/grid'
import { parentAP } from '../logic/ap'
import { Jump } from '@/shared/jump-shared'

export const Albume = defineComponent({
  name: 'ArtistAlbume',
  setup() {
    const { state } = parentAP()

    // Directly coming from search will not trigger the activated event
    const jump = new Jump()
    const handleClick = (item: Album) => {
      jump.albumList(item.id)
    }

    return () => (
      <div class="artist-albume">
        <Grid source={state.album} onClick={handleClick} />
      </div>
    )
  }
})
