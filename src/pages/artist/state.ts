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

export const state = {
  artist: {},
  album: [],
  introduction: [],
  briefDesc: '',
  simi: []
}
