import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { isNumber, timeTos } from '@/utils/index'
import { getSongUrl, getSongDetail, getLyric } from './api/index'
import { State, Getter } from './state'
import { RootState } from '@/store/index'
import { stat } from 'fs'

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
  SET_VOLUME = 'SET_VOLUME'
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
    return state.audioElement?.volume
  },
  duration(state, getter: Getter) {
    const dt = getter.musicDetail.dt
    if (dt) {
      return dt / 1000
    }
    return state.audioElement?.duration
  },
  musicLyrics(state) {
    return (state.musicLyricsOrigin || '')
      .trim()
      .split('\n')
      .map(item => {
        let time: RegExpMatchArray | null | string = item.match(/\[.+\]/)
        let lyric: RegExpMatchArray | null | string = item.match(/\].+/)
        if (time) {
          time = time[0].slice(1, -1)
        }
        if (lyric) {
          lyric = lyric[0].slice(1).trim()
        }
        return {
          time: timeTos(time as string),
          lyric: lyric
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
          dominateMediaSession(title, author[0].name, '', state.music.al.picUrl)
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
    }
  },
  async [Actions.SET_MUSIC_LYRICS]({ state }, id: number) {
    const lyrics = await getLyric(id)
    state.musicLyricsOrigin = lyrics
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
    }
  }
}
