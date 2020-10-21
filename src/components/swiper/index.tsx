import {
  defineComponent,
  ref,
  watch,
  nextTick,
  onUnmounted,
  onMounted
} from 'vue'
import { State } from '@/pages/find-new-music/children/recommend/state'
import classnames from 'classnames'
import { internalHook } from '@/utils/hook'
import './index.less'

// Internal management current
// Logic to be optimized
export const Swiper = defineComponent({
  props: ['banners'],
  setup(props) {
    const current = ref(0)
    const nextActive = ref(true)
    const spanCurrent = ref(false)

    const { startInternal, stopInternal } = internalHook(4000, () => {
      current.value =
        current.value >= props.banners.length - 1 ? 0 : current.value + 1
    })

    const handleChangeBanner = (index: number) => {
      current.value = index
    }

    const handleMouseEnter = () => {
      stopInternal()
    }

    const handleMouseLeave = () => {
      startInternal()
    }

    onMounted(() => {
      startInternal()
    })

    onUnmounted(() => {
      stopInternal()
    })

    watch(current, (modern, history) => {
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
      handleMouseLeave,
      startInternal,
      stopInternal
    }
  },
  render() {
    const { banners } = this.$props as State
    const { current, spanCurrent } = this
    const renderClass = (index: number) => {
      const next =
        index === current + 1 || (current === banners.length - 1 && index === 0)
      const prev =
        index === current - 1 || (current === 0 && index === banners.length - 1)

      return classnames('normal-item', {
        prev: prev,
        'prev-span': prev && spanCurrent,
        current: index === current,
        'current-span': index === current && spanCurrent,
        next: next,
        'next-span': next && spanCurrent,
        'span-current': spanCurrent
      })
    }
    const nextAction = () => {
      this.current = this.current >= banners.length - 1 ? 0 : this.current + 1
    }

    const prevAction = () => {
      this.current = this.current <= 0 ? banners.length - 1 : this.current - 1
    }

    return (
      <div
        class="swiper"
        onMouseenter={this.handleMouseEnter}
        onMouseleave={this.handleMouseLeave}
      >
        <ul class="swiper-container">
          <div class="swiper-container-left" onClick={prevAction}>
            <icon icon="toLeft" size={42}></icon>
          </div>
          {banners.map((item, index: number) => (
            <li class={renderClass(index)}>
              <div style={{ backgroundImage: `url(${item.imageUrl})` }}></div>
            </li>
          ))}
          <div class="swiper-container-right" onClick={nextAction}>
            <icon icon="toRight" size={42}></icon>
          </div>
        </ul>
        <ul class="swiper-pagination">
          {banners.map((item, index) => (
            <li
              class={classnames({
                'swiper-pagination-active': index === current
              })}
              onMouseenter={() => this.handleChangeBanner(index)}
            ></li>
          ))}
        </ul>
      </div>
    )
  }
})
