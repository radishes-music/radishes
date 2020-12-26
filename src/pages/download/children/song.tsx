import { defineComponent, onMounted } from 'vue'
import { PlayAll } from '@/components-business/button'
import { Platform } from '@/config/build'
import { Table } from '@/components-business/table'
import { useDownloadModule } from '@/modules'
import { SongsDetail, DownloadMutations } from '@/interface'
import { playMusic } from '@/shared/music-shared'
import './song.less'

const { VUE_APP_PLATFORM } = process.env

export const DownloadSong = defineComponent({
  name: 'DownloadSong',
  setup() {
    const { useState, useMutations } = useDownloadModule()
    const state = useState()
    const play = playMusic()
    const handlePlayAll = () => {
      //
    }

    const handlePlaySingle = (song: SongsDetail) => {
      play(song.id)
    }

    const handleOpenExplorer = () => {
      import('@/electron/utils/index').then(v => {
        v.openExplorer(state.downloadPath)
      })
    }

    onMounted(() => {
      if (VUE_APP_PLATFORM === Platform.ELECTRON) {
        if (!state.downloadPath) {
          import('@/electron/utils/index').then(v => {
            const os = v.getUserOS()
            useMutations(
              DownloadMutations.SET_DOWNLOAD_PATH,
              v.join(os.homedir + '/Music')
            )
          })
        }
      }
    })

    return () => (
      <div class="download-song">
        <div class="download-song-head">
          <PlayAll onClick={handlePlayAll} />
          {VUE_APP_PLATFORM === Platform.ELECTRON && (
            <div class="download-song-head--dir">
              存储目录：{state.downloadPath}{' '}
              <ve-button type="text" onClick={handleOpenExplorer}>
                打开目录
              </ve-button>
            </div>
          )}
        </div>
        <div class="download-song-body">
          <Table
            list={state.downloaded}
            columnsTypes={['name', 'ar', 'al', 'size', 'dlt']}
            onDblClick={handlePlaySingle}
          />
        </div>
      </div>
    )
  }
})
