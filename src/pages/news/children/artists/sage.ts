import { MutationTree, ActionTree } from 'vuex'
import { RootState } from '@/store/index'
import { ArtistsState } from './state'

export const enum ArtistsMutations {}

export const enum ArtistsActions {}

export const actions: ActionTree<ArtistsState, RootState> = {}
export const mutations: MutationTree<ArtistsState> = {}
