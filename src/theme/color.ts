export function shadeHexColor(color: string, percent: number) {
  const f = parseInt(color.slice(1), 16),
    t = percent < 0 ? 0 : 255,
    p = percent < 0 ? percent * -1 : percent,
    R = f >> 16,
    G = (f >> 8) & 0x00ff,
    B = f & 0x0000ff
  return (
    '#' +
    (
      0x1000000 +
      (Math.round((t - R) * p) + R) * 0x10000 +
      (Math.round((t - G) * p) + G) * 0x100 +
      (Math.round((t - B) * p) + B)
    )
      .toString(16)
      .slice(1)
  )
}

export function shadeRGBColor(color: string, percent: number) {
  const f = color.split(','),
    t = percent < 0 ? 0 : 255,
    p = percent < 0 ? percent * -1 : percent,
    R = parseInt(f[0].slice(4)),
    G = parseInt(f[1]),
    B = parseInt(f[2])
  return (
    'rgb(' +
    (Math.round((t - R) * p) + R) +
    ',' +
    (Math.round((t - G) * p) + G) +
    ',' +
    (Math.round((t - B) * p) + B) +
    ')'
  )
}

export function shade(color: string, percent: number) {
  if (color.length > 7) return shadeRGBColor(color, percent)
  else return shadeHexColor(color, percent)
}

export function getAverageRGB(
  src: string
): Promise<{ r: number; g: number; b: number }> {
  const blockSize = 5,
    defaultRGB = { r: 0, g: 0, b: 0 },
    canvas = document.createElement('canvas'),
    context = canvas.getContext && canvas.getContext('2d'),
    rgb = { r: 0, g: 0, b: 0 }

  let data,
    width,
    height,
    length,
    count = 0,
    i = -4

  const image = new Image()
  image.src = src
  image.crossOrigin = 'anonymous'

  return new Promise(resolve => {
    if (!context) {
      return resolve(defaultRGB)
    }

    image.onload = () => {
      height = canvas.height =
        image.naturalHeight || image.offsetHeight || image.height
      width = canvas.width =
        image.naturalWidth || image.offsetWidth || image.width

      context.drawImage(image, 0, 0)

      try {
        data = context.getImageData(0, 0, width, height)
      } catch (e) {
        return resolve(defaultRGB)
      }

      length = data.data.length

      while ((i += blockSize * 4) < length) {
        ++count
        rgb.r += data.data[i]
        rgb.g += data.data[i + 1]
        rgb.b += data.data[i + 2]
      }

      // ~~ used to floor values
      rgb.r = ~~(rgb.r / count)
      rgb.g = ~~(rgb.g / count)
      rgb.b = ~~(rgb.b / count)

      resolve(rgb)
    }
  })
}
