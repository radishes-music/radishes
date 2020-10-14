export type Size = 'sm' | 'md' | 'lg'

export interface State {
  screenSize: Size
}

export const state: State = {
  screenSize: 'md'
}
