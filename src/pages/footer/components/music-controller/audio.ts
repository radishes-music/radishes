import { get } from '@/utils/http'

export interface AudioType {
  url2Buffer: (url: string) => Promise<unknown>
  play: (time?: number) => void
  pause: () => void
}

export class BackgroundAudio implements AudioType {
  private context: AudioContext
  private source: AudioBufferSourceNode
  private buffer: AudioBuffer
  private currentTime: number
  constructor() {
    this.context = new AudioContext()
    this.source = this.context.createBufferSource()
    this.currentTime = 0
    // Some sound effects may be implemented later, so declare an internal buffer for operation
    this.buffer = this.context.createBuffer(
      2,
      this.context.sampleRate * 2,
      this.context.sampleRate
    )
  }

  async url2Buffer(url: string) {
    const responseBuffer = await get<ArrayBuffer>(
      url,
      {},
      {
        responseType: 'arraybuffer'
      }
    )
    const decodeBuffer = await this.context.decodeAudioData(responseBuffer)
    if (decodeBuffer) {
      this.buffer = decodeBuffer
      this.source.buffer = this.buffer
      this.source.connect(this.context.destination)
    }
  }

  play(time?: number) {
    if (time) {
      this.currentTime = time
    }
    this.source.start(this.currentTime)
  }

  pause() {
    this.source.stop()
  }
}
