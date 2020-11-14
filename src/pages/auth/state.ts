export interface AuthState {
  user: {
    loginType: number
    code?: number
    account: any
    token: string
    profile: any
    bindings: Array<any>
    cookie: string
  } | null
  show: boolean
}

export const state = {
  user: null,
  show: false
}
