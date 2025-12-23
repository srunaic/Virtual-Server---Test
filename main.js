const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 650,
        frame: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false // For ease of communication in this demo, but usually not recommended for production
        },
        icon: path.join(__dirname, 'launcher_bg.jpg') // Temporary icon
    });

    win.loadFile('launcher.html');

    // Optional: win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// IPC handlers for launcher features
ipcMain.on('open-folder', (event, folderPath) => {
    shell.openPath(folderPath || __dirname);
});

ipcMain.on('close-app', () => {
    app.quit();
});
