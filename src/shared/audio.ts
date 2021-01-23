import { ConvolutionFile } from '@/interface'
import { sleep } from '@/utils'
import axios from 'axios'

export interface Effect {
  createConvolver: (payload: ConvolutionFile) => Promise<void>
  startSpatial: () => void
  stopSpatial: () => void
  fadeInOut: (fade: boolean) => Promise<void>
  disconnect: () => void
  volume: number
}

export class AudioEffect implements Effect {
  private context: AudioContext
  private source: MediaElementAudioSourceNode
  private gainNode: GainNode
  private convolver: ConvolverNode
  private audio: HTMLAudioElement
  private stopSurround: boolean
  private convolverFile?: string
  constructor(audio: HTMLAudioElement) {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) {
      new Error('AudioContext does not support')
    }
    this.audio = audio
    this.stopSurround = true
    this.context = new AudioContext()
    this.gainNode = this.context.createGain()
    this.convolver = this.context.createConvolver()
    this.source = this.context.createMediaElementSource(this.audio)
    this.gainNode.gain.setValueAtTime(0, 0)
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

  public async createConvolver(payload: ConvolutionFile) {
    if (this.convolverFile === payload) return
    this.convolverFile = payload
    const decodeBuffer = await this.getBuffer(
      '/audio-effect/' + payload + '.wav'
    )
    this.convolver.buffer = decodeBuffer
    this.source.connect(this.convolver)
    this.convolver.connect(this.gainNode)
    this.gainNode.connect(this.context.destination)
  }

  public startSpatial() {
    this.stopSurround = false
    const [panner, radius] = [this.context.createPanner(), 20]

    let index = 0
    const loop = async () => {
      if (this.stopSurround) {
        return
      }
      await sleep(16)
      panner.positionX.setValueAtTime(
        Math.sin(index) * radius,
        this.context.currentTime
      )
      panner.positionY.setValueAtTime(0, this.context.currentTime)
      panner.positionZ.setValueAtTime(
        Math.cos(index) * radius,
        this.context.currentTime
      )
      index += 1 / 100
      requestAnimationFrame(loop)
    }
    loop()

    this.source.connect(panner)
    panner.connect(this.gainNode)
    this.gainNode.connect(this.context.destination)
  }

  public stopSpatial() {
    this.stopSurround = true
  }

  public async getBuffer(url: string | Buffer) {
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

    return decodeBuffer
  }

  public async fadeInOut(isIn: boolean) {
    const { currentTime } = this.context
    this.source.connect(this.gainNode)
    this.gainNode.connect(this.context.destination)
    // Cancel all scheduled future changes
    this.gainNode.gain.cancelScheduledValues(0)
    if (isIn) {
      this.gainNode.gain.linearRampToValueAtTime(1.0, currentTime + 1)
    } else {
      this.gainNode.gain.linearRampToValueAtTime(0, currentTime + 1)
    }
    await sleep(1100)
  }

  public disconnect() {
    this.gainNode.disconnect()
  }
}
