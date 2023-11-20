import { get } from '@/utils/http'
import { CloudList, Pagination } from '@/interface'

export const getCloud = async ({
  offset,
  limit
}: Pagination): Promise<CloudList[]> => {
  const data = await get<{ data: CloudList[] }>('/api/user/cloud', {
    offset,
    limit
  })
  return data.data
}
