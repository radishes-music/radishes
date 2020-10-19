export interface Resource {
  id: number
  name: string
  picUrl: string
}

export interface Banners {
  imageUrl: string
  typeTitle: string
  targetId: string
}

export interface State {
  banners: Banners[]
  resource: Resource[]
}

export const state: State = {
  resource: [],
  banners: []
}
