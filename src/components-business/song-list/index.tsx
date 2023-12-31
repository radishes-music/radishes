import { defineComponent, toRefs, PropType } from 'vue'
import { Song } from '@/interface/index'
import { formatCount } from '@/utils/index'
import { DailyCard } from '@/components-business/song-list/daily'
import './index.less'

import Card from './card.vue'

const prefix = 'song'

export const SongList = defineComponent({
  name: 'SongList',
  props: {
    songData: {
      type: Object as PropType<Song[]>,
      required: true
    },
    loading: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    onClick: {
      type: Function as PropType<(song: Song) => void>,
      required: true
    }
  },
  emits: ['click'],
  setup(props, { emit }) {
    const { songData, loading } = toRefs(props)
    const clickHandle = (song: Song) => {
      emit('click', song)
    }

    return () => (
      <div class={`${prefix}-list`}>
        {loading.value ? (
          <div class="grid grid-cols-4 gap-4">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <skeletor class="!h-[180px] !rounded " key={i}></skeletor>
              ))}
          </div>
        ) : (
          <ul>
            {songData?.value?.map(song => (
              <li
                class={`${prefix}-list-container`}
                onClick={() => clickHandle(song)}
                key={song.id}
              >
                <Card song={song}></Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }
})
