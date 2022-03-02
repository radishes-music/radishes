import { CustomizeRouteRecordRaw } from '@/interface'

const List = () => import('@/pages/list/view/index')

const Artist = () =>
  import(/* webpackChunkName: "artist" */ '@/pages/artist/view/index')

const ArtistAlbume = () =>
  import(/* webpackChunkName: "artist" */ '@/pages/artist/index').then(
    component => component.Albume
  )

const ArtistMv = () =>
  import(/* webpackChunkName: "artist" */ '@/pages/artist/index').then(
    component => component.Mv
  )

const ArtistDesc = () =>
  import(/* webpackChunkName: "artist" */ '@/pages/artist/index').then(
    component => component.Desc
  )

const ArtistSimilar = () =>
  import(/* webpackChunkName: "artist" */ '@/pages/artist/index').then(
    component => component.Similar
  )

const Setting = () =>
  import(/* webpackChunkName: "setting" */ '@/pages/setting/index').then(
    component => component.Setting
  )

const Search = () =>
  import(/* webpackChunkName: "search" */ '@/pages/search/index').then(
    component => component.Search
  )

const SearchSong = () =>
  import(/* webpackChunkName: "search" */ '@/pages/search/index').then(
    component => component.SearchSong
  )

const SearchArtist = () =>
  import(/* webpackChunkName: "search" */ '@/pages/search/index').then(
    component => component.SearchArtist
  )

const SearchAlbum = () =>
  import(/* webpackChunkName: "search" */ '@/pages/search/index').then(
    component => component.SearchAlbum
  )

const SearchSongList = () =>
  import(/* webpackChunkName: "search" */ '@/pages/search/index').then(
    component => component.SearchSongList
  )

const SearchLyrics = () =>
  import(/* webpackChunkName: "search" */ '@/pages/search/index').then(
    component => component.SearchLyrics
  )

export const contentBaseRouter: CustomizeRouteRecordRaw[] = [
  {
    path: '/list/:type/:playlist',
    component: List,
    meta: {
      canBeCollect: true,
      browser: true,
      electron: true
    }
  },
  {
    path: '/artist/:id',
    component: Artist,
    name: 'Artist',
    meta: {
      canBeCollect: true,
      browser: true,
      electron: true
    },
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
        component: ArtistAlbume,
        name: 'ArtistAlbume',
        meta: {
          name: '专辑',
          canBeCollect: true
        }
      },
      {
        path: 'mv',
        component: ArtistMv,
        name: 'ArtistMv',
        meta: {
          name: 'MV',
          canBeCollect: true
        }
      },
      {
        path: 'detail',
        component: ArtistDesc,
        name: 'ArtistDesc',
        meta: {
          name: '歌手详情',
          canBeCollect: true
        }
      },
      {
        path: 'similar',
        component: ArtistSimilar,
        name: 'ArtistSimilar',
        meta: {
          name: '相似歌手',
          canBeCollect: true
        }
      }
    ]
  },
  {
    path: '/setting/:location',
    component: Setting,
    name: 'Setting',
    meta: {
      canBeCollect: true,
      browser: true,
      electron: true
    }
  },
  {
    path: '/search',
    name: 'Search',
    component: Search,
    meta: {
      canBeCollect: true,
      browser: true,
      electron: true
    },
    children: [
      {
        path: '',
        redirect: '/search/song'
      },
      {
        path: 'song',
        component: SearchSong,
        name: 'SearchSong',
        meta: {
          name: '歌曲',
          path: 'song'
        }
      },
      {
        path: 'artist',
        component: SearchArtist,
        name: 'SearchArtist',
        meta: {
          name: '歌手',
          path: 'artist'
        }
      },
      {
        path: 'album',
        component: SearchAlbum,
        name: 'SearchAlbum',
        meta: {
          name: '专辑',
          path: 'album'
        }
      },
      {
        path: 'songlist',
        component: SearchSongList,
        name: 'SearchSongList',
        meta: {
          name: '歌单',
          path: 'songlist'
        }
      },
      {
        path: 'lyrics',
        component: SearchLyrics,
        name: 'SearchLyrics',
        meta: {
          name: '歌词',
          path: 'lyrics'
        }
      }
    ]
  }
]
