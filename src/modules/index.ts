import Layout, { NAMESPACED as LayoutNameSpaced } from '@/layout/module'
import Recommend, {
  NAMESPACED as RecommendNameSpaced
} from '@/pages/find-new-music/children/recommend/module'
import Header, { NAMESPACED as HeaderNameSpaced } from '@/pages/header/module'
import Footer, { NAMESPACED as FooterNameSpaced } from '@/pages/footer/module'
import Main, { NAMESPACED as MainNameSpaced } from '@/pages/main/module'

export {
  LayoutNameSpaced,
  RecommendNameSpaced,
  HeaderNameSpaced,
  FooterNameSpaced
}

const modules = {
  [LayoutNameSpaced]: Layout,
  [RecommendNameSpaced]: Recommend,
  [HeaderNameSpaced]: Header,
  [FooterNameSpaced]: Footer,
  [MainNameSpaced]: Main
}

export default modules
