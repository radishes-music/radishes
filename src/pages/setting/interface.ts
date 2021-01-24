import { PlaySource, BasicEffect, ConvolutionFile } from '@/interface'

export interface SettingState {
  source: PlaySource[]
  sourceAll: {
    name: string
    value: PlaySource
    disabled?: boolean
  }[]
  bitRate: number
  basicEffect: BasicEffect[]
  convolver: ConvolutionFile
  convolverAll: ConvolutionFile[]
}

export const enum SettingActions {}
export const enum SettingMutations {
  SET_SOURCE = 'SET_SOURCE',
  SET_BIT_RATE = 'SET_BIT_RATE',
  SET_BASIC_EFFECT = 'SET_BASIC_EFFECT',
  SET_CONVOLVER_EFFECT = 'SET_CONVOLVER_EFFECT'
}
