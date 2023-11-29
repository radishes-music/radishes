/**
 * Created by buddy on 2021/2/23.
 */
import { defineComponent, onMounted } from 'vue'
import { Row } from 'vant'
import Icon from '@/components-global/icon/main'
import XCell from '@/pages/auth/component/sidebar-auth/cell'
import {
  useAuthProfile,
  useLoadUserInfo,
  useLogout,
  useRouter,
  useSignin,
  useUserInfoLoading
} from '@/hooks'
import { Loading } from '@/components/loading'

export const FloatBox = defineComponent({
  name: 'FloatBox',
  props: ['onClose'],
  emits: ['close'],
  setup() {
    const $router = useRouter()
    const profile = useAuthProfile()

    const doLogout = useLogout()

    const doSingin = useSignin()

    const loadUserInfo = useLoadUserInfo()
    const userInfoLoading = useUserInfoLoading()

    onMounted(() => {
      loadUserInfo(profile.value.userId)
    })

    return function (this: any) {
      return (
        <div
          class="sidebar-profile"
          onClick={() => {
            this.$emit('close')
          }}
        >
          {userInfoLoading.value ? (
            <Loading></Loading>
          ) : (
            <>
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
            </>
          )}
        </div>
      )
    }
  }
})
