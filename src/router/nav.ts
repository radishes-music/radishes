import { News, SongList, TopList, Artists } from '@/pages/news/index'
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

import Recommend from '@/pages/findmusic/recommend/index.vue'

import {
  PhVinylRecord,
  PhDownload,
  PhSoundcloudLogo,
  PhFileAudio
} from '@phosphor-icons/vue'

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
      name: '发现音乐',
      icon: PhVinylRecord,
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
          name: '个性推荐',
          path: 'recommend',
          canBeCollect: true
        }
      },
      {
        path: 'songlist',
        component: SongList,
        name: 'songlist',
        meta: {
          name: '精品歌单',
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
          name: '排行榜',
          path: 'toplist',
          canBeCollect: true
        }
      },
      {
        path: 'artists',
        component: Artists,
        name: 'artists',
        meta: {
          name: '歌手',
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
      name: '视频',
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
      name: '朋友',
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
      name: '下载管理',
      icon: PhDownload,
      beforeHeader: '我的音乐',
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
          name: '已下载单曲',
          path: 'song',
          canBeCollect: true
        }
      },
      {
        path: 'mv',
        component: DownloadMv,
        meta: {
          name: '已下载MV',
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
      name: '本地音乐',
      icon: PhFileAudio,
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
          name: '歌曲',
          path: 'song',
          canBeCollect: true
        }
      },
      {
        path: 'dir',
        component: LocalMusicDir,
        meta: {
          name: '文件夹',
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
      name: '我的音乐云盘',
      icon: PhSoundcloudLogo,
      auth: true,
      browser: true,
      electron: true,
      canBeCollect: true
    }
  }
]
