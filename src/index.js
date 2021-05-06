const { app, BrowserWindow } = require('electron');
const { autoUpdater } = require("electron-updater");
const log = require('electron-log');
const path = require('path');

let updateWin;

function sendStatusToWindow(text){
  updateWin.webContents.send("message", text);
}

function createDefaultupdateWindow(){
  updateWin = new BrowserWindow({
    backgroundColor:"#eeeeee",
    webPreferences: { nodeIntegration:true},
  });
  updateWin.on("closed", () => {
    updateWin = null;
  });
  updateWin.loadURL('file://${__dirname}/version.html#v${app.getVersion()}');
  return updateWin;
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
};

/* update 관련 */
autoUpdater.on('checking-for-update', () => {
  log.info('업데이트 확인 중...');
  console.log('업데이트 확인 중...');
  sendStatusToWindow("checking for update...");
});
autoUpdater.on('update-available', (info) => {
  log.info('업데이트가 가능합니다.');
  console.log('업데이트가 가능합니다.');
  sendStatusToWindow("checking available...");
});
autoUpdater.on('update-not-available', (info) => {
  log.info('현재 최신버전입니다.');
  console.log('현재 최신버전입니다.');
  sendStatusToWindow("update not available");
});
autoUpdater.on('error', (err) => {
  log.info('에러가 발생하였습니다. 에러내용 : ' + err);
  console.log('에러가 발생하였습니다. 에러내용 : ' + err);
  sendStatusToWindow("error in updater .." + err);
});
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "다운로드 속도: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - 현재 ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  log.info(log_message);
  console.log(log_message);
  sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
  log.info('업데이트가 완료되었습니다.');

  const option = {
    type:"question",
    button:["update", "cancel"],
    default:0,
    title:"check update",
    message:"can you update this program?",
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => { 
  createDefaultupdateWindow();

  autoUpdater.checkForUpdates();
  //autoUpdater.checkForUpdatesAndNotify();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
