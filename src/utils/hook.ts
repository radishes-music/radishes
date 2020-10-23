import { Container } from '@/layout/container'

interface InternalHook {
  startInternal: () => void
  stopInternal: () => void
}

export const internalHook = (ms: number, cb: () => void): InternalHook => {
  let t: NodeJS.Timeout
  const startInternal = () => {
    t = setInterval(cb, ms)
  }
  const stopInternal = () => {
    t && clearInterval(t)
  }
  return {
    startInternal,
    stopInternal
  }
}

export const dragHook = (container: HTMLElement, target: HTMLElement) => {
  let forcedStop = false

  const boxClient = {
    w: document.documentElement.offsetWidth,
    h: document.documentElement.offsetHeight
  }

  const cache = {
    x: 0,
    y: 0
  }

  const containerClient = {
    grapX: container.offsetLeft,
    grapY: container.offsetTop,
    w: container.offsetWidth,
    h: container.offsetHeight
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
  const mouseup = (e: MouseEvent) => {
    canMove = false
    if (!forcedStop) {
      const matrix = window
        .getComputedStyle(container)
        .transform.match(/-?\d+/g)
      if (matrix) {
        cache.x = +matrix[4]
        cache.y = +matrix[5]
      }
    }
    target.style.cursor = 'grab'
  }
  const mousemove = (e: MouseEvent) => {
    if (canMove && !forcedStop) {
      const { clientX, clientY } = e
      const left = clientX - clickPosition.x + cache.x
      const top = clientY - clickPosition.y + cache.y
      requestAnimationFrame(() => {
        container.style.transform = `matrix(1, 0, 0, 1, ${left}, ${top})`
      })
      // if (left >= 0 && left + containerClient.w <= boxClient.w) {

      // }
      // if (top >= 0 && top + containerClient.h <= boxClient.h) {
      //   requestAnimationFrame(() => {
      //     cache.y = top
      //     container.style.transform = `matrix(1, 0, 0, 1, ${cache.x}, ${cache.y})`
      //   })
      // }
    }
  }
  target.addEventListener('mousedown', mousedown)
  document.documentElement.addEventListener('mouseup', mouseup)
  document.documentElement.addEventListener('mousemove', mousemove)

  return {
    stop: () => (forcedStop = true),
    start: () => (forcedStop = false)
  }
}
