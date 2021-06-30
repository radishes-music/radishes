import { PlaySource, BasicEffect, ConvolutionFile } from '@/interface'

export enum Language {
  ZH = 'zh',
  En = 'en'
}

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
  upgrade: boolean
  language: Language
}

export const enum SettingActions {}
export const enum SettingMutations {
  SET_SOURCE = 'SET_SOURCE',
  SET_BIT_RATE = 'SET_BIT_RATE',
  SET_BASIC_EFFECT = 'SET_BASIC_EFFECT',
  SET_CONVOLVER_EFFECT = 'SET_CONVOLVER_EFFECT',
  SET_UPGRADE = 'SET_UPGRADE',
  SET_LANGUAGE = 'SET_LANGUAGE'
}
