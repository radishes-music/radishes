import {
  SongsDetail,
  Albums,
  Songs,
  Artists,
  PlayLists,
  Merage
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
  SONG_LIST = 1000,
  LYRICE = 1006
}

export interface SearchState {
  songs: SongsDetail
}

export const enum SearchActions {}
export const enum SearchMutations {}
