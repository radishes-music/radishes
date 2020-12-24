import Recommend, {
  NAMESPACED as RecommendNameSpaced
} from './recommend/module'
import SongList, { NAMESPACED as SongListNameSpaced } from './song-list/module'
import TopList, { NAMESPACED as TopListNameSpaced } from './top-list/module'
import Artists, { NAMESPACED as ArtistsNameSpaced } from './artists/module'
import { uesModuleStore } from '@/hooks/index'
import { RecommendState } from '../interface'

export * from '../interface'

export const useRecommendModule = () => {
  return uesModuleStore<RecommendState>(RecommendNameSpaced)
}

export {
  Recommend,
  RecommendNameSpaced,
  SongList,
  SongListNameSpaced,
  TopList,
  TopListNameSpaced,
  Artists,
  ArtistsNameSpaced
}
