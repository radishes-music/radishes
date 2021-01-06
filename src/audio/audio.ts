import axios from 'axios'
import { get } from '@/utils/http'
import { sleep } from '@/utils/index'

export interface AudioType {
  setSource: (url: string | Buffer) => Promise<unknown>
  play: (time?: number) => void
  pause: () => void
  getDuraion: () => number
  currentTime: number
  volume: number
}

export class BackgroundAudio implements AudioType {
  private context: AudioContext
  private source: AudioBufferSourceNode
  private gainNode: GainNode
  private duration: number
  constructor() {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    this.context = new AudioContext()
    this.source = this.context.createBufferSource()
    this.gainNode = this.context.createGain()
    this.duration = 0
    // https://developer.mozilla.org/zh-CN/docs/Web/API/AudioContext/createBuffer
    // Some sound effects may be implemented later, so declare an internal buffer for operation
    // This method is called synchronously and will prevent other JavaScript calls
    // this.buffer = this.context.createBuffer(
    //   2,
    //   this.context.sampleRate * 2,
    //   this.context.sampleRate
    // )
  }

  get currentTime() {
    return this.context.currentTime
  }

  set currentTime(t: number) {
    this.gainNode.gain.setValueAtTime(t, this.context.currentTime)
  }

  get volume() {
    return this.gainNode.gain.value
  }

  set volume(v: number) {
    if (typeof v !== 'number') {
      console.error(`The volume must be digital and between 0 and 1`)
    }
    this.gainNode.gain.value = v
  }

  async setSource(url: string | Buffer) {
    let responseBuffer
    if (typeof url === 'string') {
      responseBuffer = await axios
        .get<ArrayBuffer>(url, {
          responseType: 'arraybuffer',
          withCredentials: false
        })
        .then(res => res.data)
    } else {
      responseBuffer = url
    }
    const decodeBuffer = await this.context.decodeAudioData(responseBuffer)
    this.duration = decodeBuffer.duration
    this.source.buffer = decodeBuffer
    this.source.connect(this.context.destination)
  }

  getDuraion() {
    return this.duration
  }

  play(time?: number) {
    if (typeof time === 'number') {
      this.source.start(time)
    } else {
      this.source.start()
    }
  }

  pause() {
    this.source.stop()
  }
}
