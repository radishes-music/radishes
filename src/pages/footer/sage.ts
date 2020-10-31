import { ActionTree, MutationTree } from 'vuex'
import { getSongUrl } from './api/index'
import { State } from './state'
import { RootState } from '@/store/index'

export const enum Actions {
  SET_MUSIC = 'SET_MUSIC_URL'
}

export const enum Mutations {
  PLAY_MUSIC = 'PLAY_MUSIC',
  PAUES_MUSIC = 'PAUES_MUSIC',
  CURRENT_TIME = 'CURRENT_TIME',
  CAN_PLAY = 'CAN_PLAY'
}

export const actions: ActionTree<State, RootState> = {
  async [Actions.SET_MUSIC]({ state }, id: number) {
    const data = await getSongUrl(id)
    if (state.sourceElement && state.audioElement) {
      if (data.length) {
        state.sourceElement.src = data[0].url
        state.audioElement.load()
      }
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
  [Mutations.CURRENT_TIME](state, time: number) {
    state.currentTime = time
  },
  [Mutations.CAN_PLAY](state) {
    state.canplay = true
  }
}
