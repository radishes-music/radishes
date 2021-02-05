import { defineComponent, reactive, ref } from 'vue'
import { ipcRenderer, shell } from 'electron'
import { AutoDownload } from '@/electron/event/action-types'
import { AutoUpdateContent } from '@/electron/event/ipc-main/auto-download'
import './auto.less'
import { asyncIpc } from '@/electron/event/ipc-browser'

export default defineComponent({
  name: 'Auto',
  setup() {
    const version = reactive({
      url: '',
      version: '',
      path: ''
    })
    const visible = ref(false)

    function handleMessage<T extends keyof AutoUpdateContent>(
      e: unknown,
      type: T,
      content: unknown
    ) {
      // console.log(type, content)
      if (type === AutoDownload.NOT_VERSION) {
        console.log('content', content)
      }
      if (type === AutoDownload.VERSION) {
        const c = content as AutoUpdateContent[AutoDownload.VERSION]
        version.url = c.url
        version.version = c.version
      }
      if (type === AutoDownload.DOWNLOAD_SUCCESS) {
        const c = content as AutoUpdateContent[AutoDownload.DOWNLOAD_SUCCESS]
        visible.value = true
        version.path = c.downloadedFile
      }
    }

    ipcRenderer.on(AutoDownload.MESSAGE, handleMessage)

    const handleShellUrl = (url: string) => {
      shell.openExternal(url)
    }

    const handleUpdater = () => {
      // autoUpdater.quitAndInstall()
      asyncIpc().then(v => {
        v.sendAsyncIpcRendererEvent(AutoDownload.UPGRADE_NOW)
      })
    }

    const handleCloseUpgradeModel = () => {
      visible.value = false
    }

    return () => (
      <div class="auto" v-show={visible.value}>
        <div class="auto-header">有更新可用</div>
        <div class="auto-body">
          <div>
            <ve-button
              type="text"
              size="small"
              onClick={() => handleShellUrl(version.url)}
            >
              更新日志
            </ve-button>
            <ve-button type="text" size="small" onClick={handleUpdater}>
              立即更新(v{version.version})
            </ve-button>
            <ve-button
              type="text"
              size="small"
              onClick={handleCloseUpgradeModel}
            >
              关闭
            </ve-button>
          </div>
        </div>
      </div>
    )
  }
})
