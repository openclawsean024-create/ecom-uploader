import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    environment: 'jsdom', globals: true, setupFiles: [],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache', 'tests/e2e.test.tsx'],
  },
})
