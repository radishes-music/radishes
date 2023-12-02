import { BrowserWindow } from 'electron'
import eventBus from './eventBus'
import {
  EVENT_MUSICCONTROL_LIKE_EMITTER,
  EVENT_MUSICCONTROL_LYRICS_OPEN_OR_CLOSE_EMITTER,
  EVENT_MUSICCONTROL_NEXT_EMITTER,
  EVENT_MUSICCONTROL_PLAY_OR_PAUSE_EMITTER,
  EVENT_MUSICCONTROL_PREV_EMITTER,
  EVENT_MUSICCONTROL_VOLDOWN_EMITTER,
  EVENT_MUSICCONTROL_VOLUP_EMITTER,
  EVENT_SETUP_MENU
} from '@/constants'
import store from '@/store'
import { isElectron } from '@/constants'

export const MusicControllUtils = {
  doPlayOrPause() {
    if (isElectron) {
      const { playing } = store.state['Footer']
      ipcRenderer.invoke(EVENT_SETUP_MENU, { playStatus: !playing })
    }
    eventBus.emit(EVENT_MUSICCONTROL_PLAY_OR_PAUSE_EMITTER)
  },
  doPrev() {
    eventBus.emit(EVENT_MUSICCONTROL_PREV_EMITTER)
  },
  doNext() {
    eventBus.emit(EVENT_MUSICCONTROL_NEXT_EMITTER)
  },
  doVolUp() {
    eventBus.emit(EVENT_MUSICCONTROL_VOLUP_EMITTER)
  },
  doVolDown() {
    eventBus.emit(EVENT_MUSICCONTROL_VOLDOWN_EMITTER)
  },
  doLike() {
    eventBus.emit(EVENT_MUSICCONTROL_LIKE_EMITTER)
  },
  doChangePlayMode() {
    // TODO: 再考虑一下
  },
  doOpenOrCloseLyrics() {
    if (isElectron) {
      const { visibleFlash } = store.state['Footer']
      ipcRenderer.invoke(EVENT_SETUP_MENU, {
        desktopLyricsStatus: !visibleFlash
      })
    }
    eventBus.emit(EVENT_MUSICCONTROL_LYRICS_OPEN_OR_CLOSE_EMITTER)
  }
}
