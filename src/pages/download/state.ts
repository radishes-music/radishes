import { SongsDetail } from '@/interface'

export interface Downloaded extends SongsDetail {
  time: string
}

export interface DownloadState {
  downloaded: Downloaded[]
}

export const state: DownloadState = {
  downloaded: []
}
