import { App } from 'vue'
import dayjs, { OpUnitType } from 'dayjs'
import UTC from 'dayjs/plugin/utc'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { ElectronWindowEventMap } from '@/interface/app'
import { saveAs } from 'file-saver'
import { Platform } from '@/config/build'

dayjs.extend(UTC)
dayjs.extend(customParseFormat)

export const isBrowser = import.meta.env.VUE_APP_PLATFORM === Platform.BROWSER

export const isElectron = import.meta.env.VUE_APP_PLATFORM === Platform.ELECTRON

export const isPromise = (p: unknown) => {
  return typeof p === 'object' && p instanceof Promise
}

export const isMacOS = isElectron && process.platform === 'darwin'

export const isWindows = isElectron && process.platform === 'win32'

export const getDomStyle = (dom: Element, css: keyof CSSStyleDeclaration) => {
  const style = window.getComputedStyle(dom)
  return style[css]
}

export const hasOwnProperty = <X extends {}, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> => {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

export const isNumber = (n: unknown) => {
  return Object.prototype.toString.call(n) === '[object Number]'
}

export const formatTime = (time: number, unit: OpUnitType): string => {
  return dayjs.utc(new Date(0)).add(time, unit).format('mm:ss')
}

export const formatTimeToStandard = (time: number) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

export const toFixed = (n: number, m: number) => {
  if (typeof n === 'number') {
    return Number(n.toFixed(m))
  }
  return 0
}

export const formatNumber = (n: number, base: number, unit: string[]) => {
  let res = n,
    index = 0

  while (res > base) {
    res /= base
    index++
  }
  return toFixed(res, 2) + unit[index]
}

export const formatCount = (count?: number): string => {
  const unit = ['', '万', '亿']
  if (count) {
    return formatNumber(count, 1e4, unit)
  }
  return ''
}

export const formatSize = (size: number) => {
  const unit = ['', 'KB', 'MB']
  return formatNumber(size, 1.024e3, unit)
}

export const timeTos = (time: string): number => {
  return (
    dayjs(time, ['mm:ss.SSS', 'mm:ss.SS']).diff(
      dayjs('00:00.000', 'mm:ss.SSS')
    ) / 1000
  )
}

export const download = (url: string, filename: string) => {
  saveAs(url, filename)
}

export const sleep = (n: number) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true)
    }, n)
  })
}

export const syncToAsync = <Value = unknown>(
  fn: (resolve: (value: Value) => void) => void
): Promise<Value> => {
  return new Promise((resolve, reject) => {
    try {
      fn(resolve)
    } catch (e) {
      reject(e)
    }
  })
}

export const maxChildrenScollWidth = (el: HTMLElement) => {
  let max = 0
  const children = el.children
  for (let i = 0; i < children.length; i++) {
    max = Math.max(max, children[i].scrollWidth)
  }

  return max
}

export type Reverse<T> = (arg: any) => T
export type ParserTarget = string | boolean | number | null | 'object'
export interface StorageOption {
  parser: ParserTarget
}

export const parserData = (target: string | null, type: ParserTarget) => {
  if (target) {
    switch (type) {
      case 'number':
        return +target
      case 'object':
        return JSON.parse(target)
    }

    return target
  }
  return null
}

export const toArrayBuffer = (buf: Buffer) => {
  const ab = new ArrayBuffer(buf.length)
  const view = new Uint8Array(ab)
  for (let i = 0; i < buf.length; ++i) {
    view[i] = buf[i]
  }
  return ab
}

export const create = (appFunction: App<Element>) => {
  const div = document.createElement('div')
  document.body.appendChild(div)
  appFunction.mixin({
    unmounted() {
      appFunction.unmount()
    }
  })
  appFunction.mount(div)
}

export function on<T extends keyof ElectronWindowEventMap>(
  container: Window,
  type: T,
  listener: (ev: ElectronWindowEventMap[T]) => void,
  config?: AddEventListenerOptions | boolean
): void
export function on<T extends keyof WindowEventMap>(
  container: Window,
  type: T,
  listener: (ev: WindowEventMap[T]) => void,
  config?: AddEventListenerOptions | boolean
): void
export function on<T extends keyof HTMLElementEventMap>(
  container: HTMLElement,
  type: T,
  listener: (ev: HTMLElementEventMap[T]) => void,
  config?: AddEventListenerOptions | boolean
): void
export function on(
  container: any,
  type: any,
  listener: any,
  config: any
): void {
  container?.addEventListener(type, listener, config)
}

