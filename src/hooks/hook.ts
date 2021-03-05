import { useStore } from 'vuex'
import { on, off } from '@/utils/index'
import { useRoute } from 'vue-router'
import { watch, toRaw } from 'vue'
import equal from 'lodash/isEqual'
import cloneDeep from 'lodash/cloneDeep'
import store from '@/store/index'

interface InternalHook {
  startInternal: () => void
  stopInternal: () => void
}

type Noop = (x: number, y: number) => void

interface DragOptions {
  startCB?: Noop
  stopCB?: Noop
  moveCB: (x: number, y: number) => void
  horizontal?: boolean
  vertical?: boolean
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
  options: DragOptions
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
    if (options.horizontal || options.vertical) {
      if (width && height) {
        cache.x = +width[0]
        cache.y = +height[0]
      }
    } else if (matrix) {
      cache.x = +matrix[4]
      cache.y = +matrix[5]
    }
    target.style.cursor = 'grabbing'
    options.startCB && options.startCB(cache.left, cache.top)
  }
  const mouseup = () => {
    target.style.cursor = 'grab'
    if (canMove) {
      options.stopCB && options.stopCB(cache.left, cache.top)
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
      options.moveCB && options.moveCB(left, top)
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

export function uesModuleStore<
  S,
  G = Record<string, string>,
  A = string,
  M = string
>(NAMESPACED: string) {
  const useState = (): S => {
    return store.state[NAMESPACED]
  }
  const useGetter = <key extends keyof G>(value: key): G[key] => {
    return store.getters[NAMESPACED + '/' + value]
  }
  const useActions = (type: A, payload?: unknown) => {
    return store.dispatch(NAMESPACED + '/' + type, payload)
  }
  const useMutations = (type: M, payload?: unknown): void => {
    store.commit(NAMESPACED + '/' + type, payload)
  }

  return {
    useActions: useActions,
    useMutations: useMutations,
    useState: useState,
    useGetter: useGetter
  }
}

export const useThemeColor = () => {
  const $store = useStore()
  return $store.state.Header.themeColor
}

export const useUrlParams = (
  key: string,
  cb: (...args: unknown[]) => void,
  args: unknown
) => {
  const route = useRoute()

  return watch(
    [() => route.query[key] as string, () => cloneDeep(args)] as unknown[],
    (v, ov) => {
      if (!equal(v, ov)) {
        cb(...v)
      }
    },
    {
      immediate: true
    }
  )
}
