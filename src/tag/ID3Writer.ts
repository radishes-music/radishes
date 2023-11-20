import { encodeWindows1252, encodeUtf16le } from './encoder'
import { getMimeType, isId3v2 } from './signatures'
import {
  uint7ArrayToUint28,
  uint28ToUint7Array,
  uint32ToUint8Array
} from './transform'
import {
  getNumericFrameSize,
  getStringFrameSize,
  getPictureFrameSize,
  getLyricsFrameSize,
  getCommentFrameSize,
  getUserStringFrameSize,
  getUrlLinkFrameSize,
  getPrivateFrameSize
} from './sizes'

function invokeFrame(frame: unknown[]) {
  return (fn: (...args: any[]) => void, ...args: any[]) => {
    fn.apply(null, [frame, ...args])
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function removeTag(originBuffer: Buffer) {
  const headerLength = 10

  const bytes = new Uint8Array(originBuffer)
  const version = bytes[3]
  const tagSize =
    uint7ArrayToUint28([bytes[6], bytes[7], bytes[8], bytes[9]]) + headerLength

  if (!isId3v2(bytes) || version < 2 || version > 4) {
    return console.warn('This version is not currently supported')
  }
  return new Uint8Array(bytes.subarray(tagSize)).buffer
}

function _setIntegerFrame(frames: unknown[], name: string, value: string) {
  const integer = parseInt(value, 10)

  frames.push({
    name,
    value: integer,
    size: getNumericFrameSize(integer.toString().length)
  })
}

function _setStringFrame(frames: unknown[], name: string, value: string) {
  const stringValue = value.toString()

  frames.push({
    name,
    value: stringValue,
    size: getStringFrameSize(stringValue.length)
  })
}

function _setPictureFrame(
  frames: unknown[],
  pictureType: unknown,
  data: ArrayBufferLike,
  description: string,
  useUnicodeEncoding: boolean
) {
  const mimeType = getMimeType(new Uint8Array(data))
  const descriptionString = description.toString()

  if (!mimeType) {
    throw new Error('Unknown picture MIME type')
  }
  if (!description) {
    useUnicodeEncoding = false
  }
  frames.push({
    name: 'APIC',
    value: data,
    pictureType,
    mimeType,
    useUnicodeEncoding,
    description: descriptionString,
    size: getPictureFrameSize(
      data.byteLength,
      mimeType.length,
      descriptionString.length,
      useUnicodeEncoding
    )
  })
}

function _setLyricsFrame(
  frames: unknown[],
  language: string,
  description: string,
  lyrics: string
) {
  const languageCode = language.split('').map(c => c.charCodeAt(0))
  const descriptionString = description.toString()
  const lyricsString = lyrics.toString()

  frames.push({
    name: 'USLT',
    value: lyricsString,
    language: languageCode,
    description: descriptionString,
    size: getLyricsFrameSize(descriptionString.length, lyricsString.length)
  })
}

function _setCommentFrame(
  frames: unknown[],
  language: string,
  description: string,
  text: string
) {
  const languageCode = language.split('').map(c => c.charCodeAt(0))
  const descriptionString = description.toString()
  const textString = text.toString()

  frames.push({
    name: 'COMM',
    value: textString,
    language: languageCode,
    description: descriptionString,
    size: getCommentFrameSize(descriptionString.length, textString.length)
  })
}

function _setPrivateFrame(frames: unknown[], id: string, data: Buffer) {
  const identifier = id.toString()

  frames.push({
    name: 'PRIV',
    value: data,
    id: identifier,
    size: getPrivateFrameSize(identifier.length, data.byteLength)
  })
}

function _setUserStringFrame(
  frames: unknown[],
  description: string,
  value: string
) {
  const descriptionString = description.toString()
  const valueString = value.toString()

  frames.push({
    name: 'TXXX',
    description: descriptionString,
    value: valueString,
    size: getUserStringFrameSize(descriptionString.length, valueString.length)
  })
}

function _setUrlLinkFrame(frames: unknown[], name: string, url: string) {
  const urlString = url.toString()

  frames.push({
    name,
    value: urlString,
    size: getUrlLinkFrameSize(urlString.length)
  })
}

function renderBuffer(
  frames: {
    [x: string]: unknown
    name: string
    size: number
    value: string | Uint8Array
    language: string
    description: string
    id: string
    mimeType: string
  }[],
  padding: number,
  originBuffer: Buffer
) {
  return () => {
    const BOM = [0xff, 0xfe]
    const headerSize = 10
    const totalFrameSize = frames.reduce((sum, frame) => sum + frame.size, 0)
    const totalTagSize = headerSize + totalFrameSize + padding
    const buffer = new ArrayBuffer(originBuffer.byteLength + totalTagSize)
    const bufferWriter = new Uint8Array(buffer)

    let offset = 0
    let writeBytes: any = []

    writeBytes = [0x49, 0x44, 0x33, 3] // ID3 tag and version
    bufferWriter.set(writeBytes, offset)
    offset += writeBytes.length

    offset++ // version revision
    offset++ // flags

    writeBytes = uint28ToUint7Array(totalTagSize - headerSize) // tag size (without header)
    bufferWriter.set(writeBytes, offset)
    offset += writeBytes.length

    frames.forEach(frame => {
      writeBytes = encodeWindows1252(frame.name) // frame name
      bufferWriter.set(writeBytes, offset)
      offset += writeBytes.length

      writeBytes = uint32ToUint8Array(frame.size - headerSize) // frame size (without header)
      bufferWriter.set(writeBytes, offset)
      offset += writeBytes.length

      offset += 2 // flags

      switch (frame.name) {
        case 'WCOM':
        case 'WCOP':
        case 'WOAF':
        case 'WOAR':
        case 'WOAS':
        case 'WORS':
        case 'WPAY':
        case 'WPUB': {
          writeBytes = encodeWindows1252(frame.value) // URL
          bufferWriter.set(writeBytes, offset)
          offset += writeBytes.length
          break
        }
        case 'TPE1':
        case 'TCOM':
        case 'TCON':
        case 'TLAN':
        case 'TIT1':
        case 'TIT2':
        case 'TIT3':
        case 'TALB':
        case 'TPE2':
        case 'TPE3':
        case 'TPE4':
        case 'TRCK':
        case 'TPOS':
        case 'TKEY':
        case 'TMED':
        case 'TPUB':
        case 'TCOP':
        case 'TEXT':
        case 'TSRC': {
          writeBytes = [1].concat(BOM) // encoding, BOM
          bufferWriter.set(writeBytes, offset)
          offset += writeBytes.length

          writeBytes = encodeUtf16le(frame.value) // frame value
          bufferWriter.set(writeBytes, offset)
          offset += writeBytes.length
          break
        }
        case 'TXXX':
        case 'USLT':
        case 'COMM': {
          writeBytes = [1] // encoding
          if (frame.name === 'USLT' || frame.name === 'COMM') {
            writeBytes = writeBytes.concat(frame.language) // language
          }
          writeBytes = writeBytes.concat(BOM) // BOM for content descriptor
          bufferWriter.set(writeBytes, offset)
          offset += writeBytes.length

          writeBytes = encodeUtf16le(frame.description) // content descriptor
          bufferWriter.set(writeBytes, offset)
          offset += writeBytes.length

          writeBytes = [0, 0].concat(BOM) // separator, BOM for frame value
          bufferWriter.set(writeBytes, offset)
          offset += writeBytes.length

          writeBytes = encodeUtf16le(frame.value) // frame value
          bufferWriter.set(writeBytes, offset)
          offset += writeBytes.length
          break
        }
        case 'TBPM':
        case 'TLEN':
        case 'TDAT':
        case 'TYER': {
          offset++ // encoding

          writeBytes = encodeWindows1252(frame.value) // frame value
          bufferWriter.set(writeBytes, offset)
          offset += writeBytes.length
          break
        }
        case 'PRIV': {
          writeBytes = encodeWindows1252(frame.id) // identifier
          bufferWriter.set(writeBytes, offset)
          offset += writeBytes.length

          offset++ // separator

          bufferWriter.set(new Uint8Array(frame.value as Uint8Array), offset) // frame data
          offset += (frame.value as Uint8Array).byteLength
          break
        }
        case 'APIC': {
          writeBytes = [frame.useUnicodeEncoding ? 1 : 0] // encoding
          bufferWriter.set(writeBytes, offset)
          offset += writeBytes.length

          writeBytes = encodeWindows1252(frame.mimeType) // MIME type
          bufferWriter.set(writeBytes, offset)
          offset += writeBytes.length

          writeBytes = [0, frame.pictureType] // separator, pic type
          bufferWriter.set(writeBytes, offset)
          offset += writeBytes.length

          if (frame.useUnicodeEncoding) {
            writeBytes = [].concat(BOM as any) // BOM
            bufferWriter.set(writeBytes, offset)
            offset += writeBytes.length

            writeBytes = encodeUtf16le(frame.description) // description
            bufferWriter.set(writeBytes, offset)
            offset += writeBytes.length

            offset += 2 // separator
          } else {
            writeBytes = encodeWindows1252(frame.description) // description
            bufferWriter.set(writeBytes, offset)
            offset += writeBytes.length

            offset++ // separator
          }

          bufferWriter.set(new Uint8Array(frame.value as Uint8Array), offset) // picture content
          offset += (frame.value as Uint8Array).byteLength
          break
        }
      }
    })

    offset += padding // free space for rewriting
    bufferWriter.set(new Uint8Array(originBuffer), offset)
    return buffer
  }
}

function addTag(
  invoke: (fn: (...args: any[]) => void, ...args: any[]) => void
) {
  return (frameName: string, frameValue: any) => {
    switch (frameName) {
      case 'TPE1': // song artists
      case 'TCOM': // song composers
      case 'TCON': {
        // song genres
        if (!Array.isArray(frameValue)) {
          throw new Error(
            `${frameName} frame value should be an array of strings`
          )
        }
        const delemiter = frameName === 'TCON' ? ';' : '/'
        const value = frameValue.join(delemiter)

        invoke(_setStringFrame, frameName, value)
        break
      }
      case 'TLAN': // language
      case 'TIT1': // content group description
      case 'TIT2': // song title
      case 'TIT3': // song subtitle
      case 'TALB': // album title
      case 'TPE2': // album artist // spec doesn't say anything about separator, so it is a string, not array
      case 'TPE3': // conductor/performer refinement
      case 'TPE4': // interpreted, remixed, or otherwise modified by
      case 'TRCK': // song number in album: 5 or 5/10
      case 'TPOS': // album disc number: 1 or 1/3
      case 'TMED': // media type
      case 'TPUB': // label name
      case 'TCOP': // copyright
      case 'TKEY': // musical key in which the sound starts
      case 'TEXT': // lyricist / text writer
      case 'TSRC': {
        // isrc
        invoke(_setStringFrame, frameName, frameValue)
        break
      }
      case 'TBPM': // beats per minute
      case 'TLEN': // song duration
      case 'TDAT': // album release date expressed as DDMM
      case 'TYER': {
        // album release year
        invoke(_setIntegerFrame, frameName, frameValue)
        break
      }
      case 'USLT': {
        // unsychronised lyrics
        frameValue.language = frameValue.language || 'eng'
        if (
          typeof frameValue !== 'object' ||
          !('description' in frameValue) ||
          !('lyrics' in frameValue)
        ) {
          throw new Error(
            'USLT frame value should be an object with keys description and lyrics'
          )
        }
        if (frameValue.language && !frameValue.language.match(/[a-z]{3}/i)) {
          throw new Error(
            'Language must be coded following the ISO 639-2 standards'
          )
        }
        invoke(
          _setLyricsFrame,
          frameValue.language,
          frameValue.description,
          frameValue.lyrics
        )
        break
      }
      case 'APIC': {
        // song cover
        if (
          typeof frameValue !== 'object' ||
          !('type' in frameValue) ||
          !('data' in frameValue) ||
          !('description' in frameValue)
        ) {
          throw new Error(
            'APIC frame value should be an object with keys type, data and description'
          )
        }
        if (frameValue.type < 0 || frameValue.type > 20) {
          throw new Error('Incorrect APIC frame picture type')
        }
        invoke(
          _setPictureFrame,
          frameValue.type,
          frameValue.data,
          frameValue.description,
          !!frameValue.useUnicodeEncoding
        )
        break
      }
      case 'TXXX': {
        // user defined text information
        if (
          typeof frameValue !== 'object' ||
          !('description' in frameValue) ||
          !('value' in frameValue)
        ) {
          throw new Error(
            'TXXX frame value should be an object with keys description and value'
          )
        }
        invoke(_setUserStringFrame, frameValue.description, frameValue.value)
        break
      }
      case 'WCOM': // Commercial information
      case 'WCOP': // Copyright/Legal information
      case 'WOAF': // Official audio file webpage
      case 'WOAR': // Official artist/performer webpage
      case 'WOAS': // Official audio source webpage
      case 'WORS': // Official internet radio station homepage
      case 'WPAY': // Payment
      case 'WPUB': {
        // Publishers official webpage
        invoke(_setUrlLinkFrame, frameName, frameValue)
        break
      }
      case 'COMM': {
        // Comments
        frameValue.language = frameValue.language || 'eng'
        if (
          typeof frameValue !== 'object' ||
          !('description' in frameValue) ||
          !('text' in frameValue)
        ) {
          throw new Error(
            'COMM frame value should be an object with keys description and text'
          )
        }
        if (frameValue.language && !frameValue.language.match(/[a-z]{3}/i)) {
          throw new Error(
            'Language must be coded following the ISO 639-2 standards'
          )
        }
        invoke(
          _setCommentFrame,
          frameValue.language,
          frameValue.description,
          frameValue.text
        )
        break
      }
      case 'PRIV': {
        // Private frame
        if (
          typeof frameValue !== 'object' ||
          !('id' in frameValue) ||
          !('data' in frameValue)
        ) {
          throw new Error(
            'PRIV frame value should be an object with keys id and data'
          )
        }
        invoke(_setPrivateFrame, frameValue.id, frameValue.data)
        break
      }
      default: {
        throw new Error(`Unsupported frame ${frameName}`)
      }
    }
  }
}

export function writeBufferID3(buf: Buffer) {
  const originBuffer = buf
  const padding = 4096
  const frames: {
    [x: string]: unknown
    name: string
    size: number
    value: string | Uint8Array
    language: string
    description: string
    id: string
    mimeType: string
  }[] = []

  const invoke = invokeFrame(frames)

  return {
    addTag: addTag(invoke),
    renderBuffer: renderBuffer(frames, padding, originBuffer)
  }
}
