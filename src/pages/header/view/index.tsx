import { computed, defineComponent } from 'vue'
import { Action } from '@/electron/event/action-types'
import { asyncIpc } from '@/electron/event/ipc-browser'
import { Logo } from '../component/logo'
import { PushShift } from '../component/push-shift'
import { Setting } from '../component/setting'
import { Search } from '../component/search'
import { LayoutMutations, LayoutSize } from '@/interface'
import { useLayoutModule } from '@/modules/index'
import { isBrowser, isElectron, isWindows } from '@/utils'
import './index.less'
import classnames from 'classnames'

import SearchBox from '../component/search.vue'

const actionToClass = {
  [Action.CLOSE_WINDOW]: '',
  [Action.MAXIMIZE_WINDOW]: 'lg',
  [Action.MINIMIZE_WINDOW]: 'sm',
  [Action.RESTORE_WINDOW]: 'md'
}

export const Header = defineComponent({
  name: 'Header',
  setup() {
    const { useState, useMutations } = useLayoutModule()
    const state = useState()

    const handleWindowControl = (action: Action) => {
      if (isBrowser) {
        useMutations(LayoutMutations.CHANGE_WINDOW_SIZE, actionToClass[action])
      }
      if (isElectron) {
        asyncIpc().then(event => {
          event.sendAsyncIpcRendererEvent(action)
        })
      }
    }

    const windowSize = computed(() => {
      return state.screenSize === LayoutSize.MD ? 'enlarge' : 'shrink'
    })

    const windowsChangeSize = () => {
      if (windowSize.value === 'shrink') {
        handleWindowControl(Action.RESTORE_WINDOW)
      } else {
        handleWindowControl(Action.MAXIMIZE_WINDOW)
      }
    }

    if (isElectron) {
      window.addEventListener('resize', () => {
        electronAPI.isMaximized((isMax: boolean) => {
          const size = isMax ? LayoutSize.LG : LayoutSize.MD
          useMutations(LayoutMutations.CHANGE_WINDOW_SIZE, size)
        })
      })
    }

    return () => (
      <header class="header">
        <Logo></Logo>
        <div class="header-right">
          <div
            class="header-right-left space-x-4 flex items-center"
            onMousedown={e => e.stopPropagation()}
          >
            <PushShift></PushShift>
            {/* <Search></Search> */}
            <SearchBox></SearchBox>
          </div>
          <div
            class="header-right-right"
            onMousedown={e => e.stopPropagation()}
          >
            <Setting></Setting>
            {(isWindows || isBrowser) && (
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
                {isElectron && (
                  <ve-button
                    type="text"
                    class="header-window-btn"
                    onClick={() => handleWindowControl(Action.CLOSE_WINDOW)}
                  >
                    <icon icon="cross" size={22}></icon>
                  </ve-button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
    )
  }
})
