import { Artists } from './artists'

export interface Song {
  id: number
  name: string
  artists: Artists[]
}
