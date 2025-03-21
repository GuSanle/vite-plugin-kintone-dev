import kintoneApi from './kintoneApi'
import path from 'node:path'
import type { Type, EnvSetting, JsList } from 'kintone-types'

export const devFileName = 'vite_plugin_kintone_dev_module_hack.js'

/**
 * 确保URL带有协议前缀
 * @param url 输入URL
 * @returns 带有协议前缀的URL
 */
function formatUrlWithProtocol(url: string): string {
  if (url.toLowerCase().startsWith('http://') || url.toLowerCase().startsWith('https://')) {
    return url
  }
  return `https://${url}`
}

/**
 * 检查环境变量配置是否有效
 * @param env 环境变量对象
 * @returns 配置是否有效
 */
function validateEnvironment(env: unknown): boolean {
  // 使用类型断言
  const envConfig = env as Partial<EnvSetting>

  // 检查必需的环境变量
  if (
    typeof envConfig.VITE_KINTONE_URL !== 'string' ||
    typeof envConfig.VITE_KINTONE_USER_NAME !== 'string' ||
    typeof envConfig.VITE_KINTONE_PASSWORD !== 'string' ||
    (envConfig.VITE_KINTONE_PLATFORM !== 'APP' && envConfig.VITE_KINTONE_PLATFORM !== 'PORTAL') ||
    (envConfig.VITE_KINTONE_TYPE !== 'DESKTOP' && envConfig.VITE_KINTONE_TYPE !== 'MOBILE')
  ) {
    return false
  }

  // 检查APP模式下的应用ID
  if (
    envConfig.VITE_KINTONE_PLATFORM === 'APP' &&
    (envConfig.VITE_KINTONE_APP === undefined || typeof envConfig.VITE_KINTONE_APP !== 'string')
  ) {
    return false
  }

  return true
}

/**
 * 更新Kintone自定义文件
 * @param env 环境变量对象
 * @param fileList 文件路径列表
 * @returns Promise<void>
 */
export const devUpdate = async (env: unknown, fileList: string[]): Promise<void> => {
  if (!validateEnvironment(env)) {
    throw new Error('环境配置无效，请检查您的.env文件')
  }

  const envConfig = env as EnvSetting
  const {
    VITE_KINTONE_URL: url,
    VITE_KINTONE_USER_NAME: username,
    VITE_KINTONE_PASSWORD: password,
    VITE_KINTONE_APP: app,
    VITE_KINTONE_PLATFORM: platform,
    VITE_KINTONE_TYPE: type,
  } = envConfig

  const kintoneClient = new kintoneApi(formatUrlWithProtocol(url), username, password)

  try {
    // 准备文件信息
    const fileDetails = fileList.map((filePath) => ({
      path: filePath,
      name: path.basename(filePath),
    }))

    // 上传文件
    const uploadResults = await Promise.all(
      fileDetails.map(({ path: filePath, name }) => kintoneClient.uploadFile(filePath, name)),
    )

    // 初始化JS文件列表
    const jsList: JsList = {
      DESKTOP: [],
      MOBILE: [],
      DESKTOP_CSS: [],
      MOBILE_CSS: [],
    }

    // 为上传的文件分配正确的类型
    uploadResults.forEach((result, index) => {
      const { fileKey } = result
      const fileName = fileDetails[index].name
      const fileExt = path.extname(fileName).slice(1).toLowerCase()

      // 处理文件类型
      let fileType: Type
      if (fileExt === 'js') {
        fileType = type as Type // DESKTOP 或 MOBILE
      } else {
        // CSS文件
        fileType = (type === 'DESKTOP' ? 'DESKTOP_CSS' : 'MOBILE_CSS') as Type
      }

      jsList[fileType].push(fileKey)
    })

    // 获取现有的自定义设置
    let customSetting
    let appName = ''

    if (platform === 'PORTAL') {
      customSetting = await kintoneClient.getSystemSetting()
    } else if (app) {
      const appInfo = await kintoneClient.getAppInfo(app)
      appName = appInfo.name
      customSetting = await kintoneClient.getAppSetting(app)
    } else {
      throw new Error('环境设置错误：APP模式下需要应用ID')
    }

    const { scripts, scope } = customSetting.result

    // 保留现有配置中与新上传文件不重复的部分
    const uploadedFileNames = fileDetails.map((file) => file.name)

    scripts.forEach((setting) => {
      const { locationType, type: settingType, name, contentUrl, contentId } = setting

      if (locationType === 'URL') {
        // 保留URL类型的脚本
        jsList[settingType as Type].push(contentUrl)
      } else if (locationType === 'BLOB') {
        // 保留不重名且非开发模式临时文件的已上传脚本
        if (!uploadedFileNames.includes(name) && name !== devFileName) {
          jsList[settingType as Type].push(contentId)
        }
      }
    })

    // 准备更新的文件配置
    const jsFiles = [
      { jsType: 'DESKTOP', fileKeys: jsList['DESKTOP'] },
      { jsType: 'MOBILE', fileKeys: jsList['MOBILE'] },
      { jsType: 'DESKTOP_CSS', fileKeys: jsList['DESKTOP_CSS'] },
      { jsType: 'MOBILE_CSS', fileKeys: jsList['MOBILE_CSS'] },
    ]

    // 更新系统设置
    if (platform === 'PORTAL') {
      await kintoneClient.updateSystemSetting(scope, jsFiles)
    } else if (app) {
      await kintoneClient.updateAppSetting(app, scope, jsFiles, appName)
      await kintoneClient.deploySetting(app)
    }

    return
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)

    throw new Error(`上传失败: ${errorMessage}`)
  }
}
