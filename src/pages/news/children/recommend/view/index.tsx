import {
  defineComponent,
  toRefs,
  onBeforeMount,
  onActivated,
  onDeactivated,
  ref
} from 'vue'
import { Swiper } from '@/components/swiper/index'
import { Banners, TargetType, RecommendActions } from '../../../interface'
import { SongList } from '@/components-business/song-list/index'
import { useAuth } from '@/hooks/index'
import { useRecommendModule } from '@/modules/index'
import { playMusic } from '@/shared/music-shared'
import { Jump } from '@/shared/jump-shared'
import './index.less'

export const Recommend = defineComponent({
  name: 'Recommend',
  setup() {
    const { useState, useActions } = useRecommendModule()
    const { isLogin } = useAuth()
    const { banners, songList, runningSwiper } = toRefs(useState())
    const loading = ref(false)

    const getBanner = () => {
      useActions(RecommendActions.SET_ACTION_BANNERS)
    }
    const getSongList = async () => {
      loading.value = true
      if (isLogin.value) {
        await useActions(RecommendActions.SET_ACTION_RECOMMEND_SONG_LIST)
      } else {
        await useActions(RecommendActions.SET_ACTION_SONG_LIST)
      }
      loading.value = false
    }

    const jump = new Jump()
    const bannerClick = (item: Banners) => {
      if (item.targetType === TargetType.EXTERNAL) {
        window.open(item.url, '_blank', 'nodeIntegration=no')
      }
      if (item.targetType === TargetType.LIST) {
        jump.songList(item.targetId)
      }
      if (item.targetType === TargetType.MUSIC) {
        playMusic(item.targetId)
      }
    }

    const handleVisibilityChange = () => {
      runningSwiper.value = !document.hidden
    }

    document.addEventListener('visibilitychange', handleVisibilityChange, false)

    onActivated(() => {
      runningSwiper.value = true
    })

    onDeactivated(() => {
      runningSwiper.value = false
    })

    onBeforeMount(() => {
      getBanner()
      getSongList()
    })

    return () => (
      <div class="find-music-recommend">
        <div class="swiper-box">
          <Swiper
            banners={banners.value}
            running={runningSwiper.value}
            onClick={bannerClick}
          ></Swiper>
        </div>
        <div class="recommend-song">
          <h2>推荐歌单</h2>
          <SongList
            songData={songList.value}
            loading={loading.value}
            onClick={item => jump.songList(item.id)}
          />
        </div>
      </div>
    )
  }
})
