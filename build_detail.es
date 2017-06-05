require('babel-register')(require('./babel.config'))
const path = require('path-extra')
const Promise = require('bluebird')
const {promisify} = Promise
const fs = Promise.promisifyAll(require('fs-extra'))
const request = Promise.promisifyAll(require('request'))
const requestAsync = promisify(request, {multiArgs: true})
const child_process = require('child_process')
const unzip = require('node-unzip-2')

const {log} = require('./src/lib/utils')

const USE_GITHUB_FLASH_MIRROR = false

const BUILD_DIR_NAME = 'build'
const DOWNLOADDIR_NAME = 'download'

const getFlashUrl = (platform) =>
  USE_GITHUB_FLASH_MIRROR
  ? `https://github.com/dkwingsmt/PepperFlashFork/releases/download/latest/${platform}.zip`
  : `http://7xj6zx.com1.z0.glb.clouddn.com/poi/PepperFlash/${platform}.zip`

const extractZipNodeAsync = (zipFile, destPath, descript="") => {
  log(`Extract ${descript}`)
  return new Promise((resolve) => {
    fs.ensureDirSync(path.dirname(destPath))
    fs.createReadStream(zipFile)
    .pipe(unzip.Extract({ path: destPath }))
    .on('close', () => {
      log(`Extracting ${descript} finished`)
      return resolve()
    })
  })
}

const extractZipCliAsync = (zipFile, destPath, descript="") => {
  log(`Extract ${descript}`)
  fs.ensureDirSync(destPath)
  return new Promise ((resolve, reject) => {
    const command = `unzip '${zipFile}'`
    child_process.exec(command, {
      cwd: destPath,
    },
      (error) => {
        if (error != null) {
          return reject(error)
        } else {
          log(`Extracting ${descript} finished`)
          return resolve()
        }
      }
    )
  })
}

const downloadAsync = async (url, destDir, filename = path.basename(url), description) => {
  log(`Downloading ${description} from ${url}`)
  await fs.ensureDirAsync(destDir)
  const destPath = path.join(destDir, filename)
  try {
    await fs.accessAsync(destPath, fs.R_OK)
    log(`Use existing ${destPath}`)
  }catch (e) {
    const [response, body] = await requestAsync({
      url: url,
      encoding: null,
    })
    if (response.statusCode != 200) {
      throw new Error(`Response status code ${response.statusCode}`)
    }
    await fs.writeFileAsync(destPath, body)
    log(`Successfully downloaded to ${destPath}`)
  }
  return destPath
}

const PLATFORM_TO_PATHS = {
  'win32-ia32': 'win-ia32',
  'win32-x64': 'win-x64',
  'darwin-x64': 'mac-x64',
  'linux-x64': 'linux-x64',
}

const extractZipAsync =
  process.platform == 'win32'
  ? extractZipNodeAsync
  : extractZipCliAsync

const downloadExtractZipAsync = async (url, downloadDir, filename, destPath,
                                 description, useCli) => {
  const MAX_RETRY = 5
  let zipPath
  try {
    zipPath = await downloadAsync(url, downloadDir, filename, description)
    await extractZipAsync(zipPath, destPath, description)
    } catch (e) {
    log(`Downloading failed, retrying ${url}, reason: ${e}`)
    await fs.removeAsync(zipPath)
  }
}

const installFlashAsync = async (platform, downloadDir, flashDir) => {
  const flash_url = getFlashUrl(platform)
  await downloadExtractZipAsync(flash_url, downloadDir, `flash-${platform}.zip`, flashDir, 'flash plugin')
}

export const getFlashAsync = async (dmmVersion) => {
  const BUILD_ROOT = path.join(__dirname, BUILD_DIR_NAME)
  const downloadDir = path.join(BUILD_ROOT, DOWNLOADDIR_NAME)
  const platform = `${process.platform}-${process.arch}`
  await fs.removeAsync(path.join(__dirname, 'pepper_flash'))
  const flashDir = path.join(__dirname, 'pepper_flash', PLATFORM_TO_PATHS[platform])
  await installFlashAsync(platform, downloadDir, flashDir)
}
