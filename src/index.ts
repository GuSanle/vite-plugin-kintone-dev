import { ResolvedConfig, type Plugin, ConfigEnv, UserConfig } from 'vite'
import type { OutputOptions, PreRenderedAsset } from 'rollup'
import { devUpdate, devFileName } from './devUpdate'
import path from 'node:path'
import fs from 'node:fs'
import kintoneModuleInject from './kintoneModuleInject'
import getServerInfo from './getServerInfo'
import getIndexScripts from './getIndexScripts'
import { validateEnv, checkEnv } from './getEnvInfo'
import getEntry from './getEntry'
import getDirFiles from './getDirFiles'
import { TypeInput } from 'kintone-types'

/**
 * 为Kintone开发创建Vite插件
 * @param options 插件配置选项
 * @returns Vite插件数组
 */
export default function kintoneDev(options?: TypeInput): Plugin[] {
  let viteConfig: ResolvedConfig
  let envConfig: ConfigEnv

  return [
    {
      name: 'vite-plugin-kintone-dev:dev',
      apply: 'serve',
      enforce: 'post',
      config: (config, env) => {
        envConfig = env

        // 自动添加server配置，如果用户没有提供
        if (!config.server) {
          config.server = {}
        }

        // 设置host为127.0.0.1，如果未指定
        if (!config.server.host) {
          config.server.host = '127.0.0.1'
        }

        // 确保启用CORS
        if (config.server.cors === undefined) {
          config.server.cors = true
        }

        // 默认不启用HTTPS，除非用户显式配置
        // 这样用户可以根据需要自己设置HTTPS
        // 如果需要HTTPS，推荐使用如下配置：
        // https: {
        //   cert: fs.readFileSync('path/to/cert.pem'),
        //   key: fs.readFileSync('path/to/key.pem')
        // }

        return config
      },
      async configResolved(config) {
        await checkEnv(envConfig, config)
        viteConfig = config
      },
      configureServer(server) {
        server.httpServer?.once('listening', async () => {
          const { isEnvOk, env } = validateEnv(envConfig, viteConfig)
          if (!isEnvOk) {
            console.log('Environment configuration error, please check your .env file')
            return
          }
          const devServerUrl = getServerInfo(server)
          if (!server.config.server.origin) {
            server.config.server.origin = devServerUrl
          }
          const outputDir = path.resolve(viteConfig.build.outDir)
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true })
          }
          const scriptList = getIndexScripts()
          const fileUrl = path.resolve(outputDir, devFileName)

          fs.writeFileSync(fileUrl, kintoneModuleInject(devServerUrl, scriptList, env.VITE_KINTONE_REACT === 'true'))

          try {
            const result = await devUpdate(env, [fileUrl])
            console.log('Development mode: Module injection script uploaded successfully')
            fs.unlinkSync(fileUrl)
            return result
          } catch (error) {
            console.error('Development mode: Upload failed', error)
            fs.unlinkSync(fileUrl)
          }
        })
      },
    },
    {
      name: 'vite-plugin-kintone-dev:build',
      apply: 'build',
      enforce: 'post',
      config(config, env) {
        envConfig = env
        const entry = getEntry(config)

        // 配置构建选项
        config.build = {
          ...config.build,
          modulePreload: { polyfill: false },
          manifest: true,
          cssCodeSplit: false,
          rollupOptions: {
            ...config.build?.rollupOptions,
            input: entry,
            output: {
              ...config.build?.rollupOptions?.output,
              format: 'iife',
            },
          },
        }

        // 处理自定义输出文件名
        if (options?.outputName !== undefined) {
          const output = config.build.rollupOptions?.output as OutputOptions
          output.entryFileNames = `${options?.outputName}.js`
          output.assetFileNames = (assetInfo: PreRenderedAsset): string => {
            if (assetInfo.name?.endsWith('.css')) {
              return `${options?.outputName}[extname]`
            } else {
              return assetInfo.name as string
            }
          }
        }

        return config
      },
      async configResolved(config) {
        await checkEnv(envConfig, config)
        viteConfig = config
      },
      async closeBundle() {
        const outputDir = path.resolve(viteConfig.build.outDir)
        const extList = ['js', 'css']
        const fileList = getDirFiles(outputDir, extList)
        const { isEnvOk, env } = validateEnv(envConfig, viteConfig)

        if (isEnvOk) {
          if (options?.upload) {
            try {
              await devUpdate(env, fileList)
              console.log('Build mode: Build files uploaded successfully')
            } catch (error) {
              console.error('Build mode: Upload failed', error)
            }
          }
        } else {
          console.error('Environment configuration error, please check your .env file')
        }
      },
    },
  ]
}
