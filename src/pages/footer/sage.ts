import { toRaw } from 'vue'
import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { isNumber, timeTos, toFixed, toArrayBuffer } from '@/utils/index'
import { getSongUrl, getSongDetail, getLyric } from './api/index'
import { FooterState, FooterActions, FooterMutations } from './interface'
import { RootState } from '@/store/index'
import { SongsDetail, SongsBase } from '@/interface'
import cloneDeep from 'lodash/cloneDeep'
import remove from 'lodash/remove'

const mapURL = new Map()

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
    if (state.music) {
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
      const data = await getSongUrl<SongsBase[]>(payload)
      id = payload
      url = data[0].url
    } else {
      id = payload.id
      url = payload.url
    }
    state.musicUrl = url
    await dispatch(FooterActions.SET_MUSIC_DEFAILT, id)
    await dispatch(FooterActions.SET_MUSIC_LYRICS, id)
    commit(FooterMutations.CAN_PLAY, false)
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
  }
}

export const mutations: MutationTree<FooterState> = {
  [FooterMutations.LYRICE_EMBED_MIN_WIDTH](state, width: number) {
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
  [FooterMutations.SET_LOCAL_MUSIC_URL](
    state,
    mp3: {
      buffer: Buffer
      path: string
    }
  ) {
    if (state.audioElement && state.sourceElement) {
      let url = ''
      if (mapURL.has(mp3.path)) {
        url = mapURL.get(mp3.path)
      } else {
        const blob = new Blob([toArrayBuffer(mp3.buffer)], {
          type: 'audio/mpeg'
        })
        url = window.URL.createObjectURL(blob)
        mapURL.set(mp3.path, url)
      }
      state.sourceElement.src = url
      state.audioElement.load()
    }
  },
  [FooterMutations.CLEAR_LOCAL_MUSIC_URL]() {
    Array.from(mapURL.values()).forEach((url: string) => {
      window.URL.revokeObjectURL(url)
    })
  },
  [FooterMutations.SET_MUSIC_URL](state, payload: string | SongsDetail) {
    if (state.sourceElement && state.audioElement && state.music) {
      const music = toRaw(state.music)
      if (typeof payload === 'string') {
        state.sourceElement.src = payload
        music.url = payload
      } else {
        state.sourceElement.src = payload.url
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
  [FooterMutations.ENDED_MUSIC](state) {
    state.playing = false
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
  }
}
