import { SearchState } from '@/interface/index'
import { cloneDeep } from 'lodash-es'

const initList = {
  data: [],
  total: 0,
  loading: false,
  pagination: { limit: 30, offset: 1, slice: 0 }
}

export const state: SearchState = {
  searchTitle: '',
  songList: cloneDeep(initList),
  artistList: cloneDeep(initList),
  playlist: cloneDeep(initList),
  albumList: cloneDeep(initList),
  lyriceList: cloneDeep(initList)
}
