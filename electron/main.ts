import { app, BrowserWindow, session, shell } from "electron";
import { autoUpdater } from "electron-updater";
import { registerEvents } from "./events";
autoUpdater.checkForUpdatesAndNotify();

const filter = {
  urls: ["https://httpbin.org/*", "https://osu.ppy.sh/*"]
}
async function webReqHandler() {
  await session.defaultSession.clearStorageData({ storages: ["cookies"] })
  session.defaultSession.webRequest.onHeadersReceived(filter, (details, callback) => {
    if (!details.responseHeaders!["set-cookie"]) {
      callback({ responseHeaders: details.responseHeaders });
      return
    };

    let cookieCount = details.responseHeaders!["set-cookie"].length
    for (let index = 0; index < cookieCount; index++) {
      details.responseHeaders!["set-cookie"][index] += "; SameSite=None; Secure;"
    }

    callback({ responseHeaders: details.responseHeaders });
  })

  session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
    details.requestHeaders["referer"] = "https://osu.ppy.sh";
    callback({ requestHeaders: details.requestHeaders });
  })
}

async function main() {
  await app.whenReady();
  const window = new BrowserWindow({
    width: 1000,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: "hidden",
    webPreferences: {
      preload: `${__dirname}/preload.js`,
      webSecurity: false,
    }
  })
  
  window.webContents.setWindowOpenHandler(details => {
    shell.openExternal(details.url);
    return { action: "deny" };
  })

  if (process.env.DEV) {
    window.loadURL("http://localhost:3000");
    window.webContents.openDevTools();
  } else {
    window.loadFile("./index.html");
  }

  webReqHandler();
  registerEvents(window);
  window.once("ready-to-show", () => window.show())
}

main();
