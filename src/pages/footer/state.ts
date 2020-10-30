export interface State {
  musicUrl: string
  playing: boolean
  currentTime: number
  audioElement: HTMLAudioElement | null
  sourceElement: HTMLSourceElement | null
}

export const state: State = {
  musicUrl: '',
  playing: false,
  currentTime: 0,
  audioElement: null,
  sourceElement: null
}
