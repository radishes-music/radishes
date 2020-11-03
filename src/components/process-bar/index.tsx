import {
  defineComponent,
  onMounted,
  ref,
  toRefs,
  watch,
  watchEffect
} from 'vue'
import classnames from 'classnames'
import { BufferBlock, Block } from '@/components/process-bar/block'
import { useDrag } from '@/hooks/index'
import { on, toFixed } from '@/utils/index'
import './index.less'

const prefix = 'progress'

export const ProgressBar = defineComponent({
  name: 'ProgressBar',
  props: {
    canDrage: {
      type: Boolean as () => boolean,
      required: true
    },
    onChange: {
      type: (Function as unknown) as () => (x: number, w: number) => void,
      required: true
    },
    onDraging: {
      type: (Function as unknown) as () => (v: boolean) => void,
      required: true
    },
    automatic: {
      type: String as () => string,
      required: true
    },
    block: {
      type: Array as () => Block[]
    }
  },
  setup(props) {
    const { canDrage, onChange, onDraging, automatic, block } = toRefs(props)

    const container = ref()
    const indicatorContainer = ref()
    const indicator = ref()
    const draging = ref(false)
    const currentIndicator = ref('0%')

    const setIndicatorX = (x: number, w: number) => {
      const width = toFixed((x / w) * 100, 6)
      currentIndicator.value = (width > 100 ? 100 : width) + '%'
    }

    const setAudioCurrent = (indicatorX: number, indicatorW: number) => {
      onChange.value(indicatorX, indicatorW)
    }

    watchEffect(() => {
      currentIndicator.value = automatic.value
    })

    onMounted(() => {
      const {
        x,
        width
      } = (container.value as HTMLElement).getBoundingClientRect()

      const handleClick = (e: MouseEvent) => {
        if (!draging.value) {
          const { clientX } = e
          requestAnimationFrame(() => {
            setIndicatorX(clientX - x, width)
            setAudioCurrent(clientX - x, width)
          })
        }
      }

      const { start } = useDrag(
        indicatorContainer.value as HTMLElement,
        indicator.value as HTMLElement,
        {
          moveCB(x) {
            requestAnimationFrame(() => {
              setIndicatorX(x, width)
            })
          },
          startCB() {
            draging.value = true
            onDraging.value(true)
          },
          stopCB(x) {
            draging.value = false
            onDraging.value(false)
            setAudioCurrent(x, width)
          }
        }
      )

      const unwatch = watch(canDrage, canDrage => {
        if (canDrage) {
          on(container.value as HTMLElement, 'click', handleClick)
          start()
          unwatch()
        }
      })
    })

    return () => (
      <div
        ref={container}
        class={classnames(`${prefix}-command`, {
          [`${prefix}-command-active`]: draging.value
        })}
      >
        <BufferBlock block={block?.value}></BufferBlock>
        <div
          ref={indicatorContainer}
          class={`${prefix}-command--indicator`}
          style={{ width: currentIndicator.value }}
        >
          <div ref={indicator}></div>
        </div>
      </div>
    )
  }
})
