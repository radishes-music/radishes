import { toRaw, h } from 'vue'
import { ActionTree, MutationTree, GetterTree, ActionContext } from 'vuex'
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
import { message } from 'ant-design-vue'
import NoMusic from './components/no-music'
import { cloneDeep } from 'lodash-es'
import { remove } from 'lodash-es'

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
    type RegResult = RegExpMatchArray | null | string | number

    const allDt = state.duration
    const lyricsArr = (state.musicLyricsOrigin || '')
      .trim()
      .split('\n')
      .map(item => {
        const time = item.match(/(\[.{8,9}\])/g)
        let lyric: RegResult = item.match(/\](?!\[).+/)
        if (lyric) {
          lyric = lyric[0].slice(1).trim()
        }
        if (time && time.length > 1) {
          return time.map(t => `${t}${lyric}`)
        }
        return item
      })
      .flat(1e1)

    const len = lyricsArr.length
    const lyrices = lyricsArr
      .map((item, index) => {
        let nextTime: RegResult = lyricsArr[index + 1]?.match(/\[.+\]/)
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

        return {
          time: time || 0,
          lyric: lyric
        }
      })
      .filter(item => item.time)
      .sort((a, b) => a.time - b.time)
    return lyrices.map((item, index) => {
      const nextTime = lyrices[index + 1]?.time,
        time = item.time
      let duration = 0
      if (nextTime && time) {
        duration = nextTime - time
      }
      if (index === len - 1 && time) {
        duration = allDt - time
      }
      return {
        ...item,
        duration: toFixed(duration, 3)
      }
    })
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

type IActions<T = ActionContext<FooterState, RootState>> = {
  [FooterActions.SET_MUSIC]: (
    k: T,
    payload: number | { url: string; id: number | string }
  ) => Promise<boolean>
  [FooterActions.SET_MUSIC_DEFAILT]: (k: T, payload: number | number[]) => void
  [FooterActions.SET_MUSIC_LYRICS]: (k: T, payload: number) => void
  [FooterActions.CUTOVER_TRACK]: (k: T, payload: Direction) => void
}

export const actions: IActions = {
  async [FooterActions.SET_MUSIC]({ state, dispatch, commit }, payload) {
    commit(FooterMutations.SET_MUSIC_URL_LOADING, true)
    let id, url
    try {
      if (typeof payload === 'number') {
        const data = await getMusicUrl(payload)
        id = payload
        url = data[0].url
      } else {
        id = payload.id
        url = payload.url
      }
    } catch (e) {
      url = ''
    }

    state.musicUrl = url
    if (url) {
      if (navigator.onLine) {
        await dispatch(FooterActions.SET_MUSIC_DEFAILT, id)
        await dispatch(FooterActions.SET_MUSIC_LYRICS, id)
      } else {
        // Temporarily save to pass if branch detection
        state.music = payload as SongsDetail
      }
      commit(FooterMutations.SET_MUSIC_URL, url)
    } else {
      message.warn(h(NoMusic))
    }

    commit(FooterMutations.SET_MUSIC_URL_LOADING, false)
    return true
  },
  async [FooterActions.SET_MUSIC_DEFAILT]({ state }, id) {
    const data = await getSongDetail(id)
    if (data.length) {
      state.music = data[0]
    }
  },
  async [FooterActions.SET_MUSIC_LYRICS]({ state }, id) {
    try {
      const lyrics = await getLyric(id)
      state.musicLyricsOrigin = lyrics
    } catch (e) {
      console.warn(e)
    }
  },
  async [FooterActions.CUTOVER_TRACK]({ state }, direction) {
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

type Mutation<Payload = any> = (state: FooterState, payload: Payload) => any
type IMutations<T = MutationTree<FooterState>> = {
  [FooterMutations.SET_MUSIC_URL_LOADING]: Mutation<boolean>
  [FooterMutations.LYRICS_EMBED_MIN_WIDTH]: Mutation<number>
  [FooterMutations.CLEAR_STACK]: Mutation
  [FooterMutations.REMOVE_STACK]: Mutation<number>
  [FooterMutations.REMOVE_HISTORY]: Mutation<number>
  [FooterMutations.SET_DURATION]: Mutation<number>
  [FooterMutations.SET_PLAYLIST_TO_STACK]: Mutation<SongsDetail[]>
  [FooterMutations.SET_MUSIC_URL]: Mutation<string | SongsDetail>
  [FooterMutations.PLAY_MUSIC]: Mutation
  [FooterMutations.PAUES_MUSIC]: Mutation
  [FooterMutations.PLAYING]: Mutation<boolean>
  [FooterMutations.CURRENT_TIME]: Mutation<number>
  [FooterMutations.UPDATE_CURRENT_TIME]: Mutation<number>
  [FooterMutations.CAN_PLAY]: Mutation<boolean>
  [FooterMutations.SET_VOLUME]: Mutation<number>
  [FooterMutations.VISIBLE_FLASH]: Mutation<boolean>
  [FooterMutations.VISIBLE_EMBED]: Mutation<boolean>
  [FooterMutations.SEEKBACKWARD]: Mutation
  [FooterMutations.SEEKFORWARD]: Mutation
  [FooterMutations.INIT_EFFECT]: Mutation
  [FooterMutations.CHANGE_PLAYMODE]: Mutation<PlayMode>
}

export const mutations: IMutations = {
  [FooterMutations.SET_MUSIC_URL_LOADING](state, loading) {
    state.musicUrlLoading = loading
  },
  [FooterMutations.LYRICS_EMBED_MIN_WIDTH](state, width) {
    state.lyriceEmbedMinWidth = width
  },
  [FooterMutations.CLEAR_STACK](state) {
    state.musicStack = []
  },
  [FooterMutations.REMOVE_STACK](state, id) {
    if (!id) {
      state.musicStack = []
      return
    }
    remove(state.musicStack, music => music.id === id)
  },
  [FooterMutations.REMOVE_HISTORY](state, id) {
    if (!id) {
      state.musciHistory = []
      return
    }
    remove(state.musciHistory, music => music.id === id)
  },
  [FooterMutations.SET_DURATION](state, duration) {
    state.duration = duration
  },
  [FooterMutations.SET_PLAYLIST_TO_STACK](state, payload) {
    payload.forEach(item => {
      const isExist = findMusicIndex(state.musicStack, item) === -1
      if (isExist) {
        state.musicStack.push(item)
      }
    })
  },
  [FooterMutations.SET_MUSIC_URL](state, payload) {
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
  [FooterMutations.CURRENT_TIME](state, time) {
    if (state.audioElement && isNumber(time)) {
      state.audioElement.currentTime = time
      state.currentTime = time
    }
  },
  [FooterMutations.UPDATE_CURRENT_TIME](state, time) {
    if (isNumber(time)) {
      state.currentTime = time
    }
  },
  [FooterMutations.CAN_PLAY](state, can) {
    state.canplay = can
  },
  [FooterMutations.SET_VOLUME](state, volume) {
    if (state.audioElement) {
      state.audioElement.volume = volume
      state.volume = volume
    }
  },
  [FooterMutations.VISIBLE_FLASH](state, visible) {
    state.visibleFlash = visible
  },
  [FooterMutations.VISIBLE_EMBED](state, visible) {
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
  [FooterMutations.CHANGE_PLAYMODE](state, mode) {
    state.playMode = mode
  }
}
