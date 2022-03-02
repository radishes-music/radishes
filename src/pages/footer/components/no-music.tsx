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
        未找到歌曲的播放链接，
        <Button type="link" style="padding: 0" onClick={handleClick}>
          点我
        </Button>
        添加播放源试试。
      </span>
    )
  }
})
