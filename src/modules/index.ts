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
import Header, { HeaderNameSpaced } from '@/pages/header/module'
import Main, { MainNameSpaced } from '@/pages/main/module'
import Footer, { FooterNameSpaced } from '@/pages/footer/module'
import Auth, { AuthNameSpaced } from '@/pages/auth/module'
import Song, { SongNameSpaced } from '@/pages/list/module'
import Artist, { ArtistNameSpaced } from '@/pages/artist/module'
import Download, { DownloadNameSpaced } from '@/pages/download/module'
import LocalMusic, { LocalMusicNameSpaced } from '@/pages/music/module'
import Setting, { SettingNameSpaced } from '@/pages/setting/module'
import Search, { SearchNameSpaced } from '@/pages/search/module'
import Cloud, { CloudNameSpaced } from '@/pages/cloud/module'
import Layout, { LayoutNameSpaced } from '@/layout/module'

export * from '@/pages/footer/module'
export * from '@/pages/news/children/module'
export * from '@/pages/download/module'
export * from '@/pages/main/module'
export * from '@/pages/header/module'
export * from '@/pages/list/module'
export * from '@/pages/artist/module'
export * from '@/pages/music/module'
export * from '@/pages/setting/module'
export * from '@/pages/search/module'
export * from '@/pages/cloud/module'
export * from '@/layout/module'

export {
  RecommendNameSpaced,
  SongListNameSpaced,
  TopListNameSpaced,
  ArtistsNameSpaced,
  HeaderNameSpaced,
  MainNameSpaced,
  FooterNameSpaced,
  AuthNameSpaced,
  SongNameSpaced,
  ArtistNameSpaced,
  DownloadNameSpaced,
  LocalMusicNameSpaced,
  SettingNameSpaced,
  SearchNameSpaced,
  CloudNameSpaced,
  LayoutNameSpaced
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
  [DownloadNameSpaced]: Download,
  [LocalMusicNameSpaced]: LocalMusic,
  [SettingNameSpaced]: Setting,
  [CloudNameSpaced]: Cloud,
  [SearchNameSpaced]: Search
}

export default modules
