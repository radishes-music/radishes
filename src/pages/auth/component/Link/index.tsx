import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'
import './index.less'

export const Link = defineComponent({
  props: {
    onClick: {
      type: Function,
      default: () => {
        /*  */
      }
    }
  },
  setup() {
    return function(this: any) {
      return (
        <div onClick={this.onClick} class="link-line">
          {this.$slots.default?.()}
        </div>
      )
    }
  }
})

// TODO 突然觉得这么写毫无意义，返回的就是一个纯粹的render 函数...，它依旧可以绑定上下文
export const LightLink = defineComponent({
  setup(props: any) {
    return function(this: any) {
      return (
        <RouterLink {...props} class="link-light">
          {this.$slots.default()}
        </RouterLink>
      )
    }
  }
})

export const ExternalLightLink = defineComponent({
  props: {
    to: String
  },
  setup(props) {
    return function(this: any) {
      return (
        <a href={this.to} class="link-light" target="_blank">
          {this.$slots.default()}
        </a>
      )
    }
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
;[LightLink, AuthLink].forEach(component => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  component.props = { ...RouterLink.props, type: String }
})
AuthLink.props = { ...AuthLink.props, icon: String }
