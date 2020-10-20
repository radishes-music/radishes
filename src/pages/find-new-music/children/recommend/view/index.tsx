import { defineComponent, onBeforeMount } from 'vue'
import { Swiper } from '@/components/swiper/index'
import { mapState, mapActions } from '../module'
import { Actions } from '../sage'
import './index.less'

export const Recommend = defineComponent({
  name: 'Recommend',
  computed: {
    ...mapState(['banners'])
  },
  beforeMount() {
    this.setBanner()
  },
  methods: {
    ...mapActions({
      setBanner: Actions.SET_ACTION_RESOURCE
    })
  },
  render() {
    const { banners } = this
    return (
      <div class="find-music-recommend">
        <div class="swiper-box">
          <Swiper banners={banners}></Swiper>
        </div>
      </div>
    )
  }
})
