import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
  RouteRecordRaw
} from 'vue-router'
import { ComponentPublicInstance } from 'vue'
import { hook } from './hook'
import { $404 } from '@/pages/404/view/index'
import { FindMusic, Recommend, SongList } from '@/pages/news/index'
import { Video, Mv } from '@/pages/video/index'
import { Profile } from './../pages/auth/views/profile'
import { Moments } from '@/pages/moments/index'
import { LocalMusic } from '@/pages/music/index'
import { Download } from '@/pages/download/index'
import { Cloud } from '@/pages/cloud/index'
import { Platform } from '@/config/build'

const { VUE_APP_PLATFORM } = process.env

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

// Internationalization is not currently supported
const baseRouter: RouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)', // https://next.router.vuejs.org/guide/migration/#removed-star-or-catch-all-routes
    name: $404.name,
    meta: {
      full: true
    },
    component: $404
  },
  {
    path: '/',
    redirect: '/music'
  }
]

const contentRouter: RouteRecordRaw[] = [
  {
    path: '/song-list/:playlist',
    component: () => import('@/pages/song/view/index')
  }
]

export const navRouter: RouteRecordRaw[] = [
  {
    path: '/profile',
    component: Profile,
    name: Profile.name,
    meta: {
      auth: true,
      nonav: true
    }
  },
  {
    path: '/music',
    component: FindMusic,
    name: FindMusic.name,
    meta: {
      name: '发现音乐'
    },
    children: [
      {
        path: '',
        redirect: '/music/recommend'
      },
      {
        path: '/music/recommend',
        component: Recommend,
        name: 'recommend',
        meta: {
          name: '个性推荐',
          path: '/music/recommend'
        }
      },
      {
        path: '/music/songlist',
        component: SongList,
        name: 'songlist',
        meta: {
          name: '歌单',
          path: {
            name: 'songlist',
            query: {
              tag: 'all'
            }
          }
        }
      }
    ]
  },
  {
    path: '/video',
    component: Video,
    meta: {
      name: '视频'
    },
    children: [
      {
        path: '',
        redirect: '/video/mv'
      },
      {
        path: '/video/mv',
        component: Mv,
        meta: {
          name: 'MV'
        }
      }
    ]
  },
  {
    path: '/moments',
    component: Moments,
    meta: {
      name: '朋友'
    }
  },
  {
    path: '/local-music',
    component: LocalMusic,
    meta: {
      name: '本地音乐',
      beforeHeader: '我的音乐'
    }
  },
  {
    path: '/download-manage',
    component: Download,
    meta: {
      name: '下载管理'
    }
  },
  {
    path: '/cloud',
    component: Cloud,
    meta: {
      name: '我的音乐云盘',
      auth: true
    }
  }
]

const router = createRouter({
  history:
    VUE_APP_PLATFORM === Platform.BROWSER
      ? createWebHistory(process.env.BASE_URL)
      : createWebHashHistory(process.env.BASE_URL),
  routes: baseRouter.concat(navRouter, contentRouter)
})

hook(router)

export default router
