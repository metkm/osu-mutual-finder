import { app, BrowserWindow, session } from "electron";
import { registerEvents } from "./events";
import { makeid } from "./utils";

const filter = {
  urls: ["https://httpbin.org/*", "https://osu.ppy.sh/*"]
}
function webReqHandler() {
  const ses = session.fromPartition("mutual-finder")
  ses.webRequest.onHeadersReceived(filter, (details, callback) => {
    if (!details.responseHeaders!["set-cookie"]) return;

    let cookieCount = details.responseHeaders!["set-cookie"].length
    for (let index = 0; index < cookieCount; index++) {
      details.responseHeaders!["set-cookie"][index] += "; SameSite=None; Secure;"
    }

    callback({ responseHeaders: details.responseHeaders });
  })

  // session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
  //   details.requestHeaders = {
  //     ...details.requestHeaders,
  //   }

  //   callback({ requestHeaders: details.requestHeaders });
  // })
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
      partition: "mutual-finder"
    }
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
