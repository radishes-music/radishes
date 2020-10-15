import { defineComponent, ref } from 'vue'
import {
  MINIMIZE_WINDOW,
  MAXIMIZE_WINDOW,
  RESTORE_WINDOW
} from '@/electron/event/actionTypes'
import { ENV } from '@/interface/app'
import './index.less'

export enum Action {
  MINIMIZE_WINDOW = 'MINIMIZE_WINDOW',
  MAXIMIZE_WINDOW = 'MAXIMIZE_WINDOW',
  RESTORE_WINDOW = 'RESTORE_WINDOW'
}

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
          <icon
            icon="shrink-taskbar"
            size={20}
            onClick={() => this.handleWindowControl(Action.MINIMIZE_WINDOW)}
          ></icon>
          <icon
            icon={windowSize}
            onClick={this.windowsChangeSize}
            size={20}
          ></icon>
          <icon icon="cross" size={24}></icon>
        </div>
      </header>
    )
  }
})
