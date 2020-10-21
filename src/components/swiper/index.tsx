import { defineComponent, ref, watch, onMounted, onUnmounted } from 'vue'
import { State } from '@/pages/find-new-music/children/recommend/state'
import classnames from 'classnames'
import './index.less'

// Internal management current
// Logic to be optimized
export const Swiper = defineComponent({
  props: ['banners'],
  setup(props) {
    const current = ref(0)
    const nextActive = ref(true)
    const spanCurrent = ref(false)

    let timer: NodeJS.Timeout

    const internalHook = (ms: number): NodeJS.Timeout => {
      const t = setInterval(() => {
        current.value =
          current.value >= props.banners.length - 1 ? 0 : current.value + 1
      }, ms)
      return t
    }

    const handleChangeBanner = (index: number) => {
      current.value = index
      clearInterval(timer)
    }

    const handleMouseEnter = () => {
      clearInterval(timer)
    }

    const handleMouseLeave = () => {
      timer = internalHook(4000)
    }

    onMounted(() => {
      timer = internalHook(4000)
    })

    onUnmounted(() => {
      clearInterval(timer)
    })

    watch(current, (modern, history) => {
      nextActive.value =
        (modern > history ||
          (modern === 0 && history === props.banners.length - 1)) &&
        !(modern === props.banners.length - 1 && history === 0)

      spanCurrent.value =
        Math.abs(modern - history) > 1 &&
        Math.abs(modern - history) !== props.banners.length - 1
    })

    return {
      current,
      nextActive,
      spanCurrent,
      handleChangeBanner,
      handleMouseEnter,
      handleMouseLeave
    }
  },
  render() {
    const { banners } = this.$props as State
    const { current, nextActive, spanCurrent } = this
    const renderClass = (index: number) => {
      const next =
        index === current + 1 || (current === banners.length - 1 && index === 0)
      const prev =
        index === current - 1 || (current === 0 && index === banners.length - 1)

      return classnames({
        prev: prev,
        'prev-active': prev && !nextActive && !spanCurrent,
        'prev-span': prev && spanCurrent,
        current: index === current,
        'current-span': index === current && spanCurrent,
        next: next,
        'next-active': nextActive && next && !spanCurrent,
        'next-span': next && spanCurrent,
        'span-current': spanCurrent
      })
    }
    return (
      <div class="swiper">
        <ul class="swiper-container">
          {banners.map((item, index: number) => (
            <li
              class={renderClass(index)}
              onMouseenter={this.handleMouseEnter}
              onMouseleave={this.handleMouseLeave}
            >
              <div style={{ backgroundImage: `url(${item.imageUrl})` }}></div>
            </li>
          ))}
        </ul>
        <ul class="swiper-pagination">
          {banners.map((item, index) => (
            <li
              class={classnames({
                'swiper-pagination-active': index === current
              })}
              onMouseenter={() => this.handleChangeBanner(index)}
              onMouseleave={this.handleMouseLeave}
            ></li>
          ))}
        </ul>
      </div>
    )
  }
})
