import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss(), '@tailwindcss/line-clamp',],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // ✅ Esto permite usar @ como alias de src/
    },
  },
})
// https://vitejs.dev/config/