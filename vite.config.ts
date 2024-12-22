import { defineConfig, UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const config: UserConfig = {
  plugins: [vue()],
  build: {
    outDir: './www',
    emptyOutDir: true
  },
  optimizeDeps: {
    exclude: [
      "sequelize"
    ]
  }
}

// https://vitejs.dev/config/
export default defineConfig(config)
