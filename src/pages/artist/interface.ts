import { Artists, Albums } from '@/interface/index'

export interface Artist extends Artists {
  cover: string
  briefDesc: string
  albumSize: number
  musicSize: number
  mvSize: number
}

export interface Album extends Albums {
  blurPicUrl: string
}

export interface Desc {
  ti: string
  txt: string
}

export interface ArtistState {
  artist: Artist
  album: Album[]
  introduction: Desc[]
  briefDesc: string
  simi: Artists[]
}

export const enum ArtistMutations {
  SET_ARTIST_DETAIL = 'SET_ARTIST_DETAIL',
  SET_ARTIST_ALBUM = 'SET_ARTIST_ALBUM',
  SET_ARTIST_DESC = 'SET_ARTIST_DESC',
  SET_ARTIST_SIMI = 'SET_ARTIST_SIMI'
}

export const enum ArtistActions {
  SET_ACTION_ARTIST_DETAIL = 'SET_ACTION_ARTIST_DETAIL',
  SET_ACTION_ARTIST_ALBUM = 'SET_ACTION_ARTIST_ALBUM',
  SET_ACTION_ARTIST_DESC = 'SET_ACTION_ARTIST_DESC',
  SET_ACTION_ARTIST_SIMI = 'SET_ACTION_ARTIST_SIMI'
}
