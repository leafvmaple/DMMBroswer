require('coffee-script/register')
require('babel-register')(require('./babel.config'))
const gulp = require('gulp')

const {log} = require('./lib/utils')
const {installThemeAsync, getFlashAsync} = require('./build_detail')

const package_json = require('./package.json')

let dmmVersion = null

gulp.task('getVersion', () => {
  const package_version = package_json.version
  dmmVersion = package_version
  log(`*** Start building DMMBroswer ${dmmVersion} ***`)
})

gulp.task ('deploy', ['getVersion', 'get_flash'], async() => {
  await installThemeAsync(dmmVersion)
})

gulp.task('get_flash', ['getVersion'], async() => {
  await getFlashAsync(dmmVersion)
})

gulp.task('default', async() =>{
  const _gulp = 'gulp'
  log("Usage:")
  log(`  ${_gulp} build         - Build release complete packages under ./dist/`)
  log(`  ${_gulp} build_plugins - Pack up latest plugin tarballs under ./dist/`)
})
