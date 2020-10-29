export const enum Size {
  SM = 'sm',
  MD = 'md',
  LG = 'lg'
}

export interface State {
  screenSize: Size
  rebackSize: Size
}

export const state: State = {
  screenSize: Size.MD,
  rebackSize: Size.MD
}
