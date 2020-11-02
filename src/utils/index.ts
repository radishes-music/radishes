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
