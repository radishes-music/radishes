import { inject, provide, unref } from 'vue'
import { Modal, notification } from 'ant-design-vue'
import { Message } from 'v-easy-components'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

// const $ROUTER = Symbol()
// const $ROUTE = Symbol()
// const $STORE = Symbol()
const $ERROR = Symbol()
const $INFO = Symbol()
const $SUCCESS = Symbol()
const $WARNING = Symbol()
const $CONFIRM = Symbol()
const $NOTIFICATION = Symbol()
const $DESTROYALL = Symbol()
const $MESSAGE = Symbol()

export const allInject = () => {
  /* vue-router */
  // provide($ROUTER, router)
  // provide($ROUTE, unref(router.currentRoute))
  // /* vuex */
  // provide($STORE, store)
  /* ant-design-vue */
  provide($ERROR, Modal.error)
  provide($INFO, Modal.info)
  provide($SUCCESS, Modal.success)
  provide($WARNING, Modal.warning)
  provide($CONFIRM, Modal.confirm)
  provide($NOTIFICATION, notification)
  provide($DESTROYALL, Modal.destroyAll)
  provide($MESSAGE, Message)
}

export { useStore, useRoute, useRouter }
export const useError = () => inject($ERROR)
export const useInfo = () => inject($ERROR)
export const useSuccess = () => inject($ERROR)
export const useWarning = () => inject($ERROR)
export const useConfirm = () => inject($ERROR)
export const useNotification = () => inject($ERROR)
export const useDestroyAll = () => inject($ERROR)
export const useMessage = () => inject($ERROR)
