import { defineComponent, onUnmounted } from 'vue'
import { PlayAll } from '@/components-business/button'
import { Button } from 'ant-design-vue'
import { Table } from '@/components-business/table'
import { useLocalMusicModule } from '@/modules'
import { SongsDetail, FooterMutations } from '@/interface'
import { useFooterModule } from '@/modules/index'
import { importIpc } from '@/electron/event/ipc-browser'
import { ReadLocalFile } from '@/electron/event/action-types'

export const LocalMusicSong = defineComponent({
  name: 'LocalMusicSong',
  setup() {
    const { useState } = useLocalMusicModule()
    const footerModule = useFooterModule()
    const state = useState()

    const handlePlayAll = () => {
      //
    }
    const handlePlaySingle = async (song: SongsDetail & { path: string }) => {
      footerModule.useMutations(FooterMutations.PAUES_MUSIC)
      const renderer = await importIpc()
      const buffer = renderer.sendSyncIpcRendererEvent(
        ReadLocalFile.READ_MP3_FROM_PATH,
        song.path
      )
      footerModule.useMutations(FooterMutations.SET_LOCAL_MUSIC_URL, {
        buffer,
        path: song.path
      })
      footerModule.useMutations(FooterMutations.PLAY_MUSIC)
    }

    onUnmounted(() => {
      // Release the URL object
      footerModule.useMutations(FooterMutations.CLEAR_LOCAL_MUSIC_URL)
    })

    return () => (
      <div class="local-music-song">
        <div class="local-music-head">
          <PlayAll onClick={handlePlayAll} />
          <Button shape="round">同步音乐</Button>
        </div>
        <div class="local-music-body">
          <Table
            list={state.localMusic}
            columnsTypes={['name', 'ar', 'al', 'size', 'dlt']}
            onDblclick={handlePlaySingle}
          />
        </div>
      </div>
    )
  }
})
