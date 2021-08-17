import { News, Recommend, SongList, TopList, Artists } from '@/pages/news/index'
// Use this method when you need to load dynamically
// const video = () => import(/* webpackChunkName: "video" */ '@/pages/video/index')
import { Video, Mv } from '@/pages/video/index'
import Profile from '@/pages/userinfo/views'
import { Moments } from '@/pages/moments/index'
import { LocalMusic, LocalMusicSong, LocalMusicDir } from '@/pages/music/index'
import { Download, DownloadSong, DownloadMv } from '@/pages/download/index'
import { Cloud } from '@/pages/cloud/index'
import { FollowView } from '@/pages/userinfo/views/follow-view'
import { EventView } from '@/pages/userinfo/views/event-view'
import { FansView } from '@/pages/userinfo/views/fans-view'
import { UserSetting } from '@/pages/userinfo/views/user-setting'
import { CustomizeRouteRecordRaw } from '@/interface'

export const baseNavRouter: CustomizeRouteRecordRaw[] = [
  {
    path: '/userinfo/:uid',
    component: Profile,
    name: Profile.name,
    meta: {
      auth: true,
      nonav: true,
      browser: true,
      electron: true
    }
  },
  {
    path: '/followList/:uid',
    component: FollowView,
    name: FollowView.name,
    meta: {
      auth: true,
      nonav: true,
      browser: true,
      electron: true,
      canBeCollect: true
    }
  },
  {
    path: '/eventView/:uid',
    component: EventView,
    name: EventView.name,
    meta: {
      auth: true,
      nonav: true,
      browser: true,
      electron: true,
      canBeCollect: true
    }
  },
  {
    path: '/fansView/:uid',
    component: FansView,
    name: FansView.name,
    meta: {
      auth: true,
      nonav: true,
      browser: true,
      electron: true,
      canBeCollect: true
    }
  },
  {
    path: '/userSetting',
    component: UserSetting,
    name: UserSetting.name,
    meta: {
      auth: true,
      nonav: true,
      browser: true,
      electron: true,
      canBeCollect: true
    }
  },
  {
    path: '/music',
    component: News,
    name: News.name,
    meta: {
      name: $t('src__router__nav___80'),
      browser: true,
      electron: true
    },
    children: [
      {
        path: '',
        redirect: '/music/recommend'
      },
      {
        path: 'recommend',
        component: Recommend,
        name: 'recommend',
        meta: {
          name: $t('src__router__nav___94'),
          path: 'recommend',
          canBeCollect: true
        }
      },
      {
        path: 'songlist',
        component: SongList,
        name: 'songlist',
        meta: {
          name: $t('src__router__nav___104'),
          path: {
            name: 'songlist',
            query: {
              tag: 'all'
            }
          },
          canBeCollect: true
        }
      },
      {
        path: 'toplist',
        component: TopList,
        name: 'toplist',
        meta: {
          name: $t('src__router__nav___119'),
          path: 'toplist',
          canBeCollect: true
        }
      },
      {
        path: 'artists',
        component: Artists,
        name: 'artists',
        meta: {
          name: $t('src__router__nav___129'),
          path: 'artists',
          canBeCollect: true
        }
      }
    ]
  },
  {
    path: '/video',
    component: Video,
    meta: {
      name: $t('src__router__nav___140'),
      browser: false,
      electron: false
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
          name: 'MV',
          canBeCollect: true
        }
      }
    ]
  },
  {
    path: '/moments',
    component: Moments,
    meta: {
      name: $t('src__router__nav___163'),
      browser: false,
      electron: false,
      canBeCollect: true
    }
  },
  {
    path: '/download',
    component: Download,
    name: Download.name,
    meta: {
      name: $t('src__router__nav___174'),
      beforeHeader: $t('src__router__nav___175'),
      browser: true,
      electron: true
    },
    children: [
      {
        path: '',
        redirect: '/download/song'
      },
      {
        path: 'song',
        component: DownloadSong,
        meta: {
          name: $t('src__router__nav___188'),
          path: 'song',
          canBeCollect: true
        }
      },
      {
        path: 'mv',
        component: DownloadMv,
        meta: {
          name: $t('src__router__nav___197'),
          path: 'mv',
          canBeCollect: true
        }
      }
    ]
  },
  {
    path: '/local-music',
    component: LocalMusic,
    name: LocalMusic.name,
    meta: {
      name: $t('src__router__nav___209'),
      browser: false,
      electron: true
    },
    children: [
      {
        path: '',
        redirect: '/local-music/song'
      },
      {
        path: 'song',
        component: LocalMusicSong,
        meta: {
          name: $t('src__router__nav___222'),
          path: 'song',
          canBeCollect: true
        }
      },
      {
        path: 'dir',
        component: LocalMusicDir,
        meta: {
          name: $t('src__router__nav___231'),
          path: 'dir',
          canBeCollect: true
        }
      }
    ]
  },
  {
    path: '/cloud',
    component: Cloud,
    name: Cloud.name,
    meta: {
      name: $t('src__router__nav___243'),
      auth: true,
      browser: true,
      electron: true,
      canBeCollect: true
    }
  }
]
