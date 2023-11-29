import { defineComponent } from 'vue'
import { RouterLink, RouteLocationRaw } from 'vue-router'
import './index.less'

const RouterLinkProps = {
  to: {
    type: [String, Object],
    default: ''
  },
  activeClass: String,
  // inactiveClass: String,
  exactActiveClass: String,
  custom: Boolean,
  ariaCurrentValue: {
    type: String,
    default: 'page'
  }
}

export const Link = defineComponent({
  props: {
    ...RouterLinkProps,
    external: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'line'
    },
    onClick: {
      type: Function,
      default: null
    }
  },
  render() {
    const classText = `link-${this.type}`

    const onClick = (e: any) => {
      if (this.onClick) {
        e.preventDefault()
        this.onClick()
      }
    }

    if (this.external) {
      return (
        <a
          href={this.to as string}
          class={classText}
          target="_blank"
          onClick={onClick}
        >
          {this.$slots.default?.()}
        </a>
      )
    }
    return (
      <RouterLink
        to={this.to as RouteLocationRaw}
        class={classText}
        // @ts-ignore
        onClick={onClick}
      >
        {this.$slots.default?.()}
      </RouterLink>
    )
  }
})

export const AuthLink = defineComponent({
  props: {
    onClick: {
      type: Function,
      default: () => {
        /*  */
      }
    },
    icon: String
  },
  setup(props: any, { slots }) {
    return () => (
      <div {...props} class="link-auth" tag="div" onClick={props.onClick}>
        <div class="link-auth__icon">
          <icon icon={props.icon} color="#666" size={22}></icon>
        </div>
        <span>{slots.default?.()}</span>
      </div>
    )
  }
})

AuthLink.props = { ...AuthLink.props, icon: String }
