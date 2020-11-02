import { Artists } from './artists'

export interface Albums {
  id: number
  name: string
  artist: Artists
  picId: string
  copyrightId: string
}
