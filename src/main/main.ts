/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import i18n from 'i18next';

import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { IPC } from './constants';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let currentLanguage: 'en' | 'zh' = 'en';// 主进程 i18n 初始化（默认英文）



if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug').default();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 800,
    minWidth: 800,
    minHeight: 800,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  ipcMain.on(IPC.Channel, async (event, arg) => {
    const msgTemplate = (arg:any) => `IPC test: ${JSON.stringify(arg)}`;

    //arg: { action: string, value: any }
    const {action,value} = arg;
    switch (action) {
      case IPC.Action.pingPong:
        console.log(msgTemplate(arg));
        event.reply(IPC.Channel, msgTemplate('pong'));
        break;
      case IPC.Action.language.init:
      case IPC.Action.language.change:
        currentLanguage = value;
        i18n.changeLanguage(value).then(() => {
          menuBuilder.buildMenu();
          console.log(`Main process language ${action==IPC.Action.language.init?'initialized':'changed'} to: ${value}`);
        });
        break;

      default:
        break;
    }

  });

  // ipcMain.on('init-language', (event, lang: 'en' | 'zh') => {
  //   currentLanguage = lang;
  //   i18n.changeLanguage(lang).then(() => {
  //     menuBuilder.buildMenu();
  //     console.log('Main process language initialized to:', lang);
  //   });
  // });

  // ipcMain.on('language-changed', (event, newLang: 'en' | 'zh') => {
  //   currentLanguage = newLang;
  //   i18n.changeLanguage(newLang).then(() => {
  //     menuBuilder.buildMenu();
  //     console.log('Main process language changed to:', newLang);
  //   });
  // });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
