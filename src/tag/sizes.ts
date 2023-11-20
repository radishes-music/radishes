export function getNumericFrameSize(frameSize: number) {
  const headerSize = 10
  const encodingSize = 1

  return headerSize + encodingSize + frameSize
}

export function getStringFrameSize(frameSize: number) {
  const headerSize = 10
  const encodingSize = 1
  const bomSize = 2
  const frameUtf16Size = frameSize * 2

  return headerSize + encodingSize + bomSize + frameUtf16Size
}

export function getLyricsFrameSize(
  descriptionSize: number,
  lyricsSize: number
) {
  const headerSize = 10
  const encodingSize = 1
  const languageSize = 3
  const bomSize = 2
  const descriptionUtf16Size = descriptionSize * 2
  const separatorSize = 2
  const lyricsUtf16Size = lyricsSize * 2

  return (
    headerSize +
    encodingSize +
    languageSize +
    bomSize +
    descriptionUtf16Size +
    separatorSize +
    bomSize +
    lyricsUtf16Size
  )
}

export function getPictureFrameSize(
  pictureSize: number,
  mimeTypeSize: number,
  descriptionSize: number,
  useUnicodeEncoding: boolean
) {
  const headerSize = 10
  const encodingSize = 1
  const separatorSize = 1
  const pictureTypeSize = 1
  const bomSize = 2
  const encodedDescriptionSize = useUnicodeEncoding
    ? bomSize + (descriptionSize + separatorSize) * 2
    : descriptionSize + separatorSize

  return (
    headerSize +
    encodingSize +
    mimeTypeSize +
    separatorSize +
    pictureTypeSize +
    encodedDescriptionSize +
    pictureSize
  )
}

export function getCommentFrameSize(descriptionSize: number, textSize: number) {
  const headerSize = 10
  const encodingSize = 1
  const languageSize = 3
  const bomSize = 2
  const descriptionUtf16Size = descriptionSize * 2
  const separatorSize = 2
  const textUtf16Size = textSize * 2

  return (
    headerSize +
    encodingSize +
    languageSize +
    bomSize +
    descriptionUtf16Size +
    separatorSize +
    bomSize +
    textUtf16Size
  )
}

export function getPrivateFrameSize(idSize: number, dataSize: number) {
  const headerSize = 10
  const separatorSize = 1

  return headerSize + idSize + separatorSize + dataSize
}

export function getUserStringFrameSize(
  descriptionSize: number,
  valueSize: number
) {
  const headerSize = 10
  const encodingSize = 1
  const bomSize = 2
  const descriptionUtf16Size = descriptionSize * 2
  const separatorSize = 2
  const valueUtf16Size = valueSize * 2

  return (
    headerSize +
    encodingSize +
    bomSize +
    descriptionUtf16Size +
    separatorSize +
    bomSize +
    valueUtf16Size
  )
}

export function getUrlLinkFrameSize(urlSize: number) {
  const headerSize = 10

  return headerSize + urlSize
}
