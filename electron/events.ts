import { BrowserWindow, ipcMain } from "electron";

export function registerEvents(window: BrowserWindow) {
  ipcMain.on("minimize", () => window.minimize());
  ipcMain.on("maximize", () => window.isMaximized() ? window.unmaximize() : window.maximize());
  ipcMain.on("close", () => window.close());
}
