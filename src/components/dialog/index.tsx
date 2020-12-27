import { defineComponent } from 'vue'
import { Modal } from 'ant-design-vue'

export const Dialog = defineComponent({
  name: 'Dialog',
  setup() {
    return () => <Modal centered={true}></Modal>
  }
})
