import { defineComponent, PropType, inject, ref } from 'vue'
import { Skeleton } from 'ant-design-vue'
import './secondary.less'

export const SecondaryLayout = defineComponent({
  name: 'Secondary',
  props: {
    src: {
      type: String as PropType<string>,
      default: ''
    }
  },
  setup(props, { slots }) {
    const loading = inject('loading', ref(false))

    return () => (
      <div class="secondary">
        <Skeleton
          active
          title={false}
          avatar={{
            shape: 'square',
            size: 'large'
          }}
          paragraph={{
            rows: 5,
            width: [500, 200, 300, 100, 300]
          }}
          loading={loading.value}
        >
          <div class="secondary-head">{slots.head && slots.head()}</div>
        </Skeleton>
        <Skeleton
          active
          title={false}
          paragraph={{
            rows: 10,
            width: '100%'
          }}
          loading={loading.value}
        >
          <div class="secondary-body">{slots.body && slots.body()}</div>
        </Skeleton>
      </div>
    )
  }
})
