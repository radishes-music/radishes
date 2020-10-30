import Layout, { NAMESPACED as LayoutNameSpaced } from '@/layout/module'
import Recommend, {
  NAMESPACED as RecommendNameSpaced
} from '@/pages/find-new-music/children/recommend/module'
import Header, { NAMESPACED as HeaderNameSpaced } from '@/pages/header/module'

export { LayoutNameSpaced, RecommendNameSpaced, HeaderNameSpaced }

const modules = {
  [LayoutNameSpaced]: Layout,
  [RecommendNameSpaced]: Recommend,
  [HeaderNameSpaced]: Header
}

export default modules
