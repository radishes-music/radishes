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
declare module 'mp3-duration' {
  const Fn = (
    path: string,
    callback: (err: unknown, duration: number) => void
  ) => unknown
  export default Fn
}
