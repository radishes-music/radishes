export function hasOwnProperty<X extends {}, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> {
  return Reflect.hasOwnProperty.call(obj, prop)
}

export function on<T extends keyof HTMLElementEventMap>(
  container: HTMLElement,
  type: T,
  listener: (ev: HTMLElementEventMap[T]) => void
) {
  container.addEventListener(type, listener)
}

export function off<T extends keyof HTMLElementEventMap>(
  container: HTMLElement,
  type: T,
  listener: (ev: HTMLElementEventMap[T]) => void
) {
  container.removeEventListener(type, listener)
}

export const isNumber = (n: unknown) => {
  return Object.prototype.toString.call(n) === '[object Number]'
}

export const toFixed = (n: number, m: number) => {
  return Number(n.toFixed(m))
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {}
