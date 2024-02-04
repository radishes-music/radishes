import { defineStore } from 'pinia'

import { searchSuggest } from '@/api/search'

const storeKey = 'radishes-music-search'

export const useSearcStore = defineStore<
  typeof storeKey,
  {
    searchHistory: any[]
    searchResult: {
      albums: never[]
      artists: never[]
      songs: never[]
      playlists: never[]
    }
    currentWord: string
  },
  {
    hasSearchHistory: () => boolean
    hasSearchResult: () => boolean
  },
  {
    addSearchHistory: (keyword: string) => void
    removeSearchHistory: (keyword: string) => void
    clearSearchHistory: () => void
    searchWord: (word: string) => Promise<void>
  }
>(storeKey, {
  state: () => ({
    searchHistory: [],
    searchResult: {
      albums: [],
      artists: [],
      songs: [],
      playlists: []
    },
    currentWord: ''
  }),
  getters: {
    hasSearchHistory() {
      return this.searchHistory.length > 0
    },
    hasSearchResult() {
      return (
        this.searchResult.albums?.length > 0 ||
        this.searchResult.artists?.length > 0 ||
        this.searchResult.playlists?.length > 0 ||
        this.searchResult.songs?.length > 0
      )
    }
  },
  actions: {
    addSearchHistory(keyword: string) {
      if (!keyword) {
        return
      }

      if (this.searchHistory.includes(keyword)) {
        this.removeSearchHistory(keyword)
      }

      if (this.searchHistory.length === 10) {
        this.searchHistory.pop()
      }
      this.searchHistory.unshift(keyword)
    },
    removeSearchHistory(keyword: string) {
      this.searchHistory = this.searchHistory.filter(x => x != keyword)
    },
    clearSearchHistory() {
      this.searchHistory = []
    },
    async searchWord(word: string) {
      this.currentWord = word
      const list = await searchSuggest(word)
      if (this.currentWord !== word) {
        return
      }
      this.searchResult = list as any
    }
  },
  persist: {
    paths: ['searchHistory']
  }
})
