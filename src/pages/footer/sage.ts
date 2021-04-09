import { toRaw } from 'vue'
import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { isNumber, timeTos, toFixed, renderRandom } from '@/utils/index'
import { getSongDetail, getLyric } from '@/api/index'
import {
  FooterState,
  FooterActions,
  FooterMutations,
  Direction,
  SongsDetail,
  PlayMode
} from '@/interface'
import { getMusicUrl, playMusic } from '@/shared/music-shared'
import { RootState } from '@/store/index'
import { useFooterModule } from '@/modules'
import { AudioEffect } from '@/shared/audio'
import cloneDeep from 'lodash/cloneDeep'
import remove from 'lodash/remove'

const dominateMediaSession = (
  title: string,
  artist: string,
  album: string,
  pic: string
) => {
  document.title = title + '-' + artist

  if ('mediaSession' in navigator) {
    const { useMutations, useActions } = useFooterModule()
    navigator.mediaSession.metadata = new MediaMetadata({
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
    navigator.mediaSession.setActionHandler('play', () => {
      useMutations(FooterMutations.PLAY_MUSIC)
    })
    navigator.mediaSession.setActionHandler('pause', () => {
      useMutations(FooterMutations.PAUES_MUSIC)
    })
    navigator.mediaSession.setActionHandler('seekbackward', () => {
      useMutations(FooterMutations.SEEKBACKWARD)
    })
    navigator.mediaSession.setActionHandler('seekforward', () => {
      useMutations(FooterMutations.SEEKFORWARD)
    })
    navigator.mediaSession.setActionHandler('previoustrack', () => {
      useActions(FooterActions.CUTOVER_TRACK, Direction.PREV)
    })
    navigator.mediaSession.setActionHandler('nexttrack', () => {
      useActions(FooterActions.CUTOVER_TRACK, Direction.NEXT)
    })
    navigator.mediaSession.setActionHandler('stop', () => {
      useMutations(FooterMutations.PAUES_MUSIC)
    })
  }
}

export const findMusicIndex = (
  contanier: SongsDetail[],
  target: SongsDetail
) => {
  return contanier.findIndex(music => music.id === target.id)
}

export const getters: GetterTree<FooterState, RootState> = {
  musicDetail(state) {
    const base = cloneDeep(toRaw(state.music)) || {}
    return {
      ...base,
      url: state.musicUrl
    }
  },
  musicLyrics(state) {
    const allDt = state.duration
    const tp1 = (state.musicLyricsOrigin || '').trim().split('\n')
    const len = tp1.length
    const lyrices = tp1
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
          time: time || 0,
          lyric: lyric,
          duration: toFixed(duration, 3)
        }
      })
      .filter(item => item.time)
      .sort((a, b) => a.time - b.time)
    return lyrices
  },
  musicDes(state) {
    if (state.music && navigator.onLine) {
      const author = state.music.ar
      if (author.length) {
        const title = state.music.name
        dominateMediaSession(
          title,
          author.map(o => o.name).join(' / '),
          '',
          state.music.al.picUrl
        )
        return {
          author: author,
          title: title
        }
      }
    }

    return {
      author: [],
      title: ''
    }
  }
}

export const actions: ActionTree<FooterState, RootState> = {
  async [FooterActions.SET_MUSIC](
    { state, dispatch, commit },
    payload: number | { url: string; id: number }
  ) {
    let id, url
    if (typeof payload === 'number') {
      const data = await getMusicUrl(payload)
      id = payload
      url = data[0].url
    } else {
      id = payload.id
      url = payload.url
    }
    state.musicUrl = url
    if (navigator.onLine) {
      await dispatch(FooterActions.SET_MUSIC_DEFAILT, id)
      await dispatch(FooterActions.SET_MUSIC_LYRICS, id)
    } else {
      // Temporarily save to pass if branch detection
      state.music = payload as SongsDetail
    }
    commit(FooterMutations.SET_MUSIC_URL, url)
  },
  async [FooterActions.SET_MUSIC_DEFAILT]({ state }, id: number | number[]) {
    const data = await getSongDetail(id)
    if (data.length) {
      state.music = data[0]
    }
  },
  async [FooterActions.SET_MUSIC_LYRICS]({ state }, id: number) {
    try {
      const lyrics = await getLyric(id)
      state.musicLyricsOrigin = lyrics
    } catch (e) {
      console.warn(e)
    }
  },
  async [FooterActions.CUTOVER_TRACK]({ state }, direction: Direction) {
    if (state.music && state.musicStack.length > 1) {
      const index = findMusicIndex(state.musicStack, state.music)
      let next
      switch (state.playMode) {
        case PlayMode.TURN:
          if (direction === Direction.PREV) {
            next = index <= 0 ? state.musicStack.length - 1 : index - 1
          } else {
            next = index === state.musicStack.length - 1 ? 0 : index + 1
          }
          break
        case PlayMode.RANDOM:
          next = renderRandom(state.musicStack.length, index)
      }
      const nextMusic = state.musicStack[next]

      playMusic(nextMusic.id)
    }
  }
}

