import { defineComponent, toRefs, PropType } from 'vue'
import { Song } from '@/interface/index'
import { formatCount } from '@/utils/index'
import dayjs from 'dayjs'
import './index.less'

const prefix = 'song'

export type Handle = 'click' | 'mouseenter'

export const SongList = defineComponent({
  name: 'SongList',
  props: {
    songData: {
      type: Object as PropType<Song[]>,
      required: true
    },
    handle: {
      type: Function as PropType<(type: Handle, payload: Song) => void>,
      required: true
    }
  },
  setup(props) {
    const { songData, handle } = toRefs(props)
    const clickHandle = (song: Song) => {
      handle.value('click', song)
    }
    return () => (
      <div class={`${prefix}-list`}>
        <ul>
          {songData.value.map(song => (
            <li
              class={`${prefix}-list-container`}
              onClick={() => clickHandle(song)}
            >
              <div class={`${prefix}-pic`}>
                <div
                  class={`${prefix}-pic-img`}
                  style={{
                    backgroundImage: `url(${song.picUrl || song.coverImgUrl})`
                  }}
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
                  {formatCount(song.playCount)}
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
