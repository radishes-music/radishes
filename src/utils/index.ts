export function hasOwnProperty<X extends {}, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> {
  return Reflect.hasOwnProperty.call(obj, prop)
}

export function on(
  container: HTMLElement,
  type: string,
  listener: (e: any) => void
) {
  container.addEventListener(type, listener)
}

export function off(
  container: HTMLElement,
  type: string,
  listener: (e: any) => void
) {
  container.removeEventListener(type, listener)
}
