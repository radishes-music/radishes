import { defineComponent, onMounted, onUnmounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Image, Row } from 'vant'
import { useAuth, useLoadProfile, useLogout, useSignin } from '@/hooks/auth'
import { showLogin } from '@/helpers'
import Icon from '@/components-global/icon/main'
import XCell from './cell'
import './style.less'

const DEFAULT_AVATAR =
  'https://p4.music.126.net/VnZiScyynLG7atLIZ2YPkw==/18686200114669622.jpg'

// TODO 由于没有提供对应的绑定接口，绑定社交账号该功能无法完成[Disabled]
export const SidebarAuth = defineComponent({
  name: 'SidebarAuth',
  setup() {
    const state = reactive({
      show: false
    })
    const { isLogin, profile } = useAuth()
    const $router = useRouter()

    const unLoginClick = () => {
      if (!isLogin.value) {
        showLogin()
      }
    }

    const goProfile = (e: any) => {
      if (isLogin.value) $router.push('/profile')
    }

    const popupProfile = (e: any) => {
      if (isLogin.value) {
        e.stopPropagation()
        state.show = !state.show
      }
    }

    const doLogout = useLogout()

    const loadProfile = useLoadProfile()

    const doSingin = useSignin()

    const clickListener = (e: any) => {
      if (state.show) {
        state.show = false
      }
    }

    onMounted(() => {
      loadProfile()
      document.addEventListener('click', clickListener)
    })
    onUnmounted(() => {
      document.removeEventListener('click', clickListener)
    })

    return () => {
      const text = isLogin.value ? profile.value.nickname : '未登录'
      const head = isLogin.value ? profile.value.avatarUrl : DEFAULT_AVATAR
      return (
        <div class="sidebar-nav-login" onClick={unLoginClick}>
          <div class="sidebar-nav-loginbox">
            <Image
              width="40"
              height="40"
              src={head}
              round
              fit="cover"
              onClick={goProfile}
              class="cursor-pointer"
            ></Image>
            <span onClick={popupProfile}>{text}</span>
            {isLogin.value && state.show && (
              <div
                class="sidebar-profile"
                onClick={() => {
                  state.show = false
                }}
              >
                <div>
                  <div class="sidebar-x__info">
                    {[
                      {
                        name: '动态',
                        value: profile.value.eventCount,
                        onClick: () => {
                          $router.push('/eventView')
                        }
                      },
                      {
                        name: '关注',
                        value: profile.value.follows,
                        onClick: () => {
                          $router.push('/followList')
                        }
                      },
                      {
                        name: '粉丝',
                        value: profile.value.followeds,
                        onClick: () => {
                          $router.push('/fansView')
                        }
                      }
                    ].map((item, index) => {
                      return (
                        <div
                          class="sidebar-x__item"
                          key={index}
                          onClick={item.onClick}
                        >
                          <div>{item.value}</div>
                          <div>{item.name}</div>
                        </div>
                      )
                    })}
                  </div>
                  <Row type="flex" justify="center">
                    {profile.value.pcSign ? (
                      <div class="sidebar-x__signin">已签到</div>
                    ) : (
                      <div
                        class="sidebar-x__unsignin"
                        onClick={e => {
                          e.stopPropagation()
                          doSingin()
                        }}
                      >
                        <Icon icon="jinbi" color="#8c8c8c" size={16}></Icon>
                        &nbsp;签到
                      </div>
                    )}
                  </Row>
                </div>
                <div class="sidebar-hr"></div>
                <XCell
                  icon="daV"
                  title="会员中心"
                  externalLink="https://music.163.com/#/member"
                >
                  {profile.value.vipType == 0 ? '未订购' : '待确认'}
                </XCell>
                <XCell
                  icon="dengji"
                  title="等级"
                  externalLink="https://music.163.com/#/user/level"
                >
                  Lv. {profile.value.level}
                </XCell>
                <XCell
                  icon="gouwuche"
                  title="商城"
                  externalLink="https://music.163.com/store/product"
                ></XCell>
                <div class="sidebar-hr"></div>
                {/* localPage */}
                <XCell
                  icon="chilun"
                  title="个人信息设置"
                  onClick={() => {
                    $router.push('/userSetting')
                  }}
                ></XCell>
                {/* localPage */}
                <XCell icon="shouji" title="绑定社交账号">
                  <Icon icon="weibo" color="#afafaf" size={18}></Icon>
                </XCell>
                <div class="sidebar-hr"></div>
                <XCell
                  icon="guanji"
                  onClick={doLogout}
                  title="退出登录"
                  needArrow={false}
                ></XCell>
              </div>
            )}
          </div>
        </div>
      )
    }
  }
})
