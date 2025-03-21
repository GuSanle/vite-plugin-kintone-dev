import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import kintoneDev from 'vite-plugin-kintone-dev'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import fs from 'node:fs'
import path from 'node:path'

// Certificate path
const certDir = path.resolve(__dirname, 'certs')
const hasCerts =
  fs.existsSync(path.join(certDir, 'localhost+1.pem')) && fs.existsSync(path.join(certDir, 'localhost+1-key.pem'))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    kintoneDev({
      outputName: 'mobile',
      upload: true,
    }),
    // Auto register components
    Components({
      resolvers: [IconsResolver()],
    }),
    // Handle icons
    Icons({
      autoInstall: true,
      customCollections: {
        // Custom icon collection from assets directory
        'my-icons': FileSystemIconLoader('./src/assets'),
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // The plugin will automatically configure server settings, but you can customize as needed
  server: {
    // Conditionally enable HTTPS if certificates exist
    ...(hasCerts
      ? {
          https: {
            cert: fs.readFileSync(path.join(certDir, 'localhost+1.pem')),
            key: fs.readFileSync(path.join(certDir, 'localhost+1-key.pem')),
          },
        }
      : {}),
  },
})
