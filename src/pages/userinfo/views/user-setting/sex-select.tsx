/**
 * Created by buddy on 2021/2/19.
 */
import { defineComponent, reactive, watch } from 'vue'
import { Radio } from 'ant-design-vue'
import { noop } from '@/utils'

export const SexSelect = defineComponent({
  name: 'SexSelect',
  props: {
    value: {
      type: Number,
      default: 0
    },
    onChange: {
      type: Function,
      default: noop
    }
  },
  emits: ['change'],
  setup(props, { emit }) {
    const state = reactive({
      value: props.value
    })

    watch(
      () => props.value,
      v => {
        state.value = v
      }
    )

    return () => {
      return (
        <Radio.Group
          value={state.value}
          onChange={(e: any) => {
            state.value = e.target.value
            emit('change', state.value)
          }}
        >
          {['保密', '男', '女'].map((text: string, index: number) => (
            <Radio value={index}>{text}</Radio>
          ))}
        </Radio.Group>
      )
    }
  }
})
