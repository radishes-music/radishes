import {
  Recommend,
  RecommendNameSpaced,
  SongList,
  SongListNameSpaced,
  TopList,
  TopListNameSpaced,
  Artists,
  ArtistsNameSpaced
} from '@/pages/news/children/module'
import Layout, { LayoutNameSpaced } from '@/layout/module'
import Header, { HeaderNameSpaced } from '@/pages/header/module'
import Footer, {
  FooterNameSpaced,
  useFooterModule
} from '@/pages/footer/module'
import Main, { MainNameSpaced } from '@/pages/main/module'
import Auth, { NAMESPACED as AuthNameSpaced } from '@/pages/auth/module'
import Song, { SongNameSpaced } from '@/pages/list/module'
import Artist, { NAMESPACED as ArtistNameSpaced } from '@/pages/artist/module'
import Download, {
  DownloadNameSpaced,
  useDownloadModule
} from '@/pages/download/module'

export * from '@/pages/footer/module'
export * from '@/pages/news/children/module'
export * from '@/pages/download/module'
export * from '@/pages/main/module'
export * from '@/pages/header/module'
export * from '@/pages/list/module'
export * from '@/layout/module'

export {
  useFooterModule,
  useDownloadModule,
  LayoutNameSpaced,
  RecommendNameSpaced,
  SongListNameSpaced,
  TopListNameSpaced,
  ArtistsNameSpaced,
  HeaderNameSpaced,
  FooterNameSpaced,
  AuthNameSpaced,
  SongNameSpaced,
  ArtistNameSpaced,
  DownloadNameSpaced
}

const modules = {
  [LayoutNameSpaced]: Layout,
  [RecommendNameSpaced]: Recommend,
  [SongListNameSpaced]: SongList,
  [TopListNameSpaced]: TopList,
  [ArtistsNameSpaced]: Artists,
  [HeaderNameSpaced]: Header,
  [FooterNameSpaced]: Footer,
  [MainNameSpaced]: Main,
  [AuthNameSpaced]: Auth,
  [SongNameSpaced]: Song,
  [ArtistNameSpaced]: Artist,
  [DownloadNameSpaced]: Download
}

export default modules
