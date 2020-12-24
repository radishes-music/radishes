import { defineComponent } from 'vue'
import { PlayAll } from '@/components-business/button'
import { Platform } from '@/config/build'
import './song.less'

const { VUE_APP_PLATFORM } = process.env

export const DownloadSong = defineComponent({
  name: 'DownloadSong',
  setup() {
    return () => (
      <div class="download-song">
        <div class="download-song-head">
          <PlayAll />
          {VUE_APP_PLATFORM === Platform.ELECTRON && <div>存储目录：</div>}
        </div>
      </div>
    )
  }
})
