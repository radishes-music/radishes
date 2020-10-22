export interface Song {
  id: number
  type: number
  playCount: number
  trackCount: number
  name: string
  copywriter: string
  picUrl: string
}

export interface Banners {
  imageUrl: string
  typeTitle: string
  targetId: string
}

export interface State {
  banners: Banners[]
  songList: Song[]
}

export const state: State = {
  songList: [],
  banners: []
}
