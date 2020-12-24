/* eslint-disable @typescript-eslint/no-explicit-any */

import dayjs, { OpUnitType } from 'dayjs'
import UTC from 'dayjs/plugin/utc'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { ElectronWindowEventMap } from '@/interface/app'
import { saveAs } from 'file-saver'
import { Platform } from '@/config/build'

dayjs.extend(UTC)
dayjs.extend(customParseFormat)

export const formatTime = (time: number, unit: OpUnitType): string => {
  return dayjs
    .utc(new Date(0))
    .add(time, unit)
    .format('mm:ss')
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

export const hasOwnProperty = <X extends {}, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> => {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

export const isNumber = (n: unknown) => {
  return Object.prototype.toString.call(n) === '[object Number]'
}

export const toFixed = (n: number, m: number) => {
  if (typeof n === 'number') {
    return Number(n.toFixed(m))
  }
  return null
}

export const formatCount = (count: number): string => {
  let res = count,
    n = 0
  const unit = ['', '万', '亿']
  while (res > 1e4) {
    res /= 1e4
    n++
  }
  return (res | 0) + unit[n]
}

export const sleep = (n: number) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true)
    }, n)
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

export const storage = () => {
  return {
    get: (key: string, option?: StorageOption) => {
      if (option?.parser) {
        try {
          return parserData(window.localStorage.getItem(key), option.parser)
        } catch (e) {
          console.warn(e)
        }
      }
      return window.localStorage.getItem(key)
    },
    set: (key: string, value: string | number) => {
      if (typeof value === 'number') {
        value = value.toString()
      }
      window.localStorage.setItem(key, value)
    }
  }
}

export function on<T extends keyof ElectronWindowEventMap>(
  container: Window,
  type: T,
  listener: (ev: ElectronWindowEventMap[T]) => void
): void
export function on<T extends keyof WindowEventMap>(
  container: Window,
  type: T,
  listener: (ev: WindowEventMap[T]) => void
): void
export function on<T extends keyof HTMLElementEventMap>(
  container: HTMLElement,
  type: T,
  listener: (ev: HTMLElementEventMap[T]) => void
): void
export function on(container: any, type: any, listener: any): void {
  container.addEventListener(type, listener)
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
  container.removeEventListener(type, listener)
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {}

export const getNodeEnv = (): string => {
  let NODE_ENV = process.env.NODE_ENV as string
  if (process.env.VUE_APP_PLATFORM === Platform.ELECTRON) {
    NODE_ENV = process.env.VUE_APP_NODE_ENV as string
  }
  return NODE_ENV
}
