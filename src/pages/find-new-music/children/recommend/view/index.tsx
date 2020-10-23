import { defineComponent } from 'vue'
import { Swiper } from '@/components/swiper/index'
import { mapState, mapActions } from '../module'
import { Actions } from '../sage'
import { SongList } from '@/components/song-list/index'
import './index.less'

export const Recommend = defineComponent({
  name: 'Recommend',
  computed: {
    ...mapState(['banners', 'songList'])
  },
  beforeMount() {
    this.setBanner()
    this.setSongList()
  },
  methods: {
    ...mapActions({
      setBanner: Actions.SET_ACTION_BANNERS,
      setSongList: Actions.SET_ACTION_SONG_LIST
    })
  },
  render() {
    const { banners } = this
    return (
      <div class="find-music-recommend">
        <div class="swiper-box">
          <Swiper banners={banners}></Swiper>
        </div>
        <div class="recommend-song">
          <h2>推荐歌单</h2>
          <SongList songData={this.songList}></SongList>
        </div>
      </div>
    )
  }
})
