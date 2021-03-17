import { Artists } from './artists'

export interface Albums {
  id: number
  name: string
  size: number
  artist: Artists
  picId: string
  copyrightId: string
  blurPicUrl: string
  picUrl: string
  publishTime: number
  company: string
}
