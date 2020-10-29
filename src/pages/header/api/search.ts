import { get } from '@/utils/http'
import { SearchSuggest } from '../state'

export const searchSuggest = async (key: string): Promise<SearchSuggest> => {
  const data = await get<{ result: SearchSuggest }>('/api/search/suggest', {
    keywords: key
  })
  return data.result
}
