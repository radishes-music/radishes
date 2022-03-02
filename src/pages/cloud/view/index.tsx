import { defineComponent, onBeforeMount, ref } from 'vue'
import { MusicLayout } from '@/layout/music/music'
import { PlayAll } from '@/components-business/button'
import { Table } from '@/components-business/table/index'
import { playMusic } from '@/shared/music-shared'
import { CloudActions, CloudList, CloudMutations } from '@/interface'
import { useCloudModule } from '@/modules'
import { Button, Upload } from 'ant-design-vue'
import './index.less'

export const Cloud = defineComponent({
  name: 'Cloud',
  setup() {
    const uploading = ref(false)
    const { useState, useActions, useMutations } = useCloudModule()
    const state = useState()

    onBeforeMount(() => {
      useActions(CloudActions.CLOUD_LIST_ACTION)
    })

    const handlePlayAll = () => {
      //
    }

    const handleUploadChange = (e: { file: Record<string, string> }) => {
      uploading.value = 'uploading' === e.file.status
      if ('uploading' === e.file.status) {
        useMutations(CloudMutations.UNSHIFT_CLOUD_LIST, e.file)
      }
      if ('error' === e.file.status) {
        useMutations(CloudMutations.REMOVE_UNSHIFT_CLOUD_LIST)
      }
      if ('done' === e.file.status) {
        useActions(CloudActions.CLOUD_LIST_ACTION)
      }
    }

    const handlePlaySingle = (song: CloudList) => {
      playMusic(song.songId)
    }

    return () => (
      <MusicLayout
        class="cloud"
        v-slots={{
          title: () => <div>音乐云盘</div>,
          head: () => (
            <div class="cloud-head">
              <PlayAll onClick={handlePlayAll} />
              <Upload
                accept="audio/*"
                name="songFile"
                action="/api/cloud"
                showUploadList={false}
                onChange={handleUploadChange}
              >
                <Button
                  shape="round"
                  class="upload-music-btn"
                  loading={uploading.value}
                >
                  上传歌曲
                </Button>
              </Upload>
            </div>
          ),
          body: () => (
            <div class="cloud-body">
              <Table
                list={state.cloudList}
                columnsTypes={['name', 'ar', 'al', 'size', 'dlt']}
                onDblclick={handlePlaySingle}
              />
            </div>
          )
        }}
      />
    )
  }
})
