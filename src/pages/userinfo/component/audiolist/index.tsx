/**
 * Created by buddy on 2021/2/26.
 */
import { defineComponent } from 'vue'
import { ListHeader, ListWrapper, RadioItem } from '@/components/widgets'

export const AudioList = defineComponent({
  name: 'AudioList',
  props: ['title', 'audio'],
  setup(props) {
    return function () {
      const { audio, title }: any = props

      if (audio.length === 0) {
        return null
      }

      return (
        <div>
          <ListHeader title={title} count={audio.length}></ListHeader>
          <ListWrapper>
            {audio.map((info: any, index: number) => (
              <RadioItem info={info} key={index}></RadioItem>
            ))}
          </ListWrapper>
        </div>
      )
    }
  }
})
