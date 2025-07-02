// const { app, BrowserWindow, Menu } = require('electron');
// const path = require('node:path');

// // Handle creating/removing shortcuts on Windows when installing/uninstalling.
// if (require('electron-squirrel-startup')) {
//   app.quit();
// }

// const createWindow = () => {
//   // Create the browser window.
//   const mainWindow = new BrowserWindow({
//     width: 367,
//     height: 490,
//     webPreferences: {
//       preload: path.join(__dirname, 'preload.js'),
//     },
//     autoHideMenuBar: true,
//   });

//   Menu.setApplicationMenu(null);

//   // and load the index.html of the app.
//   mainWindow.loadFile(path.join(__dirname, 'index.html'));

//   // Open the DevTools.
//   mainWindow.webContents.openDevTools();
// };

// // This method will be called when Electron has finished
// // initialization and is ready to create browser windows.
// // Some APIs can only be used after this event occurs.
// app.whenReady().then(() => {
//   createWindow();

//   // On OS X it's common to re-create a window in the app when the
//   // dock icon is clicked and there are no other windows open.
//   app.on('activate', () => {
//     if (BrowserWindow.getAllWindows().length === 0) {
//       createWindow();
//     }
//   });
// });

// // Quit when all windows are closed, except on macOS. There, it's common
// // for applications and their menu bar to stay active until the user quits
// // explicitly with Cmd + Q.
// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });

// // In this file you can include the rest of your app's specific main process
// // code. You can also put them in separate files and import them here.


const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('node:path');
const fs = require('fs');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 367,
    height: 490,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    autoHideMenuBar: true,
  });

  Menu.setApplicationMenu(null);

  // Load your main HTML file.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Optional: open DevTools (you can remove this for final build)
  // mainWindow.webContents.openDevTools();
};

// Called when Electron is ready
app.whenReady().then(() => {
  createWindow();

  // 🔥 IPC handler to get songs from the user's default Music folder
  ipcMain.handle('get-music-playlist', () => {
    const musicFolder = app.getPath('music'); // Gets C:/Users/<name>/Music
    const files = fs.readdirSync(musicFolder);

    const audioFiles = files.filter(file =>
      file.endsWith('.mp3') || file.endsWith('.wav') || file.endsWith('.ogg')
    );

    return audioFiles.map(file => ({
      name: path.parse(file).name,
      file: path.join(musicFolder, file)
    }));
  });

  // macOS: re-create window when clicking dock icon
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit app when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
