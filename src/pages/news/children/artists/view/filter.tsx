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
      type: j18n.load('src__pages__news__children__artists__view__filter___26'),
      area: j18n.load('src__pages__news__children__artists__view__filter___27'),
      initial: j18n.load(
        'src__pages__news__children__artists__view__filter___28'
      )
    }
    const view: Record<string, { name: string; value: number | string }[]> = {
      area: [
        {
          name: j18n.load(
            'src__pages__news__children__artists__view__filter___32'
          ),
          value: -1
        },
        {
          name: j18n.load(
            'src__pages__news__children__artists__view__filter___33'
          ),
          value: 7
        },
        {
          name: j18n.load(
            'src__pages__news__children__artists__view__filter___34'
          ),
          value: 96
        },
        {
          name: j18n.load(
            'src__pages__news__children__artists__view__filter___35'
          ),
          value: 8
        },
        {
          name: j18n.load(
            'src__pages__news__children__artists__view__filter___36'
          ),
          value: 16
        },
        {
          name: j18n.load(
            'src__pages__news__children__artists__view__filter___37'
          ),
          value: 0
        }
      ],
      type: [
        {
          name: j18n.load(
            'src__pages__news__children__artists__view__filter___40'
          ),
          value: -1
        },
        {
          name: j18n.load(
            'src__pages__news__children__artists__view__filter___41'
          ),
          value: 1
        },
        {
          name: j18n.load(
            'src__pages__news__children__artists__view__filter___42'
          ),
          value: 2
        },
        {
          name: j18n.load(
            'src__pages__news__children__artists__view__filter___43'
          ),
          value: 3
        }
      ],
      initial: [
        {
          name: j18n.load(
            'src__pages__news__children__artists__view__filter___45'
          ),
          value: '-1'
        }
      ].concat(
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
