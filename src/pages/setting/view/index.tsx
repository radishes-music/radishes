import { defineComponent, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from '@/hooks/index'
import { CheckboxGroup, Checkbox } from 'vant'
import { useSettingModule } from '@/modules/index'
import { PlaySource, SettingMutations } from '@/interface'
import { toFixed } from '@/utils/index'
import classnames from 'classnames'
import debounce from 'lodash/debounce'
import './index.less'

export const Setting = defineComponent({
  name: 'Setting',
  setup() {
    const { useState, useMutations } = useSettingModule()
    const state = useState()
    const route = useRoute()
    const contanier = ref<HTMLElement>()
    const currentLocation = ref(route.params.location)
    const areaFormat = ref<
      {
        location: string
        top: number
      }[]
    >([])

    const markNav = [
      {
        location: 'source',
        name: '播放源'
      },
      {
        location: 'download',
        name: '下载设置'
      },
      {
        location: 'author',
        name: '作者'
      },
      {
        location: 'about',
        name: '关于 radishes'
      }
    ]

    const jumpTop = (top: number | string) => {
      if (contanier.value) {
        if (typeof top === 'number') {
          contanier.value.scrollTop = top
        }
        if (typeof top === 'string') {
          const currentArea = areaFormat.value.find(
            item => item.location === top
          )
          if (currentArea) {
            contanier.value.scrollTop = currentArea.top
          }
        }
      }
    }

    const handleJump = (loc: string) => {
      jumpTop(loc)
    }

    const handleWatch = watch(
      () => route.params.location,
      loc => {
        jumpTop(loc as string)
        console.log(loc)
      }
    )

    onUnmounted(() => {
      handleWatch()
    })

    onMounted(() => {
      if (contanier.value) {
        const children = contanier.value.children
        const contanierTop = contanier.value.getBoundingClientRect().top + 50
        for (let i = 0; i < children.length; i++) {
          const area = children[i] as HTMLElement
          const top = toFixed(
            area.getBoundingClientRect().top - contanierTop,
            2
          )
          const location = area.dataset.location
          if (location) {
            areaFormat.value[i] = {
              location,
              top
            }
          }
        }
        console.log(areaFormat.value)
      }
    })

    const onScroll = () => {
      const el = contanier.value
      if (el) {
        const top = toFixed(el.scrollTop, 2)
        for (let i = 0; i < areaFormat.value.length; i++) {
          const area = areaFormat.value[i]
          const areaNext = areaFormat.value[i + 1]
          if (top >= area.top && top < areaNext.top) {
            currentLocation.value = area.location
          }
        }
      }
    }

    const handleChangeCheck = (checked: PlaySource[]) => {
      useMutations(SettingMutations.SET_SOURCE, checked)
    }

    return () => (
      <div class="setting-view">
        <h1>设置</h1>
        <div class="setting-view-route">
          <ul>
            {markNav.map(item => {
              return (
                <li
                  class={classnames('none-select', {
                    'setting-view-route--active':
                      item.location === currentLocation.value
                  })}
                  onClick={() => handleJump(item.location)}
                >
                  {item.name}
                </li>
              )
            })}
          </ul>
        </div>
        <div
          ref={contanier}
          onScroll={debounce(onScroll, 10)}
          class="setting-view-contanier"
        >
          <div class="setting-view-contanier--source" data-location="source">
            <h2>播放源</h2>
            <div class="setting-view-description">
              设置播放源是为了提高播放成功率，但是会增加等待时间，因为需要在已选择的平台上进行搜索。
            </div>
            <CheckboxGroup
              direction="horizontal"
              v-model={state.source}
              onChange={handleChangeCheck}
            >
              {state.sourceAll.map(source => {
                return (
                  <Checkbox
                    shape="square"
                    checked-color="var(--base-color)"
                    icon-size="16px"
                    disabled={source.disabled}
                    name={source.value}
                  >
                    {source.name}
                  </Checkbox>
                )
              })}
            </CheckboxGroup>
          </div>
          <div class="setting-view-contanier--setting" data-location="download">
            <h2>下载设置</h2>
            <div class="setting-view-description">
              下载设置可以帮助你选择不同的文件夹以保存下载的歌曲，还可以选择不同音质的歌曲进行下载。
            </div>
          </div>
          <div class="setting-view-contanier--author" data-location="author">
            <h2>作者</h2>
            <ul>
              <li>
                <a href="https://github.com/little-buddy" target="_blank">
                  Buddy
                </a>
              </li>
              <li>
                <a href="https://github.com/Linkontoask" target="_blank">
                  Link
                </a>
              </li>
            </ul>
          </div>
          <div class="setting-view-contanier--about" data-location="about">
            <h2>关于 radishes</h2>
            <div class="setting-view-paragraph">
              radishes
              是一款参考网易云音乐客户端实现的跨平台播放器。如果在使用过程中遇到任何问题可以在
              <a href="https://github.com/Linkontoask/radishes" target="_blank">
                Github
              </a>
              上联系我们。
            </div>
            <div class="setting-view-paragraph">
              radishes
              成立之初是为了分享与学习，如果有侵权行为，请联系作者及时更改。radishes
              使用
              <a
                href="https://github.com/Linkontoask/radishes/blob/next/LICENSE"
                target="_blank"
              >
                MIT
              </a>
              协议，你可以自行复制与更改，如果你有时间，也欢迎加入我们完善
              radishes。
            </div>
            <div class="setting-view-paragraph">
              radishes 还可以在线访问。在线访问有两个链接：
              <ul>
                <li>
                  <a href="http://112.74.169.178/music/" target="_blank">
                    http://112.74.169.178/music/
                  </a>
                </li>
                <li>
                  <a href="https://hq001.github.io/" target="_blank">
                    https://hq001.github.io/
                  </a>
                </li>
              </ul>
            </div>
            <div class="setting-view-paragraph">
              第一个链接可以正常使用登录功能，第二链接没办法使用和cookie相关的功能，原因可以在
              <a
                href="https://github.com/Linkontoask/radishes#%E5%9C%A8%E7%BA%BF%E8%AE%BF%E9%97%AE%E8%AF%B4%E6%98%8E"
                target="_blank"
              >
                这里
              </a>
              找到。
            </div>
          </div>
        </div>
      </div>
    )
  }
})
