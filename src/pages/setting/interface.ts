import { PlaySource } from '@/interface'

export interface SettingState {
  source: PlaySource[]
  sourceAll: {
    name: string
    value: PlaySource
    disabled?: boolean
  }[]
}

export const enum SettingActions {}
export const enum SettingMutations {
  SET_SOURCE = 'SET_SOURCE'
}
