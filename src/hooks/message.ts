import { message } from 'ant-design-vue'
import { VNodeTypes } from 'vue'

export interface MessageConfig {
  key: string | number
}

message.config({
  duration: 2
})
const messageMap = new Map()

export const suggested = (msg: VNodeTypes, config: MessageConfig) => {
  const loading = messageMap.get(config.key)
  if (loading) {
    return loading
  }
  const insMessage = message.loading({
    key: config.key,
    content: msg,
    duration: 0
  })
  messageMap.set(config.key, insMessage)
  return insMessage
}

export const success = (msg: VNodeTypes, config: MessageConfig) => {
  return message.success({
    key: config.key,
    content: msg
  })
}

export const warning = (msg: VNodeTypes, config: MessageConfig) => {
  return message.warning({
    key: config.key,
    content: msg
  })
}

export const error = (msg: VNodeTypes, config: MessageConfig) => {
  return message.error({
    key: config.key,
    content: msg
  })
}
