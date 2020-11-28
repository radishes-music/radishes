import { defineComponent, PropType, toRefs, ref } from 'vue'
import { SongInteface } from '@/interface/index'
import { Table as ATable } from 'ant-design-vue'
import { noop } from '@/utils/index'
import './index.less'

const prefix = 'table'

export const Table = defineComponent({
  name: 'Table',
  props: {
    list: {
      type: Array as PropType<unknown[]>,
      required: true
    },
    columns: {
      type: Array as PropType<{}[]>,
      required: true
    },
    showHeader: {
      type: Boolean as PropType<boolean>,
      default: true
    },
    onDblClick: {
      type: Function as PropType<(item: SongInteface.Tracks) => void>,
      default: noop
    }
  },
  setup(props) {
    const { list, columns, onDblClick, showHeader } = toRefs(props)

    return () => (
      <div class={`${prefix}`}>
        <div class={`${prefix}-header`}></div>
        <div class={`${prefix}-body`}>
          <ATable
            rowKey="id"
            rowClassName={() => 'row-music'}
            pagination={false}
            showHeader={showHeader.value}
            columns={columns.value}
            dataSource={list.value}
            customRow={record => {
              // There is a problem with the ant design vue document, please refer to the link below
              // https://v3.vuejs.org/guide/migration/render-function-api.html#_3-x-syntax-3
              // https://github.com/vueComponent/ant-design-vue/blob/28aeea6f0b142ed68950a3738f7cf2c1581a7a5b/components/table/Table.tsx#L465
              return {
                onClick: (e: Event) => {
                  e.preventDefault()
                },
                onDblclick: (e: Event) => {
                  e.preventDefault()
                  if (onDblClick) {
                    onDblClick.value(record)
                  }
                }
              }
            }}
          />
        </div>
        {/* <div class={`${prefix}-pagination`}>
          <Pagination
            v-model={[current.value, 'current']}
            total={list.value.length}
          />
        </div> */}
      </div>
    )
  }
})
