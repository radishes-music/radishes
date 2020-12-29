/* eslint-disable @typescript-eslint/no-explicit-any */

import dayjs, { OpUnitType } from 'dayjs'
import UTC from 'dayjs/plugin/utc'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { ElectronWindowEventMap } from '@/interface/app'
import { saveAs } from 'file-saver'
import { Platform } from '@/config/build'

dayjs.extend(UTC)
dayjs.extend(customParseFormat)

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
  return dayjs
    .utc(new Date(0))
    .add(time, unit)
    .format('mm:ss')
}

export const formatTimeToStandard = (time: number) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

export const formatNumber = (n: number, base: number, unit: string[]) => {
  let res = n,
    index = 0

  while (res > base) {
    res /= base
    index++
  }
  return (res | 0) + unit[index]
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

export const toFixed = (n: number, m: number) => {
  if (typeof n === 'number') {
    return Number(n.toFixed(m))
  }
  return null
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
