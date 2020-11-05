import { useStore } from 'vuex'
import { on, off } from '@/utils/index'

interface InternalHook {
  startInternal: () => void
  stopInternal: () => void
}

type Noop = (x: number, y: number) => void

interface DragOptions {
  startCB?: Noop
  stopCB?: Noop
  moveCB?: (x: number, y: number) => void
}

export const useInternal = (ms: number, cb: () => void): InternalHook => {
  let t: NodeJS.Timeout
  let running = false
  const startInternal = () => {
    if (running) {
      return console.error(
        'The timer has started, use stopInternal to stop the timer'
      )
    }
    running = true
    t = setInterval(cb, ms)
  }
  const stopInternal = () => {
    running = false
    t && clearInterval(t)
  }
  return {
    startInternal,
    stopInternal
  }
}

export const useDrag = (
  container: HTMLElement,
  target: HTMLElement,
  options?: DragOptions
) => {
  const cache = {
    x: 0,
    y: 0,
    left: 0,
    top: 0
  }

  let clickPosition = {
    x: 0,
    y: 0
  }

  let canMove = false

  const mousedown = (e: MouseEvent) => {
    canMove = true
    const { clientX, clientY } = e
    clickPosition = {
      x: clientX,
      y: clientY
    }
    const computedStyle = window.getComputedStyle(container)
    const width = computedStyle.width.match(/\d+/)
    const height = computedStyle.height.match(/\d+/)
    const matrix = computedStyle.transform.match(/-?\d+/g)
    if (matrix) {
      cache.x = +matrix[4]
      cache.y = +matrix[5]
    } else if (width && height) {
      cache.x = +width[0]
      cache.y = +height[0]
    }
    target.style.cursor = 'grabbing'
    options?.startCB && options.startCB(cache.left, cache.top)
  }
  const mouseup = () => {
    target.style.cursor = 'grab'
    if (canMove) {
      options?.stopCB && options.stopCB(cache.left, cache.top)
    }
    canMove = false
  }
  const mousemove = (e: MouseEvent) => {
    if (canMove) {
      const { clientX, clientY } = e
      const left = clientX - clickPosition.x + cache.x
      const top = clientY - clickPosition.y + cache.y
      cache.left = left
      cache.top = top
      options?.moveCB && options.moveCB(left, top)
    }
  }

  const stop = () => {
    off(target, 'mousedown', mousedown)
    off(document.documentElement, 'mouseup', mouseup)
    off(document.documentElement, 'mousemove', mousemove)
  }

  const start = () => {
    on(target, 'mousedown', mousedown)
    on(document.documentElement, 'mouseup', mouseup)
    on(document.documentElement, 'mousemove', mousemove)
  }

  return {
    start,
    stop
  }
}

export function uesModuleStore<S, G = Record<string, string>>(
  NAMESPACED: string
) {
  const store = useStore()

  const useState = (): S => {
    return store.state[NAMESPACED]
  }
  const useGetter = <key extends keyof G>(value: key): G[key] => {
    return store.getters[NAMESPACED + '/' + value]
  }
  const useActions = (type: string, payload?: unknown) => {
    return store.dispatch(NAMESPACED + '/' + type, payload)
  }
  const useMutations = (type: string, payload?: unknown): void => {
    store.commit(NAMESPACED + '/' + type, payload)
  }

  return {
    useActions: useActions,
    useMutations: useMutations,
    useState: useState,
    useGetter: useGetter
  }
}
