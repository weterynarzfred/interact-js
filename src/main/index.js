import { app, BrowserWindow, ipcMain, shell } from 'electron';
import path from 'path';
import url from 'url';
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} from 'electron-devtools-installer';
import fetch from 'node-fetch';
import fs from 'fs';

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
const isDevelopment = process.env.NODE_ENV !== 'production';

const installExtensions = async () => {
  if (isDevelopment) {
    [REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS].forEach(extension => {
      installExtension(extension)
        .then(name => console.log(`Added Extension: ${name}`))
        .catch(err => console.log('An error occurred: ', err));
    });
  }
};

async function createWindow() {
  const window = new BrowserWindow({
    width: 1935,
    height: 1080,
    y: 0,
    x: 1910,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      worldSafeExecuteJavaScript: true,
    },
  });
  window.removeMenu();

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
  await new Promise((resolve, reject) => {
    res.body.pipe(fileStream);
    res.body.on('error', reject);
    fileStream.on('finish', resolve);
  });
  event.reply(`downloadFile-${arg.requestId}`, true);
});
