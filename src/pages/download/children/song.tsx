import { defineComponent } from 'vue'
import { PlayAll } from '@/components-business/button'
import { Table } from '@/components-business/table'
import { useDownloadModule } from '@/modules'
import { SongsDetail } from '@/interface'
import { playMusic } from '@/shared/music-shared'
import { useRouter } from 'vue-router'
import './song.less'
import { isElectron } from '@/utils'

export const DownloadSong = defineComponent({
  name: 'DownloadSong',
  setup() {
    const router = useRouter()
    const { useState } = useDownloadModule()
    const state = useState()

    const handlePlayAll = () => {
      //
    }

    const handlePlaySingle = (song: SongsDetail) => {
      playMusic(song.id)
    }

    const handleOpenExplorer = () => {
      shell.openExternal(state.downloadPath)
    }

    const handleSettingDwonload = () => {
      router.push({
        path: '/setting/download'
      })
    }

    return () => (
      <div class="download-song">
        <div class="download-song-head">
          <PlayAll onClick={handlePlayAll} />
          {isElectron && (
            <div class="download-song-head--dir">
              存储目录：{state.downloadPath}
              <ve-button type="text" onClick={handleOpenExplorer}>
                打开目录
              </ve-button>
              <ve-button type="text" onClick={handleSettingDwonload}>
                设置
              </ve-button>
            </div>
          )}
        </div>
        <div class="download-song-body">
          <Table
            list={state.downloaded}
            columnsTypes={['name', 'ar', 'al', 'size', 'dlt', 'remove']}
            onDblclick={handlePlaySingle}
          />
        </div>
      </div>
    )
  }
})
