import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'

try {
  const src = 'C:/Users/Admin/.gemini/antigravity-ide/brain/b8b25a14-5904-4f1b-92bd-9065e684af0c/junior_boxer_1791797319231.jpg'
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.resolve('./public/junior_boxer.jpg'))
    fs.copyFileSync(src, path.resolve('./src/assets/junior_boxer.jpg'))
  }
} catch (e) {
  console.error(e)
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})

