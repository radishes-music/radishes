import { defineComponent, onMounted, reactive, ref } from 'vue'
import { AutoDownload } from '@/electron/event/action-types'
import { AutoUpdateContent } from '@/electron/event/ipc-main/auto-download'
import {
  asyncIpc,
  asyncIpcOrigin,
  asyncShell
} from '@/electron/event/ipc-browser'
import { useDrag } from '@/hooks/index'
import './auto.less'

export default defineComponent({
  name: 'Auto',
  setup() {
    const version = reactive({
      url: '',
      version: '',
      path: ''
    })
    const visible = ref(false)
    const container = ref()
    const target = ref()

    onMounted(() => {
      if (container.value && target.value) {
        const { start } = useDrag(
          container.value as HTMLElement,
          target.value,
          {
            moveCB(x, y) {
              requestAnimationFrame(() => {
                container.value.style.transform = `matrix(1, 0, 0, 1, ${x}, ${y}) translateZ(0)`
              })
            }
          }
        )
        start()
      }
    })

    function handleMessage<T extends keyof AutoUpdateContent>(
      e: unknown,
      type: T,
      content: unknown
    ) {
      // console.log(type, content)
      if (type === AutoDownload.NOT_VERSION) {
        // console.log('content', content)
      }
      // if (type === AutoDownload.VERSION) {
      //   const c = content as AutoUpdateContent[AutoDownload.VERSION]
      //   version.url = c.url
      //   version.version = c.version
      // }
      if (type === AutoDownload.DOWNLOAD_SUCCESS) {
        const c = content as AutoUpdateContent[AutoDownload.DOWNLOAD_SUCCESS]
        visible.value = true
        version.url = c.url
        version.path = c.downloadedFile
        version.version = c.version
      }
    }

    asyncIpcOrigin().then(v => v.on(AutoDownload.MESSAGE, handleMessage))

    const handleShellUrl = (url: string) => {
      asyncShell().then(v => v.openExternal(url))
    }

    const handleUpdater = () => {
      asyncIpc().then(v => {
        v.sendAsyncIpcRendererEvent(AutoDownload.UPGRADE_NOW)
      })
    }

    const handleCloseUpgradeModel = () => {
      visible.value = false
    }

    return () => (
      <div class="auto" v-show={visible.value} ref={container}>
        <div class="auto-header" ref={target}>
          {j18n.load('src__components-business__auto__auto___82')}
        </div>
        <div class="auto-body">
          <ve-button
            type="text"
            size="small"
            onClick={() => handleShellUrl(version.url)}
          >
            {j18n.load('src__components-business__auto__auto___90')}
          </ve-button>
          <ve-button type="text" size="small" onClick={handleUpdater}>
            {j18n.load('src__components-business__auto__auto___93')}(v
            {version.version})
          </ve-button>
          <ve-button type="text" size="small" onClick={handleCloseUpgradeModel}>
            {j18n.load('src__components-business__auto__auto___96')}
          </ve-button>
        </div>
      </div>
    )
  }
})
