/**
 * Created by buddy on 2021/2/25.
 */
import { defineComponent } from 'vue'
import Icon from '@/components-global/icon/main'
import './index.less'

export const UserTag = defineComponent({
  name: 'UserTag',
  props: ['info'],
  setup(props) {
    return () => {
      const { type, desc, tags } = props.info

      if (type >= 400) {
        return null
      }

      return (
        <div class={`user-tag type${type < 200 ? 1 : type < 300 ? 2 : 3}`}>
          {[desc, ...(tags || [])].join('、')}
        </div>
      )
    }
  }
})

// TODO 操作行为处理...
export const SexTag = defineComponent({
  name: 'SexTag',
  props: {
    sex: {
      type: Number,
      default: 0
    }
  },
  setup(props: any) {
    return function () {
      if (![1, 2].includes(props.sex)) {
        return null
      }
      return (
        <div class={`user-tag__sex gender${props.sex}`}>
          <Icon
            icon={['', 'xingbie', 'xingbie-nv'][props.sex]}
            color="auto"
          ></Icon>
        </div>
      )
    }
  }
})

export const LevelTag = defineComponent({
  name: '',
  props: ['level'],
  setup(props: any) {
    return function () {
      return <div class="user-tag user-tag__level">Lv{props.level}</div>
    }
  }
})
