import { defineComponent } from 'vue'
import { Button } from 'ant-design-vue'
import router from '@/router/index'

export default defineComponent({
  name: 'NoMusic',
  setup() {
    const handleClick = () => {
      router.push({
        path: '/setting/source'
      })
    }

    return () => (
      <span>
        {j18n.load('src__pages__footer__components__no-music___15')}，
        <Button type="link" style="padding: 0" onClick={handleClick}>
          {j18n.load('src__pages__footer__components__no-music___17')}
        </Button>
        {j18n.load('src__pages__footer__components__no-music___19')}。
      </span>
    )
  }
})