export const mutations: MutationTree<FooterState> = {
  [FooterMutations.LYRICS_EMBED_MIN_WIDTH](state, width: number) {
    state.lyriceEmbedMinWidth = width
  },
  [FooterMutations.CLEAR_STACK](state) {
    state.musicStack = []
  },
  [FooterMutations.REMOVE_STACK](state, id: number) {
    remove(state.musicStack, music => music.id === id)
  },
  [FooterMutations.REMOVE_HISTORY](state, id: number) {
    remove(state.musciHistory, music => music.id === id)
  },
  [FooterMutations.SET_DURATION](state, duration: number) {
    state.duration = duration
  },
  [FooterMutations.SET_PLAYLIST_TO_STACK](state, payload: SongsDetail[]) {
    payload.forEach(item => {
      const isExist = findMusicIndex(state.musicStack, item) === -1
      if (isExist) {
        state.musicStack.push(item)
      }
    })
  },
  [FooterMutations.SET_MUSIC_URL](state, payload: string | SongsDetail) {
    if (state.audioElement && state.music) {
      const music = toRaw(state.music)
      if (typeof payload === 'string') {
        state.audioElement.src = payload
        music.url = payload
      } else {
        state.audioElement.src = payload.url
        state.music = payload
      }
      state.audioElement.load()
      const isRepeatHistory = findMusicIndex(state.musciHistory, music) === -1
      const isRepeatStack = findMusicIndex(state.musicStack, music) === -1
      if (isRepeatHistory) {
        state.musciHistory.push({
          ...toRaw(music),
          type: 'history'
        })
      }
      if (isRepeatStack) {
        state.musicStack.push({
          ...toRaw(music),
          type: 'stack'
        })
      }
    }
  },
  [FooterMutations.PLAY_MUSIC](state) {
    if (state.audioElement && !state.playing) {
      state.audioElement.play()
      state.playing = true
    }
  },
  [FooterMutations.PAUES_MUSIC](state) {
    if (state.audioElement && state.playing) {
      state.audioElement.pause()
      state.playing = false
    }
  },
  [FooterMutations.PLAYING](state, playing) {
    state.playing = playing
  },
  [FooterMutations.CURRENT_TIME](state, time: number) {
    if (state.audioElement && isNumber(time)) {
      state.audioElement.currentTime = time
    }
  },
  [FooterMutations.UPDATE_CURRENT_TIME](state, time: number) {
    if (isNumber(time)) {
      state.currentTime = time
    }
  },
  [FooterMutations.CAN_PLAY](state, can: boolean) {
    state.canplay = can
  },
  [FooterMutations.SET_VOLUME](state, volume: number) {
    if (state.audioElement) {
      state.audioElement.volume = volume
      state.volume = volume
    }
  },
  [FooterMutations.VISIBLE_FLASH](state, visible: boolean) {
    state.visibleFlash = visible
  },
  [FooterMutations.VISIBLE_EMBED](state, visible: boolean) {
    state.visibleLyrics = visible
  },
  [FooterMutations.SEEKBACKWARD](state) {
    if (state.audioElement) {
      state.audioElement.currentTime = state.currentTime - 10
    }
  },
  [FooterMutations.SEEKFORWARD](state) {
    if (state.audioElement) {
      state.audioElement.currentTime = state.currentTime + 10
    }
  },
  [FooterMutations.INIT_EFFECT](state) {
    if (state.audioElement) {
      state.effect = new AudioEffect(state.audioElement)
    }
  },
  [FooterMutations.CHANGE_PLAYMODE](state, mode: PlayMode) {
    state.playMode = mode
  }
}
