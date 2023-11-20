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
  level: number
  pcSign: boolean
}

export const getUserDetail = (uid: string) =>
  http.get('/api/user/detail', {
    params: {
      uid
    }
  })

export const doPhoneLogin = async (
  phone: string,
  password: string
): Promise<LoginRes> => {
  const res: LoginRes = await http.get('/api/login/cellphone', {
    params: {
      phone: phone,
      md5_password: Md5(password)
    }
  })

  const info: any = await getUserDetail(res.profile.userId)
  res.profile = { ...res.profile, ...info.profile }
  res.profile.level = info.level
  res.profile.pcSign = info.pcSign

  return res
}

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
  http.get('/api/register/cellphone', {
    params: {
      captcha: code,
      phone,
      password,
      nickname: ''
    }
  })

export const register = registerAreset
export const resetPwd = registerAreset

export const checkPhone = (phone: string) =>
  http.get('/api/cellphone/existence/check', {
    params: {
      phone
    }
  })

// TODO 要获取一个签到状态来控制签到按钮状态
/*
  0 安卓端
  1 web/PC 端
*/
export const doSignin = () =>
  http.get('/api/daily_signin', {
    params: {
      type: 1
    }
  })

// TODO 退出登录
export const doLogout = () => http.get('/api/logout')
