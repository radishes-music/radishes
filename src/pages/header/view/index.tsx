import { defineComponent, ref } from 'vue'
import { Action } from '@/electron/event/action-types'
import { ENV } from '@/interface/app'
import { IpcRenderer } from '@/electron/event/ipc-renderer'
import { Logo } from '../component/logo'
import { PushShift } from '../component/push-shift'
import { Setting } from '../component/setting'
import { Search } from '../component/search'
import { uesModuleStore } from '@/hooks/index'
import { NAMESPACED, State, LayoutActions } from '@/layout/module'
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
  name: 'Header',
  setup() {
    const windowSize = ref('enlarge')

    const { useMutations } = uesModuleStore<State>(NAMESPACED)

    const handleWindowControl = (action: Action) => {
      if (VUE_APP_PLATFORM === 'browser') {
        useMutations(LayoutActions.CHANGE_WINDOW_SIZE, actionToClass[action])
      }
      if (VUE_APP_PLATFORM === 'electron') {
        importIpc().then(event => {
          event.sendAsyncIpcRendererEvent(action)
        })
      }
    }

    const windowsChangeSize = () => {
      if (windowSize.value === 'shrink') {
        windowSize.value = 'enlarge'
        handleWindowControl(Action.RESTORE_WINDOW)
      } else {
        windowSize.value = 'shrink'
        handleWindowControl(Action.MAXIMIZE_WINDOW)
      }
    }

    return () => (
      <header class="header">
        <Logo></Logo>
        <div class="header-right">
          <div class="header-right-left" onMousedown={e => e.stopPropagation()}>
            <PushShift></PushShift>
            <Search></Search>
          </div>
          <div
            class="header-right-right"
            onMousedown={e => e.stopPropagation()}
          >
            <Setting></Setting>
            <div class="header-window">
              <ve-button
                type="text"
                class="header-window-btn"
                onClick={() => handleWindowControl(Action.MINIMIZE_WINDOW)}
              >
                <icon icon="shrink-taskbar" size={20}></icon>
              </ve-button>
              <ve-button
                type="text"
                class="header-window-btn"
                onClick={windowsChangeSize}
              >
                <icon icon={windowSize.value} size={20}></icon>
              </ve-button>
              {VUE_APP_PLATFORM !== 'browser' && (
                <ve-button
                  type="text"
                  class="header-window-btn"
                  onClick={() => handleWindowControl(Action.CLOSE_WINDOW)}
                >
                  <icon icon="cross" size={22}></icon>
                </ve-button>
              )}
            </div>
          </div>
        </div>
      </header>
    )
  }
})
