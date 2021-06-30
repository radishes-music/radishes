export const AUTH_TYPE: Record<string, number> = {
  PHONE_LOGIN: 0,
  EMAIL_LOGIN: 1,
  REGISTER: 2,
  RESET_PWD: 3,
  SMS_CODE: 4
}

export const TERMS = [
  {
    name: j18n.load('src__pages__auth__constant___10'),
    link: 'https://st.music.163.com/official-terms/service'
  },
  {
    name: j18n.load('src__pages__auth__constant___14'),
    link: 'https://st.music.163.com/official-terms/privacy'
  },
  {
    name: j18n.load('src__pages__auth__constant___18'),
    link: 'https://st.music.163.com/official-terms/children'
  }
]

export const PROVIDER_AUTH_UTIL = 'authUtil'
