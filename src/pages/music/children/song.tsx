import { defineComponent } from 'vue'
import { PlayAll } from '@/components-business/button'
import { Button } from 'ant-design-vue'
import { Table } from '@/components-business/table'
import { useLocalMusicModule } from '@/modules'

export const LocalMusicSong = defineComponent({
  name: 'LocalMusicSong',
  setup() {
    const { useState } = useLocalMusicModule()
    const state = useState()
    const handlePlayAll = () => {
      //
    }
    const handlePlaySingle = () => {
      //
    }
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
            onDblClick={handlePlaySingle}
          />
        </div>
      </div>
    )
  }
})