export function off<T extends keyof ElectronWindowEventMap>(
  container: Window,
  type: T,
  listener: (ev: ElectronWindowEventMap[T]) => void
): void
export function off<T extends keyof WindowEventMap>(
  container: Window,
  type: T,
  listener: (ev: WindowEventMap[T]) => void
): void
export function off<T extends keyof HTMLElementEventMap>(
  container: HTMLElement,
  type: T,
  listener: (ev: HTMLElementEventMap[T]) => void
): void
export function off(container: any, type: any, listener: (ev: any) => void) {
  container?.removeEventListener(type, listener)
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {}

export const getNodeEnv = (): string => {
  let NODE_ENV = import.meta.env.NODE_ENV as string
  if (isElectron) {
    NODE_ENV = import.meta.env.VUE_APP_NODE_ENV as string
  }
  return NODE_ENV
}

export const formatVersion = (version: string) => {
  let major: unknown = 0,
    minor: unknown = 0,
    patch: unknown = 0,
    status,
    statusV: unknown = 0
  const formalRegex = /^(\d)\.(\d)\.(\d)$/
  const isFormalVersion = formalRegex.test(version)
  if (isFormalVersion) {
    const formalMatch = version.match(formalRegex)
    if (formalMatch) {
      ;[major, minor, patch] = formalMatch.slice(1)
      return {
        major: Number(major),
        minor: Number(minor),
        patch: Number(patch)
      }
    }
  } else {
    const match = version.match(/^(\d)\.(\d)\.(\d)-([a-z]+)\.(\d)$/)
    if (match) {
      ;[major, minor, patch, status, statusV] = match.slice(1)
    }
  }
  return {
    major: Number(major),
    minor: Number(minor),
    patch: Number(patch),
    status,
    statusV: Number(statusV)
  }
}

export const newsVersion = (origin: string, local: string) => {
  const originFormat = formatVersion(origin)
  const localFormat = formatVersion(local)

  // formal version
  if (
    originFormat.major > localFormat.major ||
    originFormat.minor > localFormat.minor ||
    originFormat.patch > localFormat.patch
  ) {
    return true
  }

  // test version
  if (
    originFormat.statusV &&
    localFormat.statusV &&
    originFormat.status === localFormat.status &&
    originFormat.statusV > localFormat.statusV
  ) {
    return true
  }

  return false
}

export const scrollAnmation = (
  from: number,
  to: number,
  config: {
    tween: (...args: number[]) => number
    duration: number
    cb: (n: number) => void
  }
) => {
  let start = 0
  const step = () => {
    const value = config.tween(start, from, to - from, config.duration / 10)
    config.cb(Number(value.toFixed(2)))
    start++
    if (start <= config.duration / 10) {
      requestAnimationFrame(step)
    }
  }
  step()
}

export const renderRandom = (extent: number, index: number) => {
  if (extent <= 1) return extent
  const random = (): number => {
    const n = Math.floor(Math.random() * extent)
    if (n !== index) {
      return n
    }
    return random()
  }
  return random()
}

export const measureImg = (source: string) => {
  const img = document.createElement('img')
  img.src = source

  return new Promise((resolve, reject) => {
    img.onload = () => {
      resolve({ w: img.width, h: img.height })
    }
    img.onerror = e => {
      reject(e)
    }
  })
}

export const overNum = (num: number) => {
  return formatCount(num)
}

// FIXME: cant break
export const wrapperReFetch = async <T>(
  asyncGet: (...args: any) => Promise<T>
): Promise<T> => {
  try {
    const res = await asyncGet()
    return res
  } catch (error) {
    return new Promise(resolve => {
      setTimeout(async () => {
        resolve(await wrapperReFetch<T>(asyncGet))
      }, 1000)
    })
  }
}
