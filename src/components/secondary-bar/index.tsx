import { defineComponent, toRefs, PropType } from 'vue'
import { RouterLink, RouteRecordRaw } from 'vue-router'
import './index.less'

const prefix = 'secondary'

export const renderNavList = (origin: RouteRecordRaw[], name: string) => {
  const nav = origin.find(item => item.name === name)
  if (nav && nav.children) {
    return nav.children.filter(item => item.meta?.name)
  }
  return []
}

export const SecondaryBar = defineComponent({
  name: 'SecondaryBar',
  props: {
    nav: {
      type: Object as PropType<RouteRecordRaw[]>,
      required: true
    },
    size: {
      type: String as PropType<'small' | 'default'>,
      default: 'default'
    }
  },
  setup(props) {
    const { nav, size } = toRefs(props)

    return () => (
      <div class={`${prefix}-bar`}>
        <ul>
          {nav.value?.map(link => (
            <RouterLink
              class={`${prefix}-bar-link`}
              activeClass={`${prefix}-bar-link-active ${prefix}-bar-link-active--${size.value}`}
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
