import { defineComponent, PropType, reactive } from 'vue'
import classnames from 'classnames'
import './filter.less'

export const Filter = defineComponent({
  name: 'Filter',
  props: {
    onChange: {
      type: Function as PropType<
        (value: Record<string, string | number>) => void
      >,
      required: true
    },
    value: {
      type: Object as PropType<Record<string, string | number>>,
      default: {}
    }
  },
  emits: ['change', 'update:value'],
  setup(props, { emit }) {
    const filter = reactive(props.value)

    // Initialization request
    emit('change', filter)

    const keyMap: Record<string, string> = {
      type: '分类',
      area: '语种',
      initial: '筛选'
    }
    const view: Record<string, { name: string; value: number | string }[]> = {
      area: [
        { name: '全部', value: -1 },
        { name: '华语', value: 7 },
        { name: '欧美', value: 96 },
        { name: '日本', value: 8 },
        { name: '韩国', value: 16 },
        { name: '其他', value: 0 }
      ],
      type: [
        { name: '全部', value: -1 },
        { name: '男歌手', value: 1 },
        { name: '女歌手', value: 2 },
        { name: '乐队', value: 3 }
      ],
      initial: [{ name: '热门', value: '-1' }].concat(
        Array(26)
          .fill(0)
          .map((_, index) => String.fromCharCode(index + 97))
          .map(item => ({ name: item.toLocaleUpperCase(), value: item }))
      )
    }

    const change = (key: string, value: number | string) => {
      filter[key] = value
      emit('update:value', filter)
      emit('change', filter)
    }

    return () => (
      <div class="filter">
        {(Reflect.ownKeys(view) as string[]).map(key => (
          <div class="filter-group">
            <div>{keyMap[key]}：</div>
            <ul>
              {view[key].map(item => (
                <li
                  class={classnames({
                    'filter-active': filter[key] === item.value
                  })}
                  onClick={() => change(key, item.value)}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    )
  }
})
