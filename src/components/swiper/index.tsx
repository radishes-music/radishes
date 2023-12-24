import {
  defineComponent,
  ref,
  watch,
  watchEffect,
  onUnmounted,
  toRefs,
  PropType
} from 'vue'
import { Banners } from '@/interface/index'
import { useInternal } from '@/hooks/index'
import { Image } from '@/components/image/index'
import { noop } from '@/utils'
import classnames from 'classnames'
import './index.less'

const prefix = 'swiper'

// Internal management current
// Logic to be optimized
export const Swiper = defineComponent({
  props: {
    banners: {
      type: Object as PropType<Banners[]>,
      required: true
    },
    running: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    onClick: {
      type: Function as PropType<(item: Banners) => void>,
      default: noop
    }
  },
  emits: ['click'],
  setup(props, { emit }) {
    const current = ref(0)
    const spanCurrent = ref(false)

    const { running } = toRefs(props)

    const { startInternal, stopInternal } = useInternal(4000, () => {
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

    onUnmounted(() => {
      stopInternal()
    })

    watchEffect(() => {
      if (running.value) {
        startInternal()
      } else {
        stopInternal()
      }
    })

    watch(current, (modern, history) => {
      spanCurrent.value =
        Math.abs(modern - history) > 1 &&
        Math.abs(modern - history) !== props.banners.length - 1
    })

    const { banners } = toRefs(props)
    const renderClass = (index: number) => {
      const next =
        index === current.value + 1 ||
        (current.value === banners.value.length - 1 && index === 0)
      const prev =
        index === current.value - 1 ||
        (current.value === 0 && index === banners.value.length - 1)

      return classnames(`${prefix}-normal-item`, {
        [`${prefix}-prev`]: prev,
        [`${prefix}-prev-span`]: prev && spanCurrent.value,
        [`${prefix}-current`]: index === current.value,
        [`${prefix}-current-span`]:
          index === current.value && spanCurrent.value,
        [`${prefix}-next`]: next,
        [`${prefix}-next-span`]: next && spanCurrent.value,
        [`${prefix}-span-current`]: spanCurrent.value
      })
    }
    const nextAction = () => {
      current.value =
        current.value >= banners.value.length - 1 ? 0 : current.value + 1
    }

    const prevAction = () => {
      current.value =
        current.value <= 0 ? banners.value.length - 1 : current.value - 1
    }

    const handleClick = (item: Banners) => {
      emit('click', item)
    }

    return () => (
      <div
        class={`${prefix} relative`}
        onMouseenter={handleMouseEnter}
        onMouseleave={handleMouseLeave}
      >
        <ul class={`${prefix}-container`}>
          <div class={`${prefix}-container-left`} onClick={prevAction}>
            <icon icon="toLeft" size={42}></icon>
          </div>
          {banners.value.map((item, index: number) => (
            <li class={renderClass(index)} onClick={() => handleClick(item)}>
              <Image src={item.imageUrl} />
              <i class={`${prefix}-container-title  rounded !font-normal`}>
                {item.typeTitle}
              </i>
            </li>
          ))}
          <div class={`${prefix}-container-right`} onClick={nextAction}>
            <icon icon="toRight" size={42}></icon>
          </div>
        </ul>
        <ul class={`${prefix}-pagination`}>
          {banners.value.map((item, index) => (
            <li
              class={classnames({
                [`${prefix}-pagination-active`]: index === current.value
              })}
              onMouseenter={() => handleChangeBanner(index)}
            ></li>
          ))}
        </ul>
      </div>
    )
  }
})
