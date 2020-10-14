import { defineComponent } from 'vue'
import {
  MINIMIZE_WINDOW,
  MAXIMIZE_WINDOW,
  RESTORE_WINDOW
} from '@/electron/event/actionTypes'
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
  methods: {
    handleMini(e: Event) {
      if (VUE_APP_PLATFORM === 'browser') {
        // TODO Browser zoom out to be determined
        console.log(e)
      }
      if (VUE_APP_PLATFORM === 'electron') {
        importIpc().then(event => {
          event.sendAsyncIpcRendererEvent(MINIMIZE_WINDOW, '')
        })
      }
    },
    handleMax(e: Event) {
      if (VUE_APP_PLATFORM === 'browser') {
        // TODO Browser zoom out to be determined
        console.log(e)
      }
      if (VUE_APP_PLATFORM === 'electron') {
        importIpc().then(event => {
          event.sendAsyncIpcRendererEvent(MAXIMIZE_WINDOW, '')
        })
      }
    },
    handleRestore(e: Event) {
      if (VUE_APP_PLATFORM === 'browser') {
        // TODO Browser zoom out to be determined
        console.log(e)
      }
      if (VUE_APP_PLATFORM === 'electron') {
        importIpc().then(event => {
          event.sendAsyncIpcRendererEvent(RESTORE_WINDOW, '')
        })
      }
    }
  },
  render() {
    return (
      <header class="header">
        <button onClick={this.handleRestore}>恢复</button>
        <button onClick={this.handleMax}>放大</button>
        <button onClick={this.handleMini}>缩小到任务栏</button>
      </header>
    )
  }
})
