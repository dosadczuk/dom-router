import * as path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'build',
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'DOM-Router',
      fileName: format => `dom-router.${format}.js`,
    },
  },

  resolve: {
    alias: {
      '@router': path.join(__dirname, 'src'),
    },
  },

  // @ts-ignore
  test: {
    environment: 'jsdom',
  },
})
