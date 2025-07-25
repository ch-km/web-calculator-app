import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // '/api' から始まるパスへのリクエストは、
      // 下の target に指定したサーバーへ転送する
      '/api': {
        target: 'http://localhost:5001', // Flaskサーバーのアドレス
        changeOrigin: true,
      }
    }
  }
})
