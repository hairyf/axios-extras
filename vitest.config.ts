import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    testTimeout: 10000,
    server: {
      deps: {
        inline: ['vitest-package-exports'],
      },
    },
  },
})
