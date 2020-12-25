import { SongsDetail } from '@/interface'

export interface Downloaded extends SongsDetail {
  time: string
}

export interface DownloadState {
  downloaded: Downloaded[]
}

export const enum DownloadActions {
  DOWNLOAD_MUSIC = 'DOWNLOAD_MUSIC'
}
export const enum DownloadMutations {}
