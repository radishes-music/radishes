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
