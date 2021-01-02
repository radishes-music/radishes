// https://encoding.spec.whatwg.org/

function strToCodePoints(str: string | Uint8Array) {
  return String(str)
    .split('')
    .map(c => c.charCodeAt(0))
}

export function encodeWindows1252(str: string | Uint8Array) {
  if (typeof str === 'string') {
    return new Uint8Array(strToCodePoints(str))
  }
  return str
}

export function encodeUtf16le(str: string | Uint8Array) {
  const output = new Uint8Array(str.length * 2)
  new Uint16Array(output.buffer).set(strToCodePoints(str))

  return output
}
