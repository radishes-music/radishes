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

    return function(this: any) {
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
                      name: $t(
                        'src__pages__auth__component__sidebar-auth__float-box___52'
                      ),
                      value: profile.value.eventCount,
                      onClick: () => {
                        $router.push('/eventView')
                      }
                    },
                    {
                      name: $t(
                        'src__pages__auth__component__sidebar-auth__float-box___59'
                      ),
                      value: profile.value.follows,
                      onClick: () => {
                        $router.push('/followList')
                      }
                    },
                    {
                      name: $t(
                        'src__pages__auth__component__sidebar-auth__float-box___66'
                      ),
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
                    <div class="sidebar-x__signin">
                      {$t(
                        'src__pages__auth__component__sidebar-auth__float-box___87'
                      )}
                    </div>
                  ) : (
                    <div
                      class="sidebar-x__unsignin"
                      onClick={e => {
                        e.stopPropagation()
                        doSingin()
                      }}
                    >
                      <Icon icon="jinbi" color="#8c8c8c" size={16}></Icon>
                      &nbsp;
                      {$t(
                        'src__pages__auth__component__sidebar-auth__float-box___97'
                      )}
                    </div>
                  )}
                </Row>
              </div>
              <div class="sidebar-hr"></div>
              <XCell
                icon="daV"
                title={$t(
                  'src__pages__auth__component__sidebar-auth__float-box___105'
                )}
                externalLink="https://music.163.com/#/member"
              >
                {profile.value.vipType == 0
                  ? $t(
                      'src__pages__auth__component__sidebar-auth__float-box___108____6'
                    )
                  : $t(
                      'src__pages__auth__component__sidebar-auth__float-box___108'
                    )}
              </XCell>
              <XCell
                icon="dengji"
                title={$t(
                  'src__pages__auth__component__sidebar-auth__float-box___112'
                )}
                externalLink="https://music.163.com/#/user/level"
              >
                Lv. {profile.value.level}
              </XCell>
              <XCell
                icon="gouwuche"
                title={$t(
                  'src__pages__auth__component__sidebar-auth__float-box___119'
                )}
                externalLink="https://music.163.com/store/product"
              ></XCell>
              <div class="sidebar-hr"></div>
              {/* localPage */}
              <XCell
                icon="chilun"
                title={$t(
                  'src__pages__auth__component__sidebar-auth__float-box___126'
                )}
                onClick={() => {
                  $router.push('/userSetting')
                }}
              ></XCell>
              {/* localPage */}
              <XCell
                icon="shouji"
                title={$t(
                  'src__pages__auth__component__sidebar-auth__float-box___132'
                )}
              >
                <Icon icon="weibo" color="#afafaf" size={18}></Icon>
              </XCell>
              <div class="sidebar-hr"></div>
              <XCell
                icon="guanji"
                onClick={doLogout}
                title={$t(
                  'src__pages__auth__component__sidebar-auth__float-box___139'
                )}
                needArrow={false}
              ></XCell>
            </>
          )}
        </div>
      )
    }
  }
})
