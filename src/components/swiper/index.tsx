import { defineComponent, toRefs } from 'vue'
import { State } from '@/pages/find-new-music/children/recommend/state'

export const Swiper = defineComponent({
  props: ['resource', 'banners'],
  render() {
    // TODO
    const { banners } = this.$props as State
    return (
      <div class="swiper">
        <ul>
          {banners.map(item => (
            <li>
              <div style={{ backgroundImage: `url(${item.imageUrl})` }}></div>
            </li>
          ))}
        </ul>
      </div>
    )
  }
})
