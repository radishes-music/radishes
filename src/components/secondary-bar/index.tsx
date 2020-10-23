import { defineComponent, toRefs } from 'vue'
import { RouterLink, RouteRecordRaw } from 'vue-router'
import './index.less'

const prefix = 'secondary'

interface Props {
  nav: RouteRecordRaw[]
  onChange: (route: RouteRecordRaw) => void
}

export const SecondaryBar = defineComponent({
  name: 'SecondaryBar',
  props: {
    nav: {
      type: Object as () => RouteRecordRaw[],
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
              to={link.path}
            >
              {link.meta?.name}
            </RouterLink>
          ))}
        </ul>
      </div>
    )
  }
})
