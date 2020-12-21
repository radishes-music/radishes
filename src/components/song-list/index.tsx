import { defineComponent, toRefs, PropType } from 'vue'
import { Song } from '@/interface/index'
import { formatCount } from '@/utils/index'
import { Skeleton } from 'ant-design-vue'
import { DailyCard } from '@/components/song-list/daily'
import './index.less'

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
        <Skeleton loading={loading.value}>
          <ul>
            {songData.value.map(song => (
              <li
                class={`${prefix}-list-container`}
                onClick={() => clickHandle(song)}
              >
                <div class={`${prefix}-pic`}>
                  <DailyCard src={song.picUrl || song.coverImgUrl} />
                  <div
                    v-show={song.playCount !== 0}
                    class={`${prefix}-pic-count`}
                  >
                    {formatCount(song.playCount)}
                  </div>
                </div>
                <div class={`${prefix}-title`}>{song.name}</div>
              </li>
            ))}
          </ul>
        </Skeleton>
      </div>
    )
  }
})
