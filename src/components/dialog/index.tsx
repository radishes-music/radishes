import { defineComponent, createApp, VNodeTypes } from 'vue'
import { Modal } from 'ant-design-vue'
import { create } from '@/utils/index'

interface Config {
  centered: boolean
}

export const Dialog = defineComponent({
  name: 'Dialog',
  setup(props, { slots }) {
    return () => <Modal {...props}>{slots.default && slots.default()}</Modal>
  }
})

export const instance = function (content: VNodeTypes, config: Config) {
  const app = createApp({
    setup() {
      return () => <Dialog {...config}>{content}</Dialog>
    }
  })
  create(app)
}
