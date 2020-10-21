import { defineComponent, ref } from 'vue'
import { Action } from '@/electron/event/action-types'
import { ENV } from '@/interface/app'
import { mapMutations, LayoutActions } from '@/layout/module'
import { IpcRenderer } from '@/electron/event/ipc-renderer'
import { Logo } from '../component/logo'
import { PushShift } from '../component/push-shift'
import { Setting } from '../component/setting'
import './index.less'

const { VUE_APP_PLATFORM } = window as ENV
const actionToClass = {
  [Action.CLOSE_WINDOW]: '',
  [Action.MAXIMIZE_WINDOW]: 'lg',
  [Action.MINIMIZE_WINDOW]: 'sm',
  [Action.RESTORE_WINDOW]: 'md'
}

const importIpc = () => {
  return import('@/electron/event/ipc-renderer').then((v: IpcRenderer) => {
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
    ...mapMutations({
      changeWindowSize: LayoutActions.CHANGE_WINDOW_SIZE
    }),
    handleWindowControl(action: Action) {
      if (VUE_APP_PLATFORM === 'browser') {
        this.changeWindowSize(actionToClass[action])
      }
      if (VUE_APP_PLATFORM === 'electron') {
        importIpc().then(event => {
          event.sendAsyncIpcRendererEvent(action)
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
        <Logo></Logo>
        <div class="header-right">
          <PushShift></PushShift>
          <Setting></Setting>
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
            {VUE_APP_PLATFORM !== 'browser' && (
              <ve-button
                type="text"
                class="header-window-btn"
                onClick={() => this.handleWindowControl(Action.CLOSE_WINDOW)}
              >
                <icon icon="cross" size={22}></icon>
              </ve-button>
            )}
          </div>
        </div>
      </header>
    )
  }
})
