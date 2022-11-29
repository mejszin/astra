const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const ini = require('ini');

const debug = true;

const title = 'astra';

const width = debug ? 1200 : 800; // (32 * 32);
const height = 480;// (24 * 32);

var config = ini.parse(fs.readFileSync('./data/config.ini', 'utf-8'));

var mainWindow = null;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        title: title,
        width: width,
        height: height,
        useContentSize: true,
    //  icon: path.join(__dirname, "../data/images/carton.png"),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        }
    })
    if (debug) { mainWindow.toggleDevTools() };
//  mainWindow.setAlwaysOnTop(true, 'screen');
    mainWindow.setMenuBarVisibility(false);
    mainWindow.loadFile('html/login.html');
    mainWindow.on('close', async function() {
        console.log("Closing");
    });
}

app.whenReady().then(() => {
    createWindow();
    mainWindow.setSize(width, height);
})

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') {
        app.quit();
    }
});