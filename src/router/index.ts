import {
  createRouter,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createWebHistory,
  createWebHashHistory
} from 'vue-router'
import { hook } from './hook'
import { baseRouter } from './base'
import { contentBaseRouter } from './content'
import { baseNavRouter } from './nav'

import { isBrowser, isElectron } from '@/utils'
import { CustomizeRouteRecordRaw } from '@/interface'

export const LYRICS_PATH = '/electron-lyrics-float'

const renderRouter = (nav: CustomizeRouteRecordRaw[]) => {
  return nav.filter(n => {
    if (isBrowser) {
      return n?.meta?.browser
    }
    if (isElectron) {
      return n?.meta?.electron
    }
    return true
  })
}

export const navRouter = renderRouter(baseNavRouter)
export const contentRouter = renderRouter(contentBaseRouter)

const router = createRouter({
  history: isBrowser
    ? createWebHistory(import.meta.env.BASE_URL)
    : createWebHashHistory(import.meta.env.BASE_URL),
  routes: baseRouter.concat(navRouter, contentRouter)
})

hook(router)

export default router
