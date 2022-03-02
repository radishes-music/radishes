import { defineComponent, toRefs, watch, ref, computed } from 'vue'
import { SongList as ListComponent } from '@/components-business/song-list/index'
import { useRoute, useRouter } from '@/hooks/index'
import { useSongListModule } from '@/modules'
import { SongListActions, Tags } from '@/interface'
import { Popover, Button } from 'ant-design-vue'
import { Jump } from '@/shared/jump-shared'
import classnames from 'classnames'
import './index.less'

export const SongList = defineComponent({
  name: 'SongList',
  setup() {
    const visible = ref(false)
    const route = useRoute()
    const router = useRouter()

    const { useState, useActions } = useSongListModule()
    const { songList, tagsHot, tags } = toRefs(useState())

    const tagsViewKeyMap: Record<number, string> = {
      0: '语种',
      1: '风格',
      2: '场景',
      3: '情感',
      4: '主题'
    }
    const tagsView = computed(() => {
      const view = tags.value.reduce(
        (prev: Record<string, Tags[]>, curr): Record<string, Tags[]> => {
          const key = tagsViewKeyMap[curr.category]
          prev[key] ? prev[key].push(curr) : (prev[key] = [curr])
          return prev
        },
        {}
      )
      return view
    })

    useActions(SongListActions.SET_ACTION_SONG_LIST, {
      limit: 30,
      cat: route.query.tag
    })
    useActions(SongListActions.SET_ACTION_TAGS)
    useActions(SongListActions.SET_ACTION_HOT_TAGS)

    watch(
      () => route.query.tag,
      v => {
        if (v) {
          useActions(SongListActions.SET_ACTION_SONG_LIST, {
            cat: v === 'all' ? '' : v,
            limit: 30
          })
        }
      }
    )

    const switchPlaylist = (tag: Tags) => {
      visible.value = false
      router.push({
        path: '/music/songlist',
        query: {
          tag: tag.name
        }
      })
    }

    const jump = new Jump()

    return () => (
      <div class="find-music-songlist">
        <div class="find-music-songlist--tags">
          <Popover
            v-model={[visible.value, 'visible']}
            placement="rightTop"
            trigger="click"
            v-slots={{
              content: () => (
                <div class="highquality-tags">
                  {(Reflect.ownKeys(tagsView.value) as string[]).map(type => {
                    return (
                      <div class="highquality-tags-item">
                        <div class="highquality-tags-item--type">{type}</div>
                        <div class="highquality-tags-item--tags">
                          {tagsView.value[type].map(tag => (
                            <div
                              class={classnames({
                                'active-tag': route.query.tag === tag.name
                              })}
                              onClick={() => switchPlaylist(tag)}
                            >
                              {tag.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ),
              default: () => <Button shape="round">全部歌单</Button>
            }}
          ></Popover>

          <div class="find-music-songlist--hot">
            <ul>
              {tagsHot.value.map(tag => (
                <li
                  class={classnames({
                    'active-tag': route.query.tag === tag.name
                  })}
                  onClick={() => switchPlaylist(tag)}
                >
                  {tag.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <ListComponent
          songData={songList.value}
          onClick={item => jump.songList(item.id)}
        ></ListComponent>
      </div>
    )
  }
})
