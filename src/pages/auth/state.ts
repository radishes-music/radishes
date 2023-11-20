import { Song } from '@/interface'

export interface AuthState {
  user: {
    loginType: number
    code?: number
    account: any
    token: string
    profile: any
    bindings: Array<any>
    cookie: string
    [key: string]: any
  } | null
  show: boolean
  userInfoLoading: boolean
  playlist: Song[]
}

export interface AuthGetter {
  isLogin: boolean
}

export const state = {
  user: null,
  show: false,
  userInfoLoading: false,
  playlist: []
}
