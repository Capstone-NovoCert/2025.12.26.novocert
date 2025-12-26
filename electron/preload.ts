import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },
})

// Database API 노출
contextBridge.exposeInMainWorld('db', {
  getProjects: () => ipcRenderer.invoke('db:getProjects'),
  getProject: (uuid: string) => ipcRenderer.invoke('db:getProject', uuid),
  addProject: (project: { name: string; status: string; parameters: Record<string, any> }) => 
    ipcRenderer.invoke('db:addProject', project),
  updateProject: (uuid: string, updates: { name?: string; status?: string; parameters?: Record<string, any> }) => 
    ipcRenderer.invoke('db:updateProject', uuid, updates),
  deleteProject: (uuid: string) => ipcRenderer.invoke('db:deleteProject', uuid),
  getDbPath: () => ipcRenderer.invoke('db:getDbPath'),
})