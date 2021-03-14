import { RouteRecordRaw } from 'vue-router'

export type RouteMeta = Partial<{
  name: string
  auth: boolean
  nonav: boolean
  browser: boolean
  electron: boolean
  canBeCollect: boolean
}>

export type ChildrenRouteMeta = Partial<{
  name: string
  path:
    | string
    | {
        name: string
        query: {
          [x: string]: unknown
        }
      }
}>

export type CustomizeChildrenRouteRecordRaw = RouteRecordRaw & {
  meta?: ChildrenRouteMeta
}

export type CustomizeRouteRecordRaw = RouteRecordRaw & {
  meta?: RouteMeta
  children?: CustomizeChildrenRouteRecordRaw[]
}
