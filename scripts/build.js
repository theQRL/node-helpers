const { mkdirSync, copyFileSync } = require('node:fs')
const path = require('node:path')

const root = path.join(__dirname, '..')
mkdirSync(path.join(root, 'dist'), { recursive: true })
copyFileSync(path.join(root, 'src/index.js'), path.join(root, 'dist/index.js'))
