/**
 * Created by buddy on 2021/2/23.
 */
import { defineComponent } from 'vue'
import './index.less'
import {
  ListHeader,
  PlaylistContainer,
  PlaylistItemBox
} from '@/components/widgets'

/*
  TODO  我们来看一下怎么去处理这个组件
    歌单的总数量由外接传递
    是否需要加载听歌排行，也是由外接传入的
    当前的排列形式，也是有外接传入的
    用户是否登陆也是由外接传入
* * */

// TODO 目前所有信息都是以重新加载为前提
export const Playlist = defineComponent({
  name: 'Playlist',
  props: {
    layoutType: {
      type: Number,
      default: 0
    },
    list: {
      type: Array,
      default: () => []
    },
    userId: {
      type: [String, Number]
    },
    isSelf: {
      type: Boolean
    },
    playCount: {
      type: Number
    }
  },
  setup(props) {
    return function (this: any) {
      const { playCount, isSelf, userId, list, layoutType } = props

      if (list.length === 0) {
        return null
      }

      return (
        <>
          {list.length > 0 && (
            <ListHeader
              title={`${isSelf ? '我' : 'Ta'}的歌单`}
              canLayout
              count={playCount}
              layoutType={layoutType}
            ></ListHeader>
          )}
          <div style={{ paddingLeft: '30px', paddingRight: '20px' }}>
            <PlaylistContainer>
              {list.map((info: any, index: number) => (
                <PlaylistItemBox
                  info={{ ...info, isCreated: userId != info.userId }}
                  key={index}
                ></PlaylistItemBox>
              ))}
            </PlaylistContainer>
          </div>
        </>
      )
    }
  }
})
