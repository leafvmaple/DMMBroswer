const { app, BrowserWindow, Tray } = require('electron');
const path = require('path-extra');

global.ROOT = __dirname;
global.DMM_VERSION = app.getVersion();
global.EXECROOT = path.join(process.execPath, '..');
global.APPDATA_PATH = path.join(app.getPath('appData'), 'DMMBroswer');
global.WEBROOT = path.join(global.ROOT, '..');
global.EXROOT = global.APPDATA_PATH;
global.DEFAULT_CACHE_PATH = path.join(global.EXROOT, 'MyCache');
global.MODULE_PATH = path.join(global.WEBROOT, 'node_modules');

const config = require('./lib/config');
const proxy = require('./lib/proxy');

const iconPath = path.join(global.ROOT, 'assets', 'icons', 'flower.jpg');

proxy.setMaxListeners(30);

if (config.get('dmm.disableHA', false)) {
  app.disableHardwareAcceleration();
}

require('./lib/flash');

let mainWindow = null;
global.mainWindow = null;

app.on('window-all-closed', () => {
  app.quit();
});

app.on('ready', () => {
  const { screen } = require('electron');
  const { workArea } = screen.getPrimaryDisplay();
  let {
    x, y, width, height,
  } = config.get('dmm.window', workArea);
  const validate = (n, min, range) => (n != null && n >= min && n < min + range);
  const withinDisplay = (d) => {
    const wa = d.workArea;
    return validate(x, wa.x, wa.width) && validate(y, wa.y, wa.height);
  };
  if (!screen.getAllDisplays().some(withinDisplay)) {
    x = workArea.x;
    y = workArea.y;
  }
  if (width == null) {
    width = workArea.width;
  }
  if (height == null) {
    height = workArea.height;
  }
  global.mainWindow = mainWindow = new BrowserWindow({
    x: x,
    y: y,
    width: width,
    height: height,
    title: 'FlowerKnight',
    icon: iconPath,
    resizable: config.get('dmm.content.resizeable', true),
    alwaysOnTop: config.get('dmm.content.alwaysOnTop', false),
    titleBarStyle: 'hidden',
  });
  mainWindow.loadURL(`file://${global.WEBROOT}/index.html`);
  if (config.get('dmm.window.isFullScreen', false)) {
    mainWindow.setFullScreen(true);
  }
  mainWindow.webContents.on('will-navigate', (e) => {
    e.preventDefault();
  });
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  if (process.platform === 'win32' || process.platform === 'linux') {
    global.appIcon = new Tray(iconPath);
    global.appIcon.on('click', () => {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      } else {
        mainWindow.show();
      }
    });
  }
});
