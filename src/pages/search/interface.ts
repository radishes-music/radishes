import {
  Albums,
  Songs,
  Artists,
  PlayLists,
  Merage,
  Pagination,
  SongsDetail
} from '@/interface/index'

type LyricsList = Merage<
  {
    lyrics: {
      txt: string
    }
  },
  Songs
>

export interface SearchSuggest {
  albums: Albums[]
  artists: Artists[]
  songs: Merage<{ album: Albums }, Songs>[]
  order: string[]
  playlists: PlayLists[]
  lyrics: LyricsList[]
}

export const enum SearchType {
  SONG = 1,
  ALBUM = 10,
  ARTIST = 100,
  PLAY_LIST = 1000,
  LYRICS = 1006
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
  albumList: list<Albums>
  lyriceList: list<LyricsList>
}

export const enum SearchActions {
  GET_SONG_LIST = 'GET_SONG_LIST',
  GET_ARTIST_LIST = 'GET_ARTIST_LIST',
  GET_PLAYLIST_LIST = 'GET_PLAYLIST_LIST',
  GET_ALBUM_LIST = 'GET_ALBUM_LIST',
  GET_LYRICS_LIST = 'GET_LYRICS_LIST'
}
export const enum SearchMutations {
  SET_SEARCH_TITLE = 'SET_SEARCH_TITLE',
  CHANGE_SONG_PAGE_OFFSET = 'CHANGE_SONG_PAGE_OFFSET',
  CHANGE_ARTIST_PAGE_OFFSET = 'CHANGE_ARTIST_PAGE_OFFSET',
  CHANGE_PLAYLIST_PAGE_OFFSET = 'CHANGE_PLAYLIST_PAGE_OFFSET',
  CHANGE_ALBUM_PAGE_OFFSET = 'CHANGE_ALBUM_PAGE_OFFSET',
  CHANGE_LYRICS_PAGE_OFFSET = 'CHANGE_LYRICS_PAGE_OFFSET'
}
