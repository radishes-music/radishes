import { defineComponent, toRefs } from 'vue'
import { FindMusicInteface } from '@/interface/index'
import './index.less'

const prefix = 'song'

export const SongList = defineComponent({
  name: 'SongList',
  props: {
    songData: {
      type: Object as () => FindMusicInteface.Song[],
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
                ></div>
                <div class={`${prefix}-pic-count`}>{song.playCount}</div>
              </div>
              <div class={`${prefix}-title`}>{song.name}</div>
            </li>
          ))}
        </ul>
      </div>
    )
  }
})
