import { defineComponent } from 'vue'
import Icon from '@/components-global/icon/main'
import './style.less'

export default defineComponent({
  name: 'XCell',
  props: {
    icon: {
      type: String,
      default: ''
    },
    onClick: {
      type: Function,
      default: () => {
        /*  */
      }
    },
    title: {
      type: String,
      default: ''
    },
    externalLink: {
      type: String,
      default: ''
    },
    needArrow: {
      type: Boolean,
      default: true
    }
  },
  setup($props) {
    const onClick = (e: MouseEvent) => {
      if ($props.externalLink) {
        window.open($props.externalLink)
      } else {
        $props.onClick(e)
      }
    }

    return function (this: any) {
      return (
        <div class="x-cell" onClick={onClick}>
          <div class="x-cell__left">
            {!!this.icon && (
              <Icon icon={this.icon} color="#4c4c4c" size={22}></Icon>
            )}
            {this.title}
          </div>
          <div class="x-cell__right">
            {this.$slots.default?.()}
            {this.needArrow && (
              <div class="x-cell__rightarrow">
                <Icon icon="toRight" color="#afafaf" size={16}></Icon>
              </div>
            )}
          </div>
        </div>
      )
    }
  }
})
