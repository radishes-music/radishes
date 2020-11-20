import { defineComponent, toRefs, PropType } from 'vue'
import { FindMusicInteface } from '@/interface/index'
import dayjs from 'dayjs'
import './index.less'

const prefix = 'song'

export const SongList = defineComponent({
  name: 'SongList',
  props: {
    songData: {
      type: Object as PropType<FindMusicInteface.Song[]>,
      required: true
    }
  },
  setup(props) {
    const { songData } = toRefs(props)
    return () => (
      <div class={`${prefix}-list`}>
        <ul>
          {songData.value.map(song => (
            <li class={`${prefix}-list-container`}>
              <div class={`${prefix}-pic`}>
                <div
                  class={`${prefix}-pic-img`}
                  style={{ backgroundImage: `url(${song.picUrl})` }}
                >
                  {song.picUrl === '' && (
                    <div class={`${prefix}-pic-img--date`}>
                      <icon icon="rili" size={78}></icon>
                      <div>{dayjs().date()}</div>
                    </div>
                  )}
                </div>
                <div
                  v-show={song.playCount !== 0}
                  class={`${prefix}-pic-count`}
                >
                  {song.playCount}
                </div>
              </div>
              <div class={`${prefix}-title`}>{song.name}</div>
            </li>
          ))}
        </ul>
      </div>
    )
  }
})
