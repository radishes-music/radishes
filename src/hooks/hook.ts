import { useStore } from 'vuex'
import { on, off } from '@/utils/index'

interface InternalHook {
  startInternal: () => void
  stopInternal: () => void
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

export const useDrag = (container: HTMLElement, target: HTMLElement) => {
  const cache = {
    x: 0,
    y: 0
  }

  let clickPosition: {
    x: number
    y: number
  } = {
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
    target.style.cursor = 'grabbing'
  }
  const mouseup = () => {
    canMove = false
    const matrix = window.getComputedStyle(container).transform.match(/-?\d+/g)
    if (matrix) {
      cache.x = +matrix[4]
      cache.y = +matrix[5]
    }
    target.style.cursor = 'grab'
  }
  const mousemove = (e: MouseEvent) => {
    if (canMove) {
      const { clientX, clientY } = e
      const left = clientX - clickPosition.x + cache.x
      const top = clientY - clickPosition.y + cache.y
      requestAnimationFrame(() => {
        container.style.transform = `matrix(1, 0, 0, 1, ${left}, ${top}) translateZ(0)`
      })
    }
  }

  const stop = () => {
    off(container, 'mousedown', mousedown)
    off(document.documentElement, 'mouseup', mouseup)
    off(document.documentElement, 'mousemove', mousemove)
  }

  const start = () => {
    on(container, 'mousedown', mousedown)
    on(document.documentElement, 'mouseup', mouseup)
    on(document.documentElement, 'mousemove', mousemove)
  }

  start()

  return {
    start,
    stop
  }
}

export function uesModuleStore<S>(NAMESPACED: string) {
  const store = useStore()
  const useActions = (type: string, payload: string) => {
    return store.dispatch(NAMESPACED + '/' + type, payload)
  }
  const useState = (): S => {
    return store.state[NAMESPACED]
  }
  const useMutations = (type: string, payload: string): void => {
    store.commit(NAMESPACED + '/' + type, payload)
  }
  return {
    useActions: useActions,
    useMutations: useMutations,
    useState: useState
  }
}
