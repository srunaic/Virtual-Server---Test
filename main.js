const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 650,
        frame: false,
        resizable: false,
        show: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'launcher.html'));

    // Send version to UI
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('app-version', app.getVersion());
    });

    // Check for updates after window is ready
    mainWindow.once('ready-to-show', () => {
        if (app.isPackaged) {
            autoUpdater.checkForUpdatesAndNotify();
        } else {
            mainWindow.webContents.send('update-status', '개발 모드: 업데이트 기능을 패키징 후에 테스트 가능합니다.');
        }
    });
}

// Auto Updater Event Listeners
autoUpdater.on('checking-for-update', () => {
    mainWindow.webContents.send('update-status', '업데이트 확인 중...');
});

autoUpdater.on('update-available', (info) => {
    mainWindow.webContents.send('update-status', `새로운 업데이트 발견: v${info.version}`);
});

autoUpdater.on('update-not-available', (info) => {
    mainWindow.webContents.send('update-status', '최신 버전입니다.');
});

autoUpdater.on('error', (err) => {
    console.error('Update Error:', err);
    if (!app.isPackaged) {
        mainWindow.webContents.send('update-status', '개발 환경: 업데이트 체크 스킵 (패키징 후 작동)');
    } else {
        mainWindow.webContents.send('update-status', `업데이트 오류: ${err.message.substring(0, 30)}...`);
    }
});

autoUpdater.on('download-progress', (progressObj) => {
    mainWindow.webContents.send('update-progress', progressObj.percent);
});

autoUpdater.on('update-downloaded', (info) => {
    mainWindow.webContents.send('update-status', '업데이트 완료! 런처를 재시작합니다.');
    setTimeout(() => {
        autoUpdater.quitAndInstall();
    }, 2000);
});

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
