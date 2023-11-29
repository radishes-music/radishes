/**
 * Created by buddy on 2021/2/19.
 */
import { computed, defineComponent, reactive } from 'vue'
import { Select } from 'ant-design-vue'
import { range } from 'lodash-es'

const years = range(1920, new Date().getFullYear() + 1)
const months = range(1, 13)
const days = range(1, 32)

export const BirthSelect = defineComponent({
  name: 'BirthSelect',
  // eslint-disable-next-line vue/require-prop-types
  props: ['defaultValue', 'onChange'],
  emits: ['change'],
  setup(props, { emit }) {
    const date = new Date(props.defaultValue)

    const state = reactive({
      year: date.getFullYear() - 1920,
      month: date.getMonth(),
      day: date.getDate() - 1
    })

    const onChange = (y: number, m: number, d: number) => {
      emit('change', new Date(`${years[y]}-${months[m]}-${days[d]}`).getTime())
    }

    const onYearChange = (year: number) => {
      state.year = year
      state.month = 0
      state.day = 0
      onChange(state.year, state.month, state.day)
    }
    const onMonthChange = (month: number) => {
      state.month = month
      state.day = 0
      onChange(state.year, state.month, state.day)
    }
    const onDayChange = (day: number) => {
      state.day = day
      onChange(state.year, state.month, state.day)
    }

    const dayEnd = computed(() => {
      const year = years[state.year]
      const month = months[state.month]

      const big = [1, 3, 5, 7, 8, 10, 12]
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const small = [4, 6, 9, 11]

      const end =
        month === 2
          ? (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
            ? 29
            : 28
          : big.includes(month)
            ? 31
            : 30

      return end
    })

    return () => {
      return (
        <div class="row">
          <Select
            defaultValue={state.year}
            class="user-setting__select"
            onChange={onYearChange}
          >
            {years.map((year: number, index: number) => (
              <Select.Option value={index}>{year}年</Select.Option>
            ))}
          </Select>
          <Select
            defaultValue={state.month}
            class="user-setting__select"
            onChange={onMonthChange}
          >
            {months.map((month: number, index: number) => (
              <Select.Option value={index}>{month}月</Select.Option>
            ))}
          </Select>
          <Select
            defaultValue={state.day}
            class="user-setting__select"
            onChange={onDayChange}
          >
            {days.slice(0, dayEnd.value).map((day: number, index: number) => (
              <Select.Option value={index}>{day}日</Select.Option>
            ))}
          </Select>
        </div>
      )
    }
  }
})

BirthSelect.YEAR = years
BirthSelect.MONTH = months
BirthSelect.DAY = days
