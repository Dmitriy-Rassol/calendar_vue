import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve} from 'path'

export default defineConfig({
  plugins: [vue()],
  base: '/',
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
    extensions: ['.vue', '.js', '.ts']
  },
  server: {
    port: 8080,
  },
  build: {
    outDir: 'docs' // измените на другую папку
  }
})