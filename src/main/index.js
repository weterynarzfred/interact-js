import { app, BrowserWindow, ipcMain, shell } from 'electron';
import path from 'path';
import url from 'url';
import fetch from 'node-fetch';
import fs from 'fs';

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
const isDevelopment = process.env.NODE_ENV !== 'production';

const installExtensions = async () => {
  const {
    default: installExtension,
    REACT_DEVELOPER_TOOLS,
    REDUX_DEVTOOLS,
  } = require('electron-devtools-installer');
  if (isDevelopment) {
    [REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS].forEach(extension => {
      installExtension(extension)
        .then(name => console.log(`Added Extension: ${name}`))
        .catch(err => console.log('An error occurred: ', err));
    });
  }
};

async function createWindow() {
  const windowSetting = {
    show: false,
    backgroundColor: '#222222',
    width: 1280,
    height: 720,
    title: 'Interact JS',
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      worldSafeExecuteJavaScript: true,
    },
  };
  if (isDevelopment) {
    windowSetting.width = 1936;
    windowSetting.height = 1088;
    windowSetting.y = 0;
    windowSetting.x = 1910;
  }
  const window = new BrowserWindow(windowSetting);
  window.removeMenu();

  window.once('ready-to-show', () => {
    window.show();
  });

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    window.loadURL(
      url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true,
      })
    );
  }

  return window;
}

app.on('ready', async () => {
  const window = await createWindow();
  installExtensions().catch(console.log);

  if (isDevelopment) {
    window.webContents.openDevTools();
  }

  window.webContents.on('new-window', (e, url) => {
    e.preventDefault();
    shell.openExternal(url);
  });
});

app.on('window-all-closed', () => {
  app.quit();
});

ipcMain.on('fetch', async (event, arg) => {
  const response = await fetch(arg.url, {
    mode: 'no-cors',
  });
  const data = await response.text();
  event.reply(`fetch-${arg.requestId}`, data);
});

ipcMain.on('downloadFile', async (event, arg) => {
  const res = await fetch(arg.url);
  const fileStream = fs.createWriteStream(arg.dest);
  console.log(arg);
  await new Promise((resolve, reject) => {
    res.body.pipe(fileStream);
    res.body.on('error', reject);
    fileStream.on('finish', resolve);
  });
  event.reply(`downloadFile-${arg.requestId}`, true);
});
