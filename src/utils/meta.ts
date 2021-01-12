interface ObjectString {
  [x: string]: string
}

export const basicMetadata = ({ title, artist, pic, audio }: ObjectString) => {
  const itemprop: ObjectString = {
    name: title,
    description: artist,
    image: pic,
    'og:title': title,
    'og:type': 'audio',
    'og:image': pic,
    'og:audio': audio,
    'og:description': artist,
    'og:locale': 'zh-cn'
  }

  Object.keys(itemprop).forEach(item => {
    const prop = item.includes('og:') ? 'property' : 'itemprop'
    let meta = document.querySelector(
      `meta[${prop}="${item}"]`
    ) as HTMLMetaElement
    if (!meta) {
      meta = document.createElement('meta')
      document.head.appendChild(meta)
    }
    meta.setAttribute(prop, item)
    meta.content = itemprop[item]
  })
}
