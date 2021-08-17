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
      import('@/electron/utils/index').then(v => {
        v.openExplorer(state.downloadPath)
      })
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
              {$t('src__pages__download__children__song___43')}：
              {state.downloadPath}
              <ve-button type="text" onClick={handleOpenExplorer}>
                {$t('src__pages__download__children__song___45')}
              </ve-button>
              <ve-button type="text" onClick={handleSettingDwonload}>
                {$t('src__pages__download__children__song___48')}
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
