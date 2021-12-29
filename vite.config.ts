import * as path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
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
