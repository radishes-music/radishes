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
import Layout, { NAMESPACED as LayoutNameSpaced } from '@/layout/module'
import Header, { NAMESPACED as HeaderNameSpaced } from '@/pages/header/module'
import Footer, {
  NAMESPACED as FooterNameSpaced,
  useFooterModule
} from '@/pages/footer/module'
import Main, { NAMESPACED as MainNameSpaced } from '@/pages/main/module'
import Auth, { NAMESPACED as AuthNameSpaced } from '@/pages/auth/module'
import Song, { NAMESPACED as SongNameSpaced } from '@/pages/list/module'
import Artist, { NAMESPACED as ArtistNameSpaced } from '@/pages/artist/module'

export * from '@/pages/footer/module'

export {
  useFooterModule,
  LayoutNameSpaced,
  RecommendNameSpaced,
  SongListNameSpaced,
  TopListNameSpaced,
  ArtistsNameSpaced,
  HeaderNameSpaced,
  FooterNameSpaced,
  AuthNameSpaced,
  SongNameSpaced,
  ArtistNameSpaced
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
  [ArtistNameSpaced]: Artist
}

export default modules
