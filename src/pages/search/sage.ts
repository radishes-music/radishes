import { MutationTree, ActionTree } from 'vuex'
import { RootState } from '@/store/index'
import { search } from '@/api/search'
import {
  SearchMutations,
  SearchActions,
  SearchState,
  SearchType,
  Pagination
} from '@/interface'
import { clone } from 'lodash-es'

const calcSlice = (pagination: Pagination, page: number) => {
  const p = clone(pagination)
  p.offset = page
  const { limit, offset, total } = p
  const totalCalc = limit * offset
  if (total && totalCalc > total) {
    p.slice = totalCalc - total
  } else {
    p.slice = 0
  }
  return p.slice
}

export const actions: ActionTree<SearchState, RootState> = {
  async [SearchActions.GET_SONG_LIST]({ state, commit }, payload) {
    state.songList.loading = true
    const { slice, limit, offset } = state.songList.pagination
    const result = await search(
      payload,
      SearchType.SONG,
      state.songList.pagination
    )
    state.songList.loading = false
    state.songList.data = result.songs.slice(slice).map(song => {
      return {
        ...song,
        dt: song.duration,
        al: song.album,
        ar: song.artists,
        index: (offset - 1) * limit
      }
    })
    state.songList.total = result.songCount
    commit(
      SearchMutations.SET_SEARCH_TITLE,
      `找到 ${state.songList.total} 首歌曲`
    )
  },
  async [SearchActions.GET_ARTIST_LIST]({ state, commit }, payload) {
    state.artistList.loading = true
    const { slice, limit, offset } = state.artistList.pagination
    const result = await search(
      payload,
      SearchType.ARTIST,
      state.artistList.pagination
    )
    state.artistList.loading = false
    state.artistList.data = result.artists.slice(slice).map(artist => {
      return {
        ...artist,
        picUrl: artist.picUrl || artist.img1v1Url,
        index: (offset - 1) * limit
      }
    })
    state.artistList.total = result.artistCount
    commit(
      SearchMutations.SET_SEARCH_TITLE,
      `找到 ${state.artistList.total} 位歌手`
    )
  },
  async [SearchActions.GET_PLAYLIST_LIST]({ state, commit }, payload) {
    state.playlist.loading = true
    const { slice, limit, offset } = state.playlist.pagination
    const result = await search(
      payload,
      SearchType.PLAY_LIST,
      state.playlist.pagination
    )
    state.playlist.loading = false
    state.playlist.data = result.playlists.slice(slice).map(playlist => {
      return {
        ...playlist,
        picUrl: playlist.coverImgUrl,
        count: playlist.trackCount,
        index: (offset - 1) * limit
      }
    })
    state.playlist.total = result.playlistCount
    commit(
      SearchMutations.SET_SEARCH_TITLE,
      `找到 ${state.playlist.total} 个歌单`
    )
  },
  async [SearchActions.GET_ALBUM_LIST]({ state, commit }, payload) {
    state.albumList.loading = true
    const { slice, limit, offset } = state.albumList.pagination
    const result = await search(
      payload,
      SearchType.ALBUM,
      state.albumList.pagination
    )
    state.albumList.loading = false
    state.albumList.data = result.albums.slice(slice).map(album => {
      return {
        ...album,
        picUrl: album.picUrl || album.blurPicUrl,
        count: album.size,
        index: (offset - 1) * limit
      }
    })
    state.albumList.total = result.albumCount
    commit(
      SearchMutations.SET_SEARCH_TITLE,
      `找到 ${state.albumList.total} 张专辑`
    )
  },
  async [SearchActions.GET_LYRICS_LIST]({ state, commit }, payload) {
    state.lyriceList.loading = true
    const { slice, limit, offset } = state.lyriceList.pagination
    const result = await search(
      payload,
      SearchType.LYRICS,
      state.lyriceList.pagination
    )
    state.lyriceList.loading = false
    state.lyriceList.data = result.songs.slice(slice).map(lyrics => {
      return {
        ...lyrics,
        dt: lyrics.duration,
        al: lyrics.album,
        ar: lyrics.artists,
        index: (offset - 1) * limit
      }
    })
    state.lyriceList.total = result.songCount
    commit(
      SearchMutations.SET_SEARCH_TITLE,
      `找到 ${state.lyriceList.total} 首歌词`
    )
  }
}

export const mutations: MutationTree<SearchState> = {
  [SearchMutations.SET_SEARCH_TITLE](state, txt) {
    state.searchTitle = txt
    console.log(txt)
  },
  [SearchMutations.CHANGE_SONG_PAGE_OFFSET](state, page) {
    state.songList.pagination.offset = page
    state.songList.pagination.slice = calcSlice(state.songList.pagination, page)
  },
  [SearchMutations.CHANGE_ARTIST_PAGE_OFFSET](state, page) {
    state.artistList.pagination.offset = page
    state.artistList.pagination.slice = calcSlice(
      state.artistList.pagination,
      page
    )
  },
  [SearchMutations.CHANGE_PLAYLIST_PAGE_OFFSET](state, page) {
    state.playlist.pagination.offset = page
    state.playlist.pagination.slice = calcSlice(state.playlist.pagination, page)
  },
  [SearchMutations.CHANGE_ALBUM_PAGE_OFFSET](state, page) {
    state.albumList.pagination.offset = page
    state.albumList.pagination.slice = calcSlice(
      state.albumList.pagination,
      page
    )
  },
  [SearchMutations.CHANGE_LYRICS_PAGE_OFFSET](state, page) {
    state.lyriceList.pagination.offset = page
    state.lyriceList.pagination.slice = calcSlice(
      state.lyriceList.pagination,
      page
    )
  }
}
