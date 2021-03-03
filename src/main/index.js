import { app, BrowserWindow } from 'electron';
import path from 'path';
import url from 'url';
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} from 'electron-devtools-installer';

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
const isDevelopment = process.env.NODE_ENV !== 'production';

const installExtensions = async () => {
  if (isDevelopment) {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then(name => console.log(`Added Extension:  ${name}`))
      .catch(err => console.log('An error occurred: ', err));
    installExtension(REDUX_DEVTOOLS)
      .then(name => console.log(`Added Extension:  ${name}`))
      .catch(err => console.log('An error occurred: ', err));
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
  await installExtensions().catch(console.log);
  const window = await createWindow();

  if (isDevelopment) {
    window.webContents.openDevTools();
  }
});

app.on('window-all-closed', () => {
  app.quit();
});
