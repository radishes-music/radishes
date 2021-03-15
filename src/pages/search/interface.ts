import {
  Albums,
  Songs,
  Artists,
  PlayLists,
  Merage,
  Pagination
} from '@/interface/index'

export interface SearchSuggest {
  albums: Albums[]
  artists: Artists[]
  songs: Merage<{ album: Albums }, Songs>[]
  order: string[]
  playlists: PlayLists[]
  lyrice: Merage<
    {
      txt: string
    },
    Songs
  >[]
}

export const enum SearchType {
  SONG = 1,
  ALBUM = 10,
  ARTIST = 100,
  PLAY_LIST = 1000,
  LYRICE = 1006
}

export type list<T> = {
  data: T[]
  total: number
  loading: boolean
  pagination: Pagination
}

export interface SearchState {
  searchTitle: string
  songList: list<Songs>
  artistList: list<Artists>
  playlist: list<PlayLists>
}

export const enum SearchActions {
  GET_SONG_LIST = 'GET_SONG_LIST',
  GET_ARTIST_LIST = 'GET_ARTIST_LIST',
  GET_PLAYLIST_LIST = 'GET_PLAYLIST_LIST'
}
export const enum SearchMutations {
  SET_SEARCH_TITLE = 'SET_SEARCH_TITLE',
  CHANGE_SONG_PAGE_OFFSET = 'CHANGE_SONG_PAGE_OFFSET',
  CHANGE_ARTIST_PAGE_OFFSET = 'CHANGE_ARTIST_PAGE_OFFSET',
  CHANGE_PLAYLIST_PAGE_OFFSET = 'CHANGE_PLAYLIST_PAGE_OFFSET'
}
