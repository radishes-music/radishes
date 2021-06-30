declare interface MediaMetadataTypeParams {
  title: string
  artist: string
  album: string
  artwork: {
    src: string
    sizes: string
    type: string
  }[]
}

declare interface MediaMetadataType {
  new (option: MediaMetadataTypeParams): MediaMetadataTypeParams
}

declare const MediaMetadata: MediaMetadataType

declare const __filenamespace: string
declare const VERSION: string
declare const GIT_URL: string
declare const j18n: {
  load: (key: string, ...args: any[]) => string
}

declare module '*.png'
declare module '*.md'
