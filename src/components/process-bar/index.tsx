import {
  defineComponent,
  onMounted,
  ref,
  toRefs,
  VNode,
  watch,
  PropType
} from 'vue'
import classnames from 'classnames'
import { BufferBlock, Block } from '@/components/process-bar/block'
import { useDrag } from '@/hooks/index'
import { on, toFixed, noop } from '@/utils/index'
import { Tooltip } from 'ant-design-vue'
import './index.less'

const prefix = 'progress'

interface Slots {
  prefix?: () => VNode
  suffix?: () => VNode
}

export const ProgressBar = defineComponent({
  name: 'ProgressBar',
  props: {
    canDrage: {
      type: Boolean as PropType<boolean>,
      required: true
    },
    showTooltip: {
      type: Boolean as PropType<boolean>,
      default: true
    },
    current: {
      type: Number as PropType<number>,
      default: 0
    },
    draging: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    block: {
      type: Array as PropType<Block[]>,
      default: []
    },
    onChange: {
      type: Function as PropType<(x: number, w: number) => void>,
      default: noop
    },
    onCurrent: {
      type: Function as PropType<(v: number) => void>,
      default: noop
    }
  },
  emits: ['update:draging'],
  setup(props, context) {
    const {
      canDrage,
      onChange,
      draging,
      block,
      current,
      onCurrent,
      showTooltip
    } = toRefs(props)

    const container = ref()
    const indicatorContainer = ref()
    const indicator = ref()
    const visibleTip = ref(false)

    const setIndicatorX = (x: number, w: number) => {
      if (onCurrent?.value) {
        const width = toFixed((x / w) * 100, 6)
        if (width) {
          const format = width > 100 ? 100 : width < 0 ? 0 : width
          onCurrent.value(format)
        }
      }
    }

    const setAudioCurrent = (indicatorX: number, indicatorW: number) => {
      if (onChange?.value) {
        onChange.value(indicatorX, indicatorW)
      }
    }

    onMounted(() => {
      const { width } = (container.value as HTMLElement).getBoundingClientRect()

      const handleClick = (e: MouseEvent) => {
        if (!draging?.value) {
          const { x } = (container.value as HTMLElement).getBoundingClientRect()
          const { clientX } = e
          requestAnimationFrame(() => {
            setIndicatorX(clientX - x, width)
            setAudioCurrent(clientX - x, width)
          })
        }
      }

      const { start, stop } = useDrag(
        indicatorContainer.value as HTMLElement,
        indicator.value as HTMLElement,
        {
          moveCB(x) {
            requestAnimationFrame(() => {
              setIndicatorX(x, width)
            })
          },
          startCB() {
            visibleTip.value = true
            context.emit('update:draging', true)
          },
          stopCB(x) {
            visibleTip.value = false
            context.emit('update:draging', false)
            setAudioCurrent(x, width)
          },
          horizontal: true
        }
      )

      watch(
        canDrage,
        canDrage => {
          if (canDrage) {
            on(indicator.value as HTMLElement, 'click', e =>
              e.stopPropagation()
            )
            on(container.value as HTMLElement, 'click', handleClick)
            start()
          } else {
            stop()
          }
        },
        { immediate: true }
      )
    })

    const slot = context.slots as Slots

    return () => (
      <div class={prefix}>
        {slot.prefix ? slot.prefix() : ''}
        <div
          ref={container}
          class={classnames(`${prefix}-command`, {
            [`${prefix}-command-active`]: draging?.value
          })}
        >
          <BufferBlock block={block?.value}></BufferBlock>
          <div
            ref={indicatorContainer}
            class={`${prefix}-command--indicator`}
            style={{ width: current.value + '%' }}
          >
            {showTooltip.value ? (
              <Tooltip
                v-model={[visibleTip.value, 'visible']}
                trigger="focus"
                v-slots={{
                  title: () => (
                    <div class={`${prefix}-tip`}>{current.value | 0}</div>
                  ),
                  default: () => <button ref={indicator}></button>
                }}
              ></Tooltip>
            ) : (
              <button ref={indicator}></button>
            )}
          </div>
        </div>
        {slot.suffix ? slot.suffix() : ''}
      </div>
    )
  }
})
