import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("titleBar", {
  event: (event: string) => ipcRenderer.send(event),
})

contextBridge.exposeInMainWorld("ipc", {
  message: (callback: (message: string) => void) => {
    ipcRenderer.on("message", (_, message) => callback(message))
  }
})
