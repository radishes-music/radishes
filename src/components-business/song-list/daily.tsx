import { defineComponent, PropType } from 'vue'
import { Image } from '@/components/image'
import dayjs from 'dayjs'
import './daily.less'

const prefix = 'daily'

export const DailyCard = defineComponent({
  name: 'DailyCard',
  props: {
    src: {
      type: String as PropType<string>,
      default: ''
    },
    name: {
      type: String as PropType<string>,
      default: ''
    }
  },
  setup(props) {
    return () => (
      <>
        {props.src ? (
          <Image
            class=" transition-all duration-[300ms] ease-linear hover:scale-110"
            name={props.name || 'daily-img'}
            src={props.src}
          />
        ) : (
          <div class={`${prefix}-img ${props.name}`}>
            <div class={`${prefix}-img-date`}>
              <icon icon="rili" size={78}></icon>
              <div>{dayjs().date()}</div>
            </div>
          </div>
        )}
      </>
    )
  }
})
