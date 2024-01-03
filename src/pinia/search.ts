import { defineStore } from 'pinia'

const storeKey = 'radishes-music-search'

export const useSearcStore = defineStore<
  typeof storeKey,
  {
    searchHistory: any[]
  },
  {
    hasSearchHistory: () => boolean
  },
  {
    addSearchHistory: (keyword: string) => void
    removeSearchHistory: (keyword: string) => void
    clearSearchHistory: () => void
  }
>(storeKey, {
  state: () => ({
    searchHistory: []
  }),
  getters: {
    hasSearchHistory() {
      return this.searchHistory.length > 0
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
    }
  },
  persist: true
})
