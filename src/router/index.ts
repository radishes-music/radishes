import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
  RouteRecordRaw
} from 'vue-router'
import { ComponentPublicInstance } from 'vue'
import { hook } from './hook'
import { $404 } from '@/pages/404/view/index'
import { News, Recommend, SongList, TopList, Artists } from '@/pages/news/index'
// Use this method when you need to load dynamically
// const video = () => import(/* webpackChunkName: "video" */ '@/pages/video/index')
import { Video, Mv } from '@/pages/video/index'
import { Profile } from '@/pages/auth/views/profile'
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

export const contentRouter: RouteRecordRaw[] = [
  {
    path: '/list/:type/:playlist',
    component: () => import('@/pages/list/view/index')
  },
  {
    path: '/artist/:id',
    component: () =>
      import(/* webpackChunkName: "artist" */ '@/pages/artist/view/index'),
    name: 'Artist',
    beforeEnter: (to, from, next) => {
      if (to.params.id) {
        next()
      } else {
        next({
          path: '/'
        })
      }
    },
    children: [
      {
        path: 'album',
        component: () =>
          import(/* webpackChunkName: "artist" */ '@/pages/artist/index').then(
            component => component.Albume
          ),
        meta: {
          name: '专辑'
        }
      },
      {
        path: 'mv',
        component: () =>
          import(/* webpackChunkName: "artist" */ '@/pages/artist/index').then(
            component => component.Mv
          ),
        meta: {
          name: 'MV'
        }
      },
      {
        path: 'detail',
        component: () =>
          import(/* webpackChunkName: "artist" */ '@/pages/artist/index').then(
            component => component.Desc
          ),
        meta: {
          name: '歌手详情'
        }
      },
      {
        path: 'similar',
        component: () =>
          import(/* webpackChunkName: "artist" */ '@/pages/artist/index').then(
            component => component.Similar
          ),
        meta: {
          name: '相似歌手'
        }
      }
    ]
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
    component: News,
    name: News.name,
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
          name: '精品歌单',
          path: {
            name: 'songlist',
            query: {
              tag: 'all'
            }
          }
        }
      },
      {
        path: '/music/toplist',
        component: TopList,
        name: 'toplist',
        meta: {
          name: '排行榜',
          path: '/music/toplist'
        }
      },
      {
        path: '/music/artists',
        component: Artists,
        name: 'artists',
        meta: {
          name: '歌手',
          path: '/music/artists'
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
