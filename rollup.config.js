import buble from 'rollup-plugin-buble'

export default {
  entry: 'src/index.js',
  dest: 'index.js',
  plugins: [ buble() ],
  format: 'cjs',
  external: [ 'react', 'react-router' ]
}
