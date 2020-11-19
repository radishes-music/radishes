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
import { Profile } from './../pages/auth/views/Profile'
import { ENV } from '@/interface/app'
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

export const LYRICE_PATH = '/electron-lyrice-flash'

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
        meta: {
          name: '个性推荐'
        }
      },
      {
        path: '/music/songlist',
        component: SongList,
        meta: {
          name: '歌单'
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
    path: '/friend',
    component: FindMusic,
    meta: {
      name: '朋友'
    },
    children: [
      {
        path: '',
        redirect: '/friend/dynamic'
      },
      {
        path: '/friend/dynamic',
        component: Recommend,
        meta: {
          name: '动态'
        }
      }
    ]
  },
  {
    path: '/local-music',
    component: FindMusic,
    meta: {
      name: '本地音乐',
      beforeHeader: '我的音乐'
    },
    children: [
      {
        path: '',
        redirect: '/local-music/song'
      },
      {
        path: '/local-music/song',
        component: Recommend,
        meta: {
          name: '歌曲'
        }
      },
      {
        path: '/local-music/singer',
        component: Recommend,
        meta: {
          name: '歌手'
        }
      }
    ]
  },
  {
    path: '/download-manage',
    component: FindMusic,
    meta: {
      name: '下载管理'
    },
    children: [
      {
        path: '',
        redirect: '/download-manage/single'
      },
      {
        path: '/download-manage/single',
        component: Recommend,
        meta: {
          name: '已下载单曲'
        }
      },
      {
        path: '/download-manage/mv',
        component: Recommend,
        meta: {
          name: '已下载MV'
        }
      }
    ]
  }
]

const router = createRouter({
  history:
    VUE_APP_PLATFORM === Platform.BROWSER
      ? createWebHistory(process.env.BASE_URL)
      : createWebHashHistory(process.env.BASE_URL),
  routes: baseRouter.concat(navRouter)
})

hook(router)

export default router
