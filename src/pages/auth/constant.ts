export const AUTH_TYPE: Record<string, number> = {
  PHONE_LOGIN: 0,
  EMAIL_LOGIN: 1,
  REGISTER: 2,
  RESET_PWD: 3,
  SMS_CODE: 4
}

export const TERMS = [
  {
    name: '《服务条款》',
    link: 'https://st.music.163.com/official-terms/service'
  },
  {
    name: '《隐私政策》',
    link: 'https://st.music.163.com/official-terms/privacy'
  },
  {
    name: '《儿童隐私政策》',
    link: 'https://st.music.163.com/official-terms/children'
  }
]

export const PROVIDER_AUTH_UTIL = 'authUtil'
