import { Artists } from '@/interface/index'

export interface Artist extends Artists {
  picUrl: string
}

export interface ArtistsState {
  artists: Partial<Artist[]>
  completed: boolean
}

export const state: ArtistsState = {
  artists: [],
  completed: false
}
