/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/camelcase,vue/require-default-prop,@typescript-eslint/ban-ts-ignore*/
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
