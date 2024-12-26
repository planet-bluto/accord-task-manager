import { defineConfig, UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const config: UserConfig = {
  base: './',
  plugins: [vue()],
  build: {
    outDir: './www',
    emptyOutDir: true
  }
}

// https://vitejs.dev/config/
export default defineConfig(config)