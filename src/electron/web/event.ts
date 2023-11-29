import {
  EVENT_APP_AUTH,
  EVENT_APP_AUTH_EMITTER,
  EVENT_APP_SETTING,
  EVENT_APP_SETTING_EMITTER,
  EVENT_APP_UPDATE,
  EVENT_APP_UPDATE_EMITTER,
  EVENT_MUSICCONTROL_ALL_LOOP,
  EVENT_MUSICCONTROL_LIKE,
  EVENT_MUSICCONTROL_LYRICS_OPEN_OR_CLOSE,
  EVENT_MUSICCONTROL_NEXT,
  EVENT_MUSICCONTROL_PLAYMODE,
  EVENT_MUSICCONTROL_PLAYMODE_EMITTER,
  EVENT_MUSICCONTROL_PLAY_OR_PAUSE,
  EVENT_MUSICCONTROL_PREV,
  EVENT_MUSICCONTROL_SHUFFLE,
  EVENT_MUSICCONTROL_SINGLE_LOOP,
  EVENT_MUSICCONTROL_VOLDOWN,
  EVENT_MUSICCONTROL_VOLUP
} from '@/constants'
import { isElectron } from '@/utils'
import eventBus from '@/utils/eventBus'
import { MusicControllUtils } from '@/utils/musicControl'
import { IpcRendererEvent } from 'electron'

type IIpcRendererListener = (event: IpcRendererEvent, ...args: any[]) => void

// TODO: 把几个功能点的喊出拆分出来
const getEventListeners = (): Array<{
  event: string
  callback: IIpcRendererListener
}> => {
  return [
    {
      event: EVENT_APP_SETTING,
      callback() {
        eventBus.emit(EVENT_APP_SETTING_EMITTER)
      }
    },
    {
      event: EVENT_APP_UPDATE,
      callback() {
        eventBus.emit(EVENT_APP_UPDATE_EMITTER)
      }
    },
    {
      event: EVENT_APP_AUTH,
      callback() {
        eventBus.emit(EVENT_APP_AUTH_EMITTER)
      }
    },
    {
      event: EVENT_MUSICCONTROL_PLAY_OR_PAUSE,
      callback() {
        MusicControllUtils.doPlayOrPause()
      }
    },
    {
      event: EVENT_MUSICCONTROL_PREV,
      callback() {
        MusicControllUtils.doPrev()
      }
    },
    {
      event: EVENT_MUSICCONTROL_NEXT,
      callback() {
        MusicControllUtils.doNext()
      }
    },
    {
      event: EVENT_MUSICCONTROL_VOLUP,
      callback() {
        MusicControllUtils.doVolUp()
      }
    },
    {
      event: EVENT_MUSICCONTROL_VOLDOWN,
      callback() {
        MusicControllUtils.doVolDown()
      }
    },
    {
      event: EVENT_MUSICCONTROL_LIKE,
      callback() {
        MusicControllUtils.doLike()
      }
    },
    {
      event: EVENT_MUSICCONTROL_PLAYMODE,
      callback() {
        eventBus.emit(EVENT_MUSICCONTROL_PLAYMODE_EMITTER)
      }
    },
    {
      event: EVENT_MUSICCONTROL_SHUFFLE,
      callback() {
        console.log('shuffle')
      }
    },
    {
      event: EVENT_MUSICCONTROL_SINGLE_LOOP,
      callback() {
        console.log('single loop')
      }
    },
    {
      event: EVENT_MUSICCONTROL_ALL_LOOP,
      callback() {
        console.log('all loop')
      }
    },
    {
      event: EVENT_MUSICCONTROL_LYRICS_OPEN_OR_CLOSE,
      callback() {
        MusicControllUtils.doOpenOrCloseLyrics()
      }
    }
  ]
}

export const setupMainEvent = () => {
  if (!isElectron) {
    return
  }
  getEventListeners().forEach(({ event, callback }) => {
    ipcRenderer.on(event, callback)
  })
}
