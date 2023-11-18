/**
 * Created by buddy on 2021/2/26.
 */
import { defineComponent, reactive } from 'vue'
import { Image, List } from 'vant'
import Icon from '@/components-global/icon/main'
import './index.less'
import { isNumber, overNum } from '@/utils'

// TODO 是否是听歌记录？

export const PlaylistContainer = defineComponent({
  name: 'PlaylistContainer',
  setup() {
    return function (this: any) {
      return (
        <List class="playlist-item__container">{this.$slots.default?.()}</List>
      )
    }
  }
})

export const PlaylistItemBox = defineComponent({
  name: 'PlaylistItemBox',
  props: ['info'],
  setup(props) {
    const state = reactive({
      show: false
    })

    return function () {
      const { coverImgUrl, name, trackCount, playCount, isCreated, record } =
        props.info || {}

      return (
        <div class="playlist-item__box">
          <div
            class="playlist-item__boxposter"
            onMouseenter={() => {
              state.show = true
            }}
            onMouseleave={() => {
              state.show = false
            }}
          >
            <div class="playlist-item__boximgv">
              <Image
                width="100%"
                src={coverImgUrl}
                class="playlist-item__boximg"
                fit="cover"
              ></Image>
            </div>

            <div class="playlist-item__boxmask"></div>

            {isCreated && (
              <div class="playlist-item__boxlike">
                <Icon icon="weibiaoti-" color="#ff0000ba"></Icon>
              </div>
            )}

            {isNumber(playCount) && (
              <div class="playlist-item__boxplaycount">
                <Icon icon="play-mobile" color="#fff" size={12}></Icon>
                &nbsp;{overNum(playCount)}
              </div>
            )}
            {state.show && (
              <div class="playlist-item__boxplayicon">
                <Icon icon="play-copy" color="auto"></Icon>
              </div>
            )}
          </div>
          <div class="playlist-item__boxname link-text">{name}</div>
          <div class="playlist-item__boxcount">{`${
            record ? '累积听歌' : ''
          }${trackCount}首`}</div>
        </div>
      )
    }
  }
})
