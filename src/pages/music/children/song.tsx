import { defineComponent, onUnmounted, toRaw } from 'vue'
import { PlayAll } from '@/components-business/button'
import { Button } from 'ant-design-vue'
import { Table } from '@/components-business/table'
import { useLocalMusicModule } from '@/modules'
import { SongsDetail, LocalMusicMutations, LocalMusicDetail } from '@/interface'
import { asyncIpc } from '@/electron/event/ipc-browser'
import { ReadLocalFile } from '@/electron/event/action-types'
import { playMusic, clearLocalMusicUrl } from '@/shared/music-shared'
import { cloneDeep } from 'lodash-es'

export const LocalMusicSong = defineComponent({
  name: 'LocalMusicSong',
  setup() {
    const { useState, useMutations } = useLocalMusicModule()
    const state = useState()

    const handlePlayAll = () => {
      //
    }
    const handlePlaySingle = async (song: SongsDetail & LocalMusicDetail) => {
      const music = cloneDeep(toRaw(song))
      const renderer = await asyncIpc()
      const buffer = renderer.sendSyncIpcRendererEvent(
        ReadLocalFile.READ_MP3_FROM_PATH,
        music.path
      )
      music.buffer = buffer as Buffer
      music.id = Number(atob(String(music.id)))
      playMusic(music)
    }
    const handleSyncMusic = async () => {
      const songs = await electronAPI.readPathMusic(
        state.localPath.map(item => item.path)
      )

      useMutations(LocalMusicMutations.SET_LOCAL_MUSIC, songs)
    }

    onUnmounted(() => {
      // Release the URL object
      clearLocalMusicUrl()
    })

    return () => (
      <div class="local-music-song">
        <div class="local-music-head">
          <PlayAll onClick={handlePlayAll} />
          <Button shape="round" onClick={handleSyncMusic}>
            同步音乐
          </Button>
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
