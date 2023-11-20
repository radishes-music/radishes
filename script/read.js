const glob = require('glob')

glob('public/**/*.wav', (err, paths) => {
  const r = paths
    .map(path => path.replace('public/audio-effect/', ''))
    .map(file => file.replace('.wav', ''))
    .map(file => `'${file}'`)
    .join(',')

  console.log(r)
})
