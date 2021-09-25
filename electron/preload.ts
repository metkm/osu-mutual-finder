import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("titleBar", {
  event: (event: string) => ipcRenderer.send(event)
})
