import { CustomizeRouteRecordRaw } from '@/interface'
import { defineComponent, toRefs, PropType, toRaw } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import './index.less'

const prefix = 'secondary'

export const renderNavList = (
  origin: CustomizeRouteRecordRaw[],
  name: string
): CustomizeRouteRecordRaw[] => {
  const nav = origin.find(item => item.name === name)
  if (nav && nav.children) {
    return (nav.children as CustomizeRouteRecordRaw[]).filter(
      item => item.meta?.name
    )
  }
  return []
}

export const SecondaryBar = defineComponent({
  name: 'SecondaryBar',
  props: {
    nav: {
      type: Object as PropType<CustomizeRouteRecordRaw[]>,
      required: true
    },
    size: {
      type: String as PropType<'small' | 'default'>,
      default: 'default'
    }
  },
  setup(props) {
    const { nav, size } = toRefs(props)
    const route = useRoute()

    const renderPath = (url: string) => {
      if (typeof url === 'string') {
        return {
          path: url,
          query: toRaw(route.query)
        }
      }
      return url
    }

    return () => (
      <div class={`${prefix}-bar mx-4`}>
        <ul>
          {nav.value?.map(link => (
            <RouterLink
              class={`${prefix}-bar-link ${prefix}-bar-link--${size.value}`}
              activeClass={`${prefix}-bar-link-active ${prefix}-bar-link-active--${size.value}`}
              to={renderPath(link.meta?.path)}
            >
              {link.meta?.name}
            </RouterLink>
          ))}
        </ul>
      </div>
    )
  }
})
