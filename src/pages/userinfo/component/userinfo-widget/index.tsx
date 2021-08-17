/**
 * Created by buddy on 2021/2/25.
 */
import { defineComponent, reactive } from 'vue'
import { List } from 'vant'
import { useIsSelf, usePlaylist } from '@/hooks'
import { AudioList } from '@/pages/userinfo/component/audiolist'
import './widget/user-info/index.less'
import { Playlist } from '@/pages/userinfo/component/playlist'
import { UserInfo } from '@/pages/userinfo/component/userinfo-widget/widget/user-info'

// TODO 歌单的排列方式是要记录在全局变量里面的，然后用户切换了方式等于查看其它个人列表也跟着变了
export const UserInfoWidget = defineComponent({
  name: 'UserInfoWidget',
  props: {
    profile: {
      type: Object,
      default: () => ({})
    },
    audio: {
      type: Array,
      default: () => []
    },
    userId: {
      type: String
    }
  },
  setup(props: any, ...args) {
    const isSelf = useIsSelf(props.userId)

    const loadPlaylist = usePlaylist(
      props.userId,
      props.profile.peopleCanSeeMyPlayRecord,
      props.profile.listenSongs
    )

    const state: any = reactive({
      loading: false,
      finished: false,
      error: false,
      list: []
    })

    const onLoad = async () => {
      state.loading = true
      try {
        const res = await loadPlaylist(state.list.length)
        state.finished = !res.more
        state.list = [...state.list, ...res.playlist]
        state.loading = false
      } catch (e) {
        state.loading = false
        state.error = true
      }
    }

    return function() {
      const { profile, audio, userId } = props

      return (
        <List
          class="userinfo-view"
          onLoad={onLoad}
          loading={state.loading}
          finished={state.finished}
          finishedText={$t(
            'src__pages__userinfo__component__userinfo-widget__index___65'
          )}
          error={state.error}
          errorText={$t(
            'src__pages__userinfo__component__userinfo-widget__index___67'
          )}
        >
          <UserInfo profile={profile}></UserInfo>

          <AudioList
            audio={audio}
            title={$t(
              'src__pages__userinfo__component__userinfo-widget__index___73',
              isSelf.value
                ? $t('src__pages__userinfo__component__playlist__index___52')
                : 'Ta'
            )}
          ></AudioList>

          <Playlist
            list={state.list}
            userId={userId}
            isSelf={isSelf.value}
            playCount={
              isSelf.value
                ? profile.subPlaylistCount + profile.playlistCount
                : undefined
            }
          ></Playlist>

          {/*<PlaylistItemCell></PlaylistItemCell>*/}
          {/*<PlaylistItemInfo></PlaylistItemInfo>*/}
        </List>
      )
    }
  }
})
