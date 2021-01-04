import { PlaySource } from '@/interface'

export interface SettingState {
  source: PlaySource[]
  sourceAll: {
    name: string
    value: PlaySource
    disabled?: boolean
  }[]
  bitRate: number
}

export const enum SettingActions {}
export const enum SettingMutations {
  SET_SOURCE = 'SET_SOURCE',
  SET_BIT_RATE = 'SET_BIT_RATE'
}
