/* eslint-disable @typescript-eslint/no-explicit-any */

import dayjs, { OpUnitType } from 'dayjs'
import UTC from 'dayjs/plugin/utc'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { ElectronWindowEventMap } from '@/interface/app'

export const formatTime = (time: number, unit: OpUnitType): string => {
  dayjs.extend(UTC)
  return dayjs
    .utc(new Date(0))
    .add(time, unit)
    .format('mm:ss')
}

export const timeTos = (time: string): number => {
  dayjs.extend(customParseFormat)
  return (
    dayjs(time, ['mm:ss.SSS', 'mm:ss.SS']).diff(
      dayjs('00:00.000', 'mm:ss.SSS')
    ) / 1000
  )
}

export function hasOwnProperty<X extends {}, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> {
  return Reflect.hasOwnProperty.call(obj, prop)
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
      resolve()
    }, n)
  })
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {}
