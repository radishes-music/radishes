import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { TestFull } from '@/pages/test/view/index'
import { Recommend } from '@/pages/recommend/view/index'
import { FindMusic } from '@/pages/find-new-music/view/index'

// Internationalization is not currently supported
const baseRouter: Array<RouteRecordRaw> = [
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

export const navRouter: Array<RouteRecordRaw> = [
  {
    path: '/music',
    component: FindMusic,
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
      }
    ]
  },
  {
    path: '/video',
    component: FindMusic,
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
        component: Recommend,
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

export default router
