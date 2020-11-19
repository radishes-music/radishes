import Layout, { NAMESPACED as LayoutNameSpaced } from '@/layout/module'
import Recommend, {
  NAMESPACED as RecommendNameSpaced
} from '@/pages/news/children/recommend/module'
import Header, { NAMESPACED as HeaderNameSpaced } from '@/pages/header/module'
import Footer, { NAMESPACED as FooterNameSpaced } from '@/pages/footer/module'
import Main, { NAMESPACED as MainNameSpaced } from '@/pages/main/module'
import Auth, { NAMESPACED as AuthNameSpaced } from '@/pages/auth/module'

export {
  LayoutNameSpaced,
  RecommendNameSpaced,
  HeaderNameSpaced,
  FooterNameSpaced,
  AuthNameSpaced
}

const modules = {
  [LayoutNameSpaced]: Layout,
  [RecommendNameSpaced]: Recommend,
  [HeaderNameSpaced]: Header,
  [FooterNameSpaced]: Footer,
  [MainNameSpaced]: Main,
  [AuthNameSpaced]: Auth
}

export default modules
