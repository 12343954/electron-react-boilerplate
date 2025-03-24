import {
  app,
  Menu,
  shell,
  BrowserWindow,
  MenuItemConstructorOptions,
} from 'electron';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next'; // 仅用于类型支持，主进程不依赖 React
import enTranslation from '../locales/en.json';
import zhTranslation from '../locales/zh.json';

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string;
  submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

const defaultLanguage: 'en' | 'zh' = 'en';
i18n
  .use(initReactI18next) // 仅为类型兼容，实际不依赖 React
  .init({
    resources: {
      en: { translation: enTranslation },
      zh: { translation: zhTranslation }
    },
    lng: defaultLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu(): Menu {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
    }

    const template =
      process.platform === 'darwin'
        ? this.buildDarwinTemplate()
        : this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment(): void {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.webContents.inspectElement(x, y);
          },
        },
      ]).popup({ window: this.mainWindow });
    });
  }

  buildDarwinTemplate(): MenuItemConstructorOptions[] {
    const subMenuAbout: DarwinMenuItemConstructorOptions = {
      label: i18n.t('menu.macOS.label'), // 'Electron',
      submenu: [
        {
          label: i18n.t('menu.macOS.about'), // 'About ElectronReact',
          selector: 'orderFrontStandardAboutPanel:',
        },
        { type: 'separator' },
        {
          label: i18n.t('menu.macOS.services'), // 'Services',
          submenu: [],
        },
        { type: 'separator' },
        {
          label: i18n.t('menu.macOS.hide'), // 'Hide ElectronReact',
          accelerator: 'Command+H',
          selector: 'hide:',
        },
        {
          label: i18n.t('menu.macOS.hideOthers'), // 'Hide Others',
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:',
        },
        {
          label: i18n.t('menu.macOS.showAll'), // 'Show All',
          selector: 'unhideAllApplications:',
        },
        { type: 'separator' },
        {
          label: i18n.t('menu.macOS.quit'), // 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    };
    const subMenuEdit: DarwinMenuItemConstructorOptions = {
      label: i18n.t('menu.edit.label'), // 'Edit',
      submenu: [
        {
          label: i18n.t('menu.edit.undo'), // 'Undo',
          accelerator: 'Command+Z',
          selector: 'undo:',
        },
        {
          label: i18n.t('menu.edit.redo'), // 'Redo',
          accelerator: 'Shift+Command+Z',
          selector: 'redo:',
        },
        { type: 'separator' },
        {
          label: i18n.t('menu.edit.cut'), // 'Cut',
          accelerator: 'Command+X',
          selector: 'cut:',
        },
        {
          label: i18n.t('menu.edit.copy'), // 'Copy',
          accelerator: 'Command+C',
          selector: 'copy:',
        },
        {
          label: i18n.t('menu.edit.paste'), // 'Paste',
          accelerator: 'Command+V',
          selector: 'paste:',
        },
        {
          label: i18n.t('menu.edit.selectAll'), // 'Select All',
          accelerator: 'Command+A',
          selector: 'selectAll:',
        },
      ],
    };
    const subMenuViewDev: MenuItemConstructorOptions = {
      label: i18n.t('menu.view.label'), // 'View',
      submenu: [
        {
          label: i18n.t('menu.view.reload'), // 'Reload',
          accelerator: 'Command+R',
          click: () => {
            this.mainWindow.webContents.reload();
          },
        },
        {
          label: i18n.t('menu.view.toggleFullScreen'), // 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
        {
          label: i18n.t('menu.view.toggleDevTool'), // 'Toggle Developer Tools',
          accelerator: 'Alt+Command+I',
          click: () => {
            this.mainWindow.webContents.toggleDevTools();
          },
        },
      ],
    };
    const subMenuViewProd: MenuItemConstructorOptions = {
      label: i18n.t('menu.view.label'), // 'View',
      submenu: [
        {
          label: i18n.t('menu.view.toggleFullScreen'), // 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
      ],
    };
    const subMenuWindow: DarwinMenuItemConstructorOptions = {
      label: i18n.t('menu.window.label'), // 'Window',
      submenu: [
        {
          label: i18n.t('menu.window.minimize'), // 'Minimize',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:',
        },
        {
          label: i18n.t('menu.file.close'), // 'Close',
          accelerator: 'Command+W',
          selector: 'performClose:',
        },
        { type: 'separator' },
        {
          label: i18n.t('menu.window.bringAllToFront'), // 'Bring All to Front',
          selector: 'arrangeInFront:',
        },
      ],
    };
    const subMenuHelp: MenuItemConstructorOptions = {
      label: i18n.t('menu.help.label'), // 'Help',
      submenu: [
        {
          label: i18n.t('menu.help.learnMore'), // 'Learn More',
          click() {
            shell.openExternal('https://electronjs.org');
          },
        },
        {
          label: i18n.t('menu.help.documentation'), // 'Documentation',
          click() {
            shell.openExternal(
              'https://github.com/electron/electron/tree/main/docs#readme',
            );
          },
        },
        {
          label: i18n.t('menu.help.communityDiscussions'), // 'Community Discussions',
          click() {
            shell.openExternal('https://www.electronjs.org/community');
          },
        },
        {
          label: i18n.t('menu.help.searchIssues'), // 'Search Issues',
          click() {
            shell.openExternal('https://github.com/electron/electron/issues');
          },
        },
      ],
    };

    const subMenuView =
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
        ? subMenuViewDev
        : subMenuViewProd;

    return [subMenuAbout, subMenuEdit, subMenuView, subMenuWindow, subMenuHelp];
  }

  buildDefaultTemplate() {
    const templateDefault = [
      {
        label: i18n.t('menu.file.label'), // '&File',
        submenu: [
          {
            label: i18n.t('menu.file.open'), // '&Open',
            accelerator: 'Ctrl+O',
          },
          {
            label: i18n.t('menu.file.close'), // '&Close',
            accelerator: 'Ctrl+W',
            click: () => {
              this.mainWindow.close();
            },
          },
        ],
      },
      {
        label: i18n.t('menu.view.label'), // '&View',
        submenu:
          process.env.NODE_ENV === 'development' ||
          process.env.DEBUG_PROD === 'true'
            ? [
                {
                  label: i18n.t('menu.view.reload'), // '&Reload',
                  accelerator: 'Ctrl+R',
                  click: () => {
                    this.mainWindow.webContents.reload();
                  },
                },
                {
                  label: i18n.t('menu.view.toggleFullScreen'), // 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen(),
                    );
                  },
                },
                {
                  label: i18n.t('menu.view.toggleDevTool'), // 'Toggle &Developer Tools',
                  accelerator: 'Alt+Ctrl+I',
                  click: () => {
                    this.mainWindow.webContents.toggleDevTools();
                  },
                },
              ]
            : [
                {
                  label: i18n.t('menu.view.toggleFullScreen'), // 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen(),
                    );
                  },
                },
              ],
      },
      {
        label: i18n.t('menu.help.label'), // 'Help',
        submenu: [
          {
            label: i18n.t('menu.help.learnMore'), // 'Learn More',
            click() {
              shell.openExternal('https://electronjs.org');
            },
          },
          {
            label: i18n.t('menu.help.documentation'), // 'Documentation',
            click() {
              shell.openExternal(
                'https://github.com/electron/electron/tree/main/docs#readme',
              );
            },
          },
          {
            label: i18n.t('menu.help.communityDiscussions'), // 'Community Discussions',
            click() {
              shell.openExternal('https://www.electronjs.org/community');
            },
          },
          {
            label: i18n.t('menu.help.searchIssues'), // 'Search Issues',
            click() {
              shell.openExternal('https://github.com/electron/electron/issues');
            },
          },
        ],
      },
    ];

    return templateDefault;
  }
}
