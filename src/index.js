const { app, BrowserWindow, ipcMain, Notification, Menu } = require("electron");
const path = require("path");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = async () => {
  // Create the browser window.
  let mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    maxWidth: 900,
    maxHeight: 700,
    minWidth: 900,
    minHeight: 700,
    maximizable: false, // <-- set maximizable to false
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "rgba(0, 88, 138, 0)",
      symbolColor: "#74b1be",
      height: 20,
    },
    icon: __dirname + "/src/Icon.ico",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      devTools: false,
      contextIsolation: false,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "index.html"));
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

app.on("before-quit", () => {
  // Fecha todas as janelas do aplicativo
  BrowserWindow.getAllWindows().forEach((window) => {
    window.removeAllListeners("close");
    window.close();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
// No processo principal (main.js)

ipcMain.on("oi", (event, arg) => {
  let notification = new Notification({
    title: "Robô iniciado",
    body: arg,
    icon: path.join(__dirname, "../src/Icon.png"),
    sound: "../src/moeda.mp3",
    subtitle: "ZapisonBOT",
  });

  notification.show();
});
