import { defineComponent, reactive, ref, toRaw } from 'vue'
import { Filter } from './filter'
import { useArtistSearchModule } from '@/modules'
import { ArtistsActions, Artist } from '@/interface'
import { throttle } from 'lodash-es'
import { merge } from 'lodash-es'
import { Image } from '@/components/image/index'
import { Jump } from '@/shared/jump-shared'
import './index.less'

export const Artists = defineComponent({
  name: 'Artists',
  setup() {
    const wrap = ref<null | Element>()
    const pagination = reactive({
      offsets: 1,
      limit: 30
    })
    const filter = ref({
      type: -1,
      area: -1,
      initial: '-1'
    })
    const jump = new Jump()
    const { useActions, useState } = useArtistSearchModule()

    const state = useState()

    const getArtists = () => {
      const params = merge(pagination, toRaw(filter.value))
      useActions(ArtistsActions.SET_ACTION_ARTISTS, params)
    }

    const changeHandle = () => {
      if (wrap.value) {
        wrap.value.scrollTop = 0
      }
      pagination.offsets = 1
      pagination.limit = 30
      getArtists()
    }

    const toArtist = (artist: Artist) => {
      jump.artist(artist.id)
    }

    const scroll = () => {
      let lastScrollTop = 0
      return (e: Event) => {
        if (e.target) {
          const { scrollHeight, scrollTop, clientHeight } = e.target as Element
          if (scrollTop > lastScrollTop) {
            if (
              scrollHeight - clientHeight - scrollTop < 60 &&
              !state.completed
            ) {
              pagination.offsets += 1
              pagination.limit = pagination.offsets * 30
              getArtists()
            }
          }
          lastScrollTop = scrollTop
        }
      }
    }

    return () => (
      <div class="artists" ref={wrap} onScroll={throttle(scroll(), 200)}>
        <div class="artists-group">
          <Filter v-model={[filter.value, 'value']} onChange={changeHandle} />
        </div>
        <div class="artists-content">
          <ul>
            {state.artists.map(artist => (
              <li onClick={() => toArtist(artist)}>
                <Image name="artist-pic" src={artist?.picUrl} />
                <div class="artist-name">{artist?.name}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
})
