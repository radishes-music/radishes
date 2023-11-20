import Recommend, {
  NAMESPACED as RecommendNameSpaced
} from './recommend/module'
import SongList, { NAMESPACED as SongListNameSpaced } from './song-list/module'
import TopList, { NAMESPACED as TopListNameSpaced } from './top-list/module'
import Artists, { NAMESPACED as ArtistsNameSpaced } from './artists/module'
import { uesModuleStore } from '@/hooks/index'
import {
  RecommendState,
  RecommendActions,
  RecommendMutations,
  ArtistsState,
  ArtistsActions,
  ArtistsMutations,
  SongListState,
  SongListActions,
  SongListMutations,
  TopListState,
  TopListActions,
  TopListMutations
} from '@/interface'

export const useRecommendModule = () => {
  return uesModuleStore<
    RecommendState,
    {},
    RecommendActions,
    RecommendMutations
  >(RecommendNameSpaced)
}

export const useArtistSearchModule = () => {
  return uesModuleStore<ArtistsState, {}, ArtistsActions, ArtistsMutations>(
    ArtistsNameSpaced
  )
}

export const useSongListModule = () => {
  return uesModuleStore<SongListState, {}, SongListActions, SongListMutations>(
    SongListNameSpaced
  )
}

export const useTopListModule = () => {
  return uesModuleStore<TopListState, {}, TopListActions, TopListMutations>(
    TopListNameSpaced
  )
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
