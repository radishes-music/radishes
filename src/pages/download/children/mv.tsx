import { defineComponent } from 'vue'

export const DownloadMv = defineComponent({
  name: 'DownloadMv',
  setup() {
    return () => (
      <div>{j18n.load('src__pages__download__children__mv___5')}</div>
    )
  }
})
