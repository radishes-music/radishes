import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'
import { RouterChildren } from '@/router/index'
import classnames from 'classnames'
import './index.less'

export const SecondaryBar = defineComponent({
  props: {
    nav: {
      type: Array,
      default: () => []
    },
    onChange: Function
  },
  emits: ['change'],
  render() {
    const nav = (this.$props.nav as unknown) as RouterChildren[]
    const {
      $router: {
        currentRoute: { value }
      }
    } = this
    return (
      <div class="secondary-bar">
        <ul>
          {nav.map(link => (
            <RouterLink
              class={classnames('secondary-bar-link', {
                'secondary-bar-link-active': value.path.includes(link.path)
              })}
              to={link.path}
            >
              {link?.meta?.name}
            </RouterLink>
          ))}
        </ul>
      </div>
    )
  }
})
