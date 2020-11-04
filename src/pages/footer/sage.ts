import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { isNumber, timeTos } from '@/utils/index'
import { getSongUrl, getSongDetail, getLyric } from './api/index'
import { State, Getter } from './state'
import { RootState } from '@/store/index'

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
    const temp = (state.musicLyricsOrigin || '')
      .trim()
      .split('\n')
      .map(item => {
        return {
          time: timeTos(item.slice(1, 10)),
          lyric: item.slice(12)
        }
      })
    console.log(temp)
    return temp
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
