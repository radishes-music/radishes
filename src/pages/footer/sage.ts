import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { isNumber, timeTos, toFixed, storage } from '@/utils/index'
import { getSongUrl, getSongDetail, getLyric } from './api/index'
import { State, Getter } from './state'
import { RootState } from '@/store/index'
import { toRaw } from 'vue'

const { get, set } = storage()

export const enum LocalKey {
  VOLUME = 'volume',
  MUSIC_HISTORY = 'music_history'
}

export const enum Actions {
  SET_MUSIC = 'SET_MUSIC_URL',
  SET_MUSIC_DEFAILT = 'SET_MUSIC_DEFAILT',
  SET_MUSIC_LYRICS = 'SET_MUSIC_LYRICS'
}

export const enum Mutations {
  PLAY_MUSIC = 'PLAY_MUSIC',
  PAUES_MUSIC = 'PAUES_MUSIC',
  ENDED_MUSIC = 'ENDED_MUSIC',
  CURRENT_TIME = 'CURRENT_TIME',
  UPDATE_CURRENT_TIME = 'UPDATE_CURRENT_TIME',
  CAN_PLAY = 'CAN_PLAY',
  SET_VOLUME = 'SET_VOLUME',
  VISIBLE_FLASH = 'VISIBLE_FLASH'
}
const dominateMediaSession = (
  title: string,
  artist: string,
  album: string,
  pic: string
) => {
  interface MyNav extends Navigator {
    mediaSession: {
      metadata: MediaMetadataTypeParams
    }
  }
  const nav = navigator as MyNav
  if (nav.mediaSession) {
    nav.mediaSession.metadata = new MediaMetadata({
      title,
      artist,
      album,
      artwork: [
        {
          src: pic,
          sizes: '256x256', // mediaSession will automatically adjust the picture to the appropriate size
          type: 'image/jpeg'
        }
      ]
    })
  }
}

export const getters: GetterTree<State, RootState> = {
  musicDetail(state) {
    return Object.assign(state.music || {}, {
      url: state.musicUrl
    })
  },
  volume(state) {
    const volume = get(LocalKey.VOLUME, {
      parser: 'number'
    })
    return volume || state.audioElement?.volume
  },
  duration(state, getter: Getter) {
    const dt = getter.musicDetail.dt
    if (dt) {
      return dt / 1000
    }
    return state.audioElement?.duration
  },
  musicLyrics(state, getter: Getter) {
    const allDt = getter.duration
    const tp1 = (state.musicLyricsOrigin || '').trim().split('\n')
    const len = tp1.length
    return tp1
      .map((item, index) => {
        type RegResult = RegExpMatchArray | null | string | number
        let nextTime: RegResult = tp1[index + 1]?.match(/\[.+\]/)
        let time: RegResult = item.match(/\[.+\]/)
        let lyric: RegResult = item.match(/\].+/)
        if (nextTime) {
          nextTime = timeTos(nextTime[0].slice(1, -1) as string)
        }
        if (time) {
          time = timeTos(time[0].slice(1, -1) as string)
        }
        if (lyric) {
          lyric = lyric[0].slice(1).trim()
        }
        let duration = 0
        if (nextTime && time) {
          duration = nextTime - time
        }
        if (index === len - 1 && time) {
          duration = allDt - time
        }
        return {
          time: time,
          lyric: lyric,
          duration: toFixed(duration, 3)
        }
      })
      .filter(item => item.time)
  },
  musicDes(state) {
    if (state.music) {
      if (state.music) {
        const author = state.music.ar
        if (author[0]) {
          const title = state.music.name
          dominateMediaSession(
            title,
            author.map(o => o.name).join(' / '),
            '',
            state.music.al.picUrl
          )
          return {
            author: author[0].name,
            title: title
          }
        }
      }
    }

    return {
      author: '',
      title: ''
    }
  }
}

export const actions: ActionTree<State, RootState> = {
  async [Actions.SET_MUSIC]({ state, dispatch, commit }, id: number) {
    const data = await getSongUrl(id)
    if (state.sourceElement && state.audioElement) {
      if (data.length) {
        const url = data[0].url
        state.musicUrl = url
        state.sourceElement.src = url
        state.audioElement.load()
        commit(Mutations.CAN_PLAY, false)
        dispatch(Actions.SET_MUSIC_DEFAILT, id)
        dispatch(Actions.SET_MUSIC_LYRICS, id)
      }
    }
  },
  async [Actions.SET_MUSIC_DEFAILT]({ state }, id: number | number[]) {
    const data = await getSongDetail(id)
    if (data.length) {
      state.music = data[0]
      const isRepeat = state.musicStack.find(
        music => music.id === state.music?.id
      )
      if (!isRepeat) {
        state.musicStack.push(state.music)
        state.musciHistory.push(state.music)
        set(LocalKey.MUSIC_HISTORY, JSON.stringify(toRaw(state.musciHistory)))
      }
    }
  },
  async [Actions.SET_MUSIC_LYRICS]({ state }, id: number) {
    try {
      const lyrics = await getLyric(id)
      state.musicLyricsOrigin = lyrics
    } catch (e) {
      console.warn(e)
    }
  }
}

export const mutations: MutationTree<State> = {
  [Mutations.PLAY_MUSIC](state) {
    if (state.audioElement && !state.playing && state.canplay) {
      state.audioElement.play()
      state.playing = true
    }
  },
  [Mutations.PAUES_MUSIC](state) {
    if (state.audioElement && state.playing && state.canplay) {
      state.audioElement.pause()
      state.playing = false
    }
  },
  [Mutations.ENDED_MUSIC](state) {
    state.playing = false
  },
  [Mutations.CURRENT_TIME](state, time: number) {
    if (state.audioElement && isNumber(time)) {
      state.audioElement.currentTime = time
    }
  },
  [Mutations.UPDATE_CURRENT_TIME](state, time: number) {
    if (isNumber(time)) {
      state.currentTime = time
    }
  },
  [Mutations.CAN_PLAY](state, can: boolean) {
    state.canplay = can
  },
  [Mutations.SET_VOLUME](state, volume: number) {
    if (state.audioElement) {
      state.audioElement.volume = volume
      set(LocalKey.VOLUME, volume)
    }
  },
  [Mutations.VISIBLE_FLASH](state, visible: boolean) {
    state.visibleFlash = visible
  }
}
