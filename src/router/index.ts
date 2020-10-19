import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { ComponentPublicInstance } from 'vue'
import { hook } from './hook'
import { TestFull } from '@/pages/test/view/index'
import { FindMusic, Recommend, SongList } from '@/pages/find-new-music/index'
import { Video, Mv } from '@/pages/video/index'

export interface Meta {
  name?: string
}

export interface RouterChildren {
  path: string
  comments: ComponentPublicInstance
  name?: string
  meta?: Meta
}

// Internationalization is not currently supported
const baseRouter: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/music'
  },
  {
    path: '/test',
    component: TestFull,
    meta: {
      full: true
    }
  },
  {
    path: '/403',
    component: TestFull
  }
]

export const navRouter: RouteRecordRaw[] = [
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
    name: Video.name,
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
  history: createWebHistory(process.env.BASE_URL),
  routes: baseRouter.concat(navRouter)
})

hook(router)

export default router
