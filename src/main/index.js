import { app, BrowserWindow } from 'electron';
import path from 'path';
import url from 'url';

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
const isDevelopment = process.env.NODE_ENV !== 'production';

function createWindow() {
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
    window.webContents.openDevTools();
  }

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
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  app.quit();
});
