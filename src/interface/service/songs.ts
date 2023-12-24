import { Artists } from './artists'
import { GlobalBase } from '../app'
import { Albums } from './albums'

export interface Songs extends GlobalBase {
  artists: Artists[]
  duration?: number
  album?: Albums
}

export interface Song extends Songs {
  type: number
  playCount: number
  playcount: number
  trackCount: number
  name: string
  copywriter: string
  picUrl: string
  coverImgUrl: string
  description: string
  specialType?: number
}

export interface FreeTrialInfo {
  start: number
  end: number
}

export interface SongsBase {
  id: number
  url: string
  br: number
  size: number
  expi: number
  freeTrialInfo: FreeTrialInfo
}

export interface PlayLists extends GlobalBase {
  playCount: number
  trackCount: number
  highQuality: boolean
  subscribed: boolean
  coverImgUrl: string
  description: string
}

export interface SongsDetail extends GlobalBase {
  type: 'stack' | 'history' | 'download'
  alia: string[]
  dt: number // duration
  al: {
    picUrl: string
  } & GlobalBase
  mv: number // mv id
  ar: Artists[]
  lrc: {
    version: number
    lyric: string
  }
  url: string
  copyright: number
  noCopyrightRcmd?: {
    type: number
    typeDesc: string
  }
  fee: number
  no: number
  size: number
}

interface Artist {
  id: number
  name: string
  img1v1Url: string
  /* invalid data */
  picId: number
  albumSize: number
  alias: Array<any>
  trans: string
  musicSize: number
  topicPerson: number
}

interface SongQuantity {
  id: number
  name: string
  bitrate: number
  playTime: number
  size: number
  extension: string
  /* invalid data */
  sr: number
  dfsId: number
  volumneDelta: number
}

export interface NewSong {
  id: number
  picUrl: string
  type: number
  alg: 'server_doudi'
  song: {
    id: number
    name: string
    duration: number
    commentThreadId: string
    mark: number
    artists: Array<Artist>
    album: {
      id: number
      name: string
      type: string /* Single */
      size: number
      pic: number
      picId: number
      picId_str: number /* pic === picId */
      blurPicUrl: string
      picUrl: string
      publishTime: number
      status: number
      copyrightId: number
      commentThreadId: string
      artists: Array<Artist>
      subType: string /* 录音室版 */
      onSale: boolean
      mark: number
      gapless: number

      /* invalid data */
      description?: string
      tags?: string
      compnay?: string
      briefDesc?: string
      artist?: any
      songs?: any[]
      alias?: any[]
      transName?: null
    }
    starred: boolean
    popularity: number
    score: number
    starredNum: number
    playNum: number
    dayPlays: number
    hearTime: number
    mMusic: SongQuantity
    lMusic: SongQuantity
    bMusic: SongQuantity
    hMusic: SongQuantity
    sqMusic: SongQuantity
    hrMusic: SongQuantity

    /* invalid data */
    mvid?: number
    rtype?: number
    rurl?: number
    mp3Url?: number
    privilege: {
      id: number
      maxBr: number
      playMaxBr: number
      downloadMaxbr: number
    }
    ringtone?: string
    crbt?: null
    audition: null
    rtUrl?: null
    ftype?: number
    ruUrls?: any[]
    copyright?: number
    transName?: null
    sign?: null
    originCoverType: number
    originSongSimpleData?: null
    single: number
    noCopyrightRcmd?: null
    position: number
    alias: any[]
    status: number
    fee: number
    copyrightId: number
    disc: string
    no: number
  }

  canDislike: boolean
  copywriter: null
  trackNumberUpdateTime: null
}
