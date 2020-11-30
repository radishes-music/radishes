import { defineComponent, toRefs, PropType } from 'vue'
import { RouterLink, RouteRecordRaw } from 'vue-router'
import './index.less'

const prefix = 'secondary'

export const SecondaryBar = defineComponent({
  name: 'SecondaryBar',
  props: {
    nav: {
      type: Object as PropType<RouteRecordRaw[]>,
      required: true
    }
  },
  setup(props) {
    const { nav } = toRefs(props)

    return () => (
      <div class={`${prefix}-bar`}>
        <ul>
          {nav.value?.map(link => (
            <RouterLink
              class={`${prefix}-bar-link`}
              activeClass={`${prefix}-bar-link-active`}
              to={link.meta?.path}
            >
              {link.meta?.name}
            </RouterLink>
          ))}
        </ul>
      </div>
    )
  }
})
