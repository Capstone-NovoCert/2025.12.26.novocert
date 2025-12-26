import { Project, ProjectStatus, Task, TaskStatus } from './types'

interface DatabaseAPI {
  // Projects
  getProjects: () => Promise<Project[]>
  getProject: (uuid: string) => Promise<Project | null>
  addProject: (project: { name: string; status: ProjectStatus; parameters: Record<string, any> }) => Promise<Project>
  updateProject: (uuid: string, updates: { name?: string; status?: ProjectStatus; parameters?: Record<string, any> }) => Promise<Project | null>
  deleteProject: (uuid: string) => Promise<boolean>
  getDbPath: () => Promise<string>
  
  // Tasks
  getTasks: () => Promise<Task[]>
  getTasksByProject: (projectUuid: string) => Promise<Task[]>
  getTask: (uuid: string) => Promise<Task | null>
  addTask: (task: { project_uuid: string; step: string; status: TaskStatus; parameters: Record<string, any> }) => Promise<Task>
  updateTask: (uuid: string, updates: { step?: string; status?: TaskStatus; parameters?: Record<string, any> }) => Promise<Task | null>
  deleteTask: (uuid: string) => Promise<boolean>
  deleteTasksByProject: (projectUuid: string) => Promise<number>
}

interface DockerCheckResult {
  installed?: boolean
  running?: boolean
  version?: string
  info?: string
  error?: string
}

interface DockerAPI {
  checkInstalled: () => Promise<DockerCheckResult>
  checkRunning: () => Promise<DockerCheckResult>
}

declare global {
  interface Window {
    db: DatabaseAPI
    docker: DockerAPI
    ipcRenderer: {
      on(channel: string, func: (...args: any[]) => void): void
      off(channel: string, func: (...args: any[]) => void): void
      send(channel: string, ...args: any[]): void
      invoke(channel: string, ...args: any[]): Promise<any>
    }
  }
}

export {}

