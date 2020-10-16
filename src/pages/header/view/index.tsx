import { defineComponent, ref } from 'vue'
import { Action } from '@/electron/event/actionTypes'
import { ENV } from '@/interface/app'
import './index.less'

const { VUE_APP_PLATFORM } = window as ENV

const importIpc = () => {
  return import('@/electron/event/ipc-renderer').then((v: any) => {
    return {
      sendAsyncIpcRendererEvent: v.sendAsyncIpcRendererEvent,
      sendSyncIpcRendererEvent: v.sendSyncIpcRendererEvent
    }
  })
}

export const Header = defineComponent({
  setup() {
    const windowSize = ref('enlarge')
    return {
      windowSize
    }
  },
  methods: {
    handleWindowControl(action: Action) {
      if (VUE_APP_PLATFORM === 'browser') {
        // TODO Browser zoom out to be determined
        console.log(action)
      }
      if (VUE_APP_PLATFORM === 'electron') {
        importIpc().then(event => {
          event.sendAsyncIpcRendererEvent(action, '')
        })
      }
    },
    windowsChangeSize() {
      const { windowSize } = this
      if (windowSize === 'shrink') {
        this.windowSize = 'enlarge'
        this.handleWindowControl(Action.RESTORE_WINDOW)
      } else {
        this.windowSize = 'shrink'
        this.handleWindowControl(Action.MAXIMIZE_WINDOW)
      }
      this.windowSize = windowSize === 'shrink' ? 'enlarge' : 'shrink'
    }
  },
  render() {
    const { windowSize } = this
    return (
      <header class="header">
        <div class="header-window">
          <ve-button
            type="text"
            class="header-window-btn"
            onClick={() => this.handleWindowControl(Action.MINIMIZE_WINDOW)}
          >
            <icon icon="shrink-taskbar" size={20}></icon>
          </ve-button>
          <ve-button
            type="text"
            class="header-window-btn"
            onClick={this.windowsChangeSize}
          >
            <icon icon={windowSize} size={20}></icon>
          </ve-button>
          <ve-button
            type="text"
            class="header-window-btn"
            onClick={() => this.handleWindowControl(Action.CLOSE_WINDOW)}
          >
            <icon icon="cross" size={20}></icon>
          </ve-button>
        </div>
      </header>
    )
  }
})
