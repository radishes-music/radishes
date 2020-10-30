export * from './hook'
import { inject, provide } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Modal, notification } from 'ant-design-vue'
import { Notification } from 'ant-design-vue/types/notification'
import { ModalConfirm, ModalOptions } from 'ant-design-vue/types/modal'
import { Message } from 'v-easy-components'
import { VeMessage } from 'v-easy-components/types/message'

const $ERROR = Symbol()
const $INFO = Symbol()
const $SUCCESS = Symbol()
const $WARNING = Symbol()
const $CONFIRM = Symbol()
const $NOTIFICATION = Symbol()
const $DESTROYALL = Symbol()
const $MESSAGE = Symbol()

export const allInject = () => {
  provide($ERROR, Modal.error)
  provide($INFO, Modal.info)
  provide($SUCCESS, Modal.success)
  provide($WARNING, Modal.warning)
  provide($CONFIRM, Modal.confirm)
  provide($NOTIFICATION, notification)
  provide($DESTROYALL, Modal.destroyAll)
  provide($MESSAGE, Message)
}

type ModalCall = (options: ModalOptions) => ModalConfirm

export { useStore, useRoute, useRouter }
export const useError = () => inject($ERROR) as ModalCall
export const useInfo = () => inject($INFO) as ModalCall
export const useSuccess = () => inject($SUCCESS) as ModalCall
export const useWarning = () => inject($WARNING) as ModalCall
export const useConfirm = () => inject($CONFIRM) as ModalCall
export const useNotification = () => inject($NOTIFICATION) as Notification
export const useDestroyAll = () => inject($DESTROYALL) as () => void
export const useMessage = () => inject($MESSAGE) as VeMessage
