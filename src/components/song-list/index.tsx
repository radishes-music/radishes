import { defineComponent, onBeforeMount } from 'vue'
import { FindMusicInteface } from '@/interface/index'
import './index.less'

interface Props {
  songData: FindMusicInteface.Song[]
}

export const SongList = defineComponent({
  name: 'SongList',
  props: ['songData'],
  render() {
    const { songData } = this.$props as Props
    return (
      <div class="song-list">
        <ul>
          {songData.map(song => (
            <li class="song-list-container">
              <div class="song-pic">
                <div
                  class="song-pic-img"
                  style={{ backgroundImage: `url(${song.picUrl})` }}
                ></div>
                <div class="song-pic-count">{song.playCount}</div>
              </div>
              <div class="song-title">{song.name}</div>
            </li>
          ))}
        </ul>
      </div>
    )
  }
})
