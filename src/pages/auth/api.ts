/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/camelcase */
import Md5 from 'md5'
import http from '@/utils/http'

export interface LoginRes {
  loginType: number
  code?: number
  account: Record<string, any>
  token: string
  profile: Record<string, any>
  bindings: Array<Record<string, any>>
  cookie: string
}

export const doPhoneLogin = (
  phone: string,
  password: string
): Promise<LoginRes> =>
  http.get('/api/login/cellphone', {
    params: {
      phone: phone,
      md5_password: Md5(password)
    }
  })

export const doEmailLogin = (
  email: string,
  password: string
): Promise<LoginRes> =>
  http.get('/api/login', {
    params: {
      email,
      md5_password: Md5(password)
    }
  })

export const sendMsgCode = (phone: string) =>
  http.get('/api/captcha/sent', {
    params: {
      phone
    }
  })

const registerAreset = (phone: string, password: string, code: string) =>
  http.get('/register/cellphone', {
    params: {
      captcha: code,
      phone,
      password: Md5(password),
      nickname: ''
    }
  })

export const register = registerAreset
export const resetPwd = registerAreset

// export const doResetPwd = () => {}
// export const doSignup = () => {}
