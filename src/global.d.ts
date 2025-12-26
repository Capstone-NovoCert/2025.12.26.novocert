interface Project {
  uuid: string
  name: string
  status: string
  parameters: Record<string, any>
}

interface DatabaseAPI {
  getProjects: () => Promise<Project[]>
  getProject: (uuid: string) => Promise<Project | null>
  addProject: (project: { name: string; status: string; parameters: Record<string, any> }) => Promise<Project>
  updateProject: (uuid: string, updates: { name?: string; status?: string; parameters?: Record<string, any> }) => Promise<Project | null>
  deleteProject: (uuid: string) => Promise<boolean>
  getDbPath: () => Promise<string>
}

declare global {
  interface Window {
    db: DatabaseAPI
    ipcRenderer: {
      on(channel: string, func: (...args: any[]) => void): void
      off(channel: string, func: (...args: any[]) => void): void
      send(channel: string, ...args: any[]): void
      invoke(channel: string, ...args: any[]): Promise<any>
    }
  }
}

export {}

