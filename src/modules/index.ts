import Layout, { NAMESPACED as LayoutNameSpaced } from '@/layout/module'
import Recommend, {
  NAMESPACED as RecommendNameSpaced
} from '@/pages/news/children/recommend/module'
import SongList, {
  NAMESPACED as SongListNameSpaced
} from '@/pages/news/children/song-list/module'
import Header, { NAMESPACED as HeaderNameSpaced } from '@/pages/header/module'
import Footer, { NAMESPACED as FooterNameSpaced } from '@/pages/footer/module'
import Main, { NAMESPACED as MainNameSpaced } from '@/pages/main/module'
import Auth, { NAMESPACED as AuthNameSpaced } from '@/pages/auth/module'
import Song, { NAMESPACED as SongNameSpaced } from '@/pages/song/module'

export {
  LayoutNameSpaced,
  RecommendNameSpaced,
  SongListNameSpaced,
  HeaderNameSpaced,
  FooterNameSpaced,
  AuthNameSpaced,
  SongNameSpaced
}

const modules = {
  [LayoutNameSpaced]: Layout,
  [RecommendNameSpaced]: Recommend,
  [SongListNameSpaced]: SongList,
  [HeaderNameSpaced]: Header,
  [FooterNameSpaced]: Footer,
  [MainNameSpaced]: Main,
  [AuthNameSpaced]: Auth,
  [SongNameSpaced]: Song
}

export default modules
