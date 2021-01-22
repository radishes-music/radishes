import { sleep } from '@/utils'
import axios from 'axios'

export const enum ConvolutionFile {
  Batcave = 'Batcave.wav',
  Crowd = 'Crowd.wav',
  EchoBridge = 'EchoBridge.wav',
  Natatorium = 'Natatorium.wav',
  TunnelToHell = 'TunnelToHell.wav'
}

interface InOut {
  isIn: boolean
}

export interface Effect {
  createConvolver: (payload: ConvolutionFile) => Promise<void>
  startSpatial: () => void
  stopSpatial: () => void
  fadeInOut: (fade: InOut) => void
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
    this.disconnect()
    const decodeBuffer = await this.getBuffer('/audio-effect/' + payload)
    this.convolver.buffer = decodeBuffer
    this.source.connect(this.convolver)
    this.convolver.connect(this.gainNode)
    this.gainNode.connect(this.context.destination)
  }

  public startSpatial() {
    this.stopSurround = false
    this.disconnect()
    const [panner, gain1, gain2, convolver, radius] = [
      this.context.createPanner(),
      this.context.createGain(),
      this.context.createGain(),
      this.context.createConvolver(),
      20
    ]

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
    gain1.gain.value = 5
    panner.connect(gain1)
    gain1.connect(this.context.destination)

    convolver.connect(gain2)
    gain2.connect(this.context.destination)
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

  public fadeInOut({ isIn }: InOut) {
    if (isIn) {
      this.gainNode.gain.value = 0
      this.audio.play()

      this.gainNode.gain.linearRampToValueAtTime(
        1,
        this.context.currentTime + 0.7
      )
    } else {
      this.gainNode.gain.linearRampToValueAtTime(
        0,
        this.context.currentTime + 0.7
      )
      setTimeout(() => {
        this.audio.pause()
      }, 700)
    }
  }

  public disconnect() {
    this.gainNode.disconnect()
  }
}
