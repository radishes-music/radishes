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
declare module '@/mp3/jsmediatags' {
  export * from '@types/jsmediatags/index'
}
