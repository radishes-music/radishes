export const enum LayoutSize {
  SM = 'sm',
  MD = 'md',
  LG = 'lg'
}

export interface LayoutState {
  screenSize: LayoutSize
  rebackSize: LayoutSize
}

export const enum LayoutMutations {
  CHANGE_WINDOW_SIZE = 'CHANGE_WINDOW_SIZE'
}
