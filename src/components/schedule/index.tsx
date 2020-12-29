import { ref, defineComponent, PropType, watchEffect } from 'vue'
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
    const opacity = ref(0)

    watchEffect(() => {
      if (props.percentage >= 100) {
        setTimeout(() => {
          opacity.value = 0
        }, 2000)
      } else {
        opacity.value = 1
      }
    })

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
