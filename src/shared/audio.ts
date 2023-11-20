import { ConvolutionFile } from '@/interface'
import { sleep } from '@/utils'
import { remove } from 'lodash-es'
import axios from 'axios'

export interface Effect {
  createConvolver: (payload: ConvolutionFile) => Promise<void>
  clearConvolver: () => void
  startSpatial: () => void
  stopSpatial: () => void
  clearSpatial: () => void
  startInOut: (fade: boolean) => Promise<void>
  clearFade: () => void
}

enum NodeID {
  SourceNode,
  ConvolverNode,
  PannerNode,
  GainNode,
  BiquadFilterNode
}

type EffectNode = {
  node: AudioNode
  id: NodeID
}

class EffectNodeRender {
  private node: EffectNode[]
  private ctx: AudioContext

  constructor(ctx: AudioContext) {
    this.ctx = ctx
    this.node = []
  }

  static render(node: AudioNode, id: NodeID) {
    return {
      node,
      id
    }
  }

  insert(node: EffectNode) {
    if (!this.node.find(n => n.id === node.id)) {
      this.node.push(node)
    }
    return this
  }

  delete(id: NodeID) {
    remove(this.node, node => node.id === id)
    return this
  }

  output() {
    const { node, ctx } = this

    for (let i = 0; i < this.node.length; i++) {
      const cur = node[i],
        next = node[i + 1]

      cur.node.disconnect()
      if (next) {
        cur.node.connect(next.node)
      } else {
        cur.node.connect(ctx.destination)
      }
    }
  }
}

export class AudioEffect implements Effect {
  private context: AudioContext
  private source: MediaElementAudioSourceNode
  private audio: HTMLAudioElement
  private nodeRender: EffectNodeRender
  private gainNodeFade?: GainNode
  private convolver?: ConvolverNode
  private panner?: PannerNode
  private bigquadFilter?: BiquadFilterNode
  private convolverFile?: ConvolutionFile

  public stopSurround: boolean

  constructor(audio: HTMLAudioElement) {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) {
      new Error('AudioContext does not support')
    }
    this.audio = audio
    this.stopSurround = true
    this.context = new AudioContext()
    this.source = this.context.createMediaElementSource(this.audio)
    this.nodeRender = new EffectNodeRender(this.context)
    this.nodeRender.insert(
      EffectNodeRender.render(this.source, NodeID.SourceNode)
    )
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

  public async createConvolver(payload: ConvolutionFile) {
    if (this.convolverFile === payload || payload === '原唱') return
    this.convolver = this.context.createConvolver()
    this.convolverFile = payload
    const decodeBuffer = await this.getBuffer(
      'audio-effect/' + payload + '.wav'
    )
    this.convolver.buffer = decodeBuffer
    this.nodeRender
      .delete(NodeID.ConvolverNode)
      .insert(EffectNodeRender.render(this.convolver, NodeID.ConvolverNode))
      .output()
  }

  public clearConvolver() {
    this.convolverFile = '原唱'
    this.nodeRender.delete(NodeID.ConvolverNode).output()
  }

  public startTender() {
    const { currentTime } = this.context
    if (!this.bigquadFilter) {
      this.bigquadFilter = this.context.createBiquadFilter()
      this.bigquadFilter.type = 'bandpass'
      this.bigquadFilter.frequency.setValueAtTime(1000, currentTime)
    }

    this.nodeRender
      .insert(
        EffectNodeRender.render(this.bigquadFilter, NodeID.BiquadFilterNode)
      )
      .output()
  }

  public clearTender() {
    this.nodeRender.delete(NodeID.BiquadFilterNode).output()
  }

  public startSpatial() {
    this.stopSurround = false
    if (!this.panner) {
      this.panner = this.context.createPanner()
      this.panner.panningModel = 'HRTF'
      this.panner.distanceModel = 'linear'
    }
    const radius = 10

    this.nodeRender
      .insert(EffectNodeRender.render(this.panner, NodeID.PannerNode))
      .output()

    let index = 0
    const start = async () => {
      if (this.stopSurround) {
        return
      }
      await sleep(16)
      const x = Math.sin(index) * radius
      const y = Math.cos(index) * radius
      this.panner?.positionX.setValueAtTime(x, this.context.currentTime)
      this.panner?.positionZ.setValueAtTime(y, this.context.currentTime)
      index += 1 / 100
      requestAnimationFrame(start)
    }
    start()
  }

  public stopSpatial() {
    this.stopSurround = true
  }

  public clearSpatial() {
    this.nodeRender.delete(NodeID.PannerNode).output()
  }

  public async startInOut(isIn: boolean) {
    const { currentTime } = this.context
    if (!this.gainNodeFade) {
      this.gainNodeFade = this.context.createGain()
    }
    this.nodeRender
      .insert(EffectNodeRender.render(this.gainNodeFade, NodeID.GainNode))
      .output()
    this.gainNodeFade.gain.cancelScheduledValues(0)
    if (isIn) {
      this.gainNodeFade.gain.linearRampToValueAtTime(1.0, currentTime + 1)
    } else {
      this.gainNodeFade.gain.linearRampToValueAtTime(0, currentTime + 1)
    }
    await sleep(1100)
  }

  public clearFade() {
    this.nodeRender.delete(NodeID.GainNode).output()
  }

  public clearBasicEffect() {
    this.stopSpatial()
    this.clearSpatial()
    this.clearFade()
    this.clearTender()
  }
}
