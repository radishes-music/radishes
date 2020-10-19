import Layout, { NAMESPACED as LayoutNameSpaced } from '@/layout/module'
import Recommend, {
  NAMESPACED as RecommendNameSpaced
} from '@/pages/find-new-music/children/recommend/module'

const modules = {
  [LayoutNameSpaced]: Layout,
  [RecommendNameSpaced]: Recommend
}

export default modules
