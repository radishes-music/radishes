import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
  RouteRecordRaw
} from 'vue-router'
import { ComponentPublicInstance } from 'vue'
import { hook } from './hook'
import { baseRouter } from './base'
import { contentBaseRouter } from './content'
import { baseNavRouter } from './nav'

import { isBrowser, isElectron } from '@/utils'

export interface Meta {
  name?: string
}

export interface RouterChildren {
  path: string
  comments: ComponentPublicInstance
  name?: string
  meta?: Meta
}

export const LYRICE_PATH = '/electron-lyrice-float'

const renderRouter = (nav: RouteRecordRaw[]) => {
  return nav.filter(n => {
    if (isBrowser()) {
      return n?.meta?.browser
    }
    if (isElectron()) {
      return n?.meta?.electron
    }
    return true
  })
}

export const navRouter = renderRouter(baseNavRouter)
export const contentRouter = renderRouter(contentBaseRouter)

const router = createRouter({
  // history:
  //   isBrowser()
  //     ? createWebHistory(process.env.BASE_URL)
  //     : createWebHashHistory(process.env.BASE_URL),
  history: createWebHashHistory(process.env.BASE_URL),
  routes: baseRouter.concat(navRouter, contentRouter)
})

hook(router)

export default router
