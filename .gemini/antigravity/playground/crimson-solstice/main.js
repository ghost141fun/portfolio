const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        frame: false, // Borderless
        transparent: true, // Transparent background support
        alwaysOnTop: true, // J.A.R.V.I.S. is always there
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('index.html');

    // ── Hot Reload (Live Synchronization) ───────────────────────────────────
    let reloadTimeout;
    const projectDir = __dirname;

    fs.watch(projectDir, { recursive: true }, (eventType, filename) => {
        if (filename && (filename.endsWith('.html') || filename.endsWith('.css') || filename.endsWith('.js'))) {
            if (reloadTimeout) clearTimeout(reloadTimeout);
            reloadTimeout = setTimeout(() => {
                console.log(`Synchronizing... File change detected: ${filename}`);
                if (mainWindow) mainWindow.reload();
            }, 100);
        }
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
