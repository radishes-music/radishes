import { computed, defineComponent, PropType } from 'vue'
import './index.less'

export const Schedule = defineComponent({
  name: 'Schedule',
  props: {
    percentage: {
      type: Number as PropType<number>,
      default: 0
    }
  },
  setup(props, { slots }) {
    const opacity = computed(() => (props.percentage >= 100 ? 0 : 1))

    return () => (
      <div class="schedule">
        <div class="schedule-percentage">
          <div
            style={{
              opacity: opacity.value,
              width: props.percentage + '%'
            }}
          ></div>
        </div>
        {slots.default && slots.default()}
      </div>
    )
  }
})
