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
  TODO  { $t('src__pages__userinfo__component__playlist__index___12') }
    { $t('src__pages__userinfo__component__playlist__index___13') }
    { $t('src__pages__userinfo__component__playlist__index___14') }
    { $t('src__pages__userinfo__component__playlist__index___15') }
    { $t('src__pages__userinfo__component__playlist__index___16') }
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
    return function(this: any) {
      const { playCount, isSelf, userId, list, layoutType } = props

      if (list.length === 0) {
        return null
      }

      return (
        <>
          {list.length > 0 && (
            <ListHeader
              title={$t(
                'src__pages__userinfo__component__playlist__index___53',
                isSelf
                  ? $t('src__pages__userinfo__component__playlist__index___52')
                  : 'Ta'
              )}
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
