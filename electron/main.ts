import { app, BrowserWindow, ipcMain } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import { database } from './database'

const execAsync = promisify(exec)

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(async () => {
  // 데이터베이스 초기화
  await database.init()
  
  // IPC 핸들러 등록
  setupIpcHandlers()
  
  createWindow()
})

// 확장된 PATH로 명령어 실행
function getExtendedPath(): string {
  const basePath = process.env.PATH || ''
  
  if (process.platform === 'win32') {
    return basePath
  }
  
  // macOS/Linux: 일반적인 Docker 설치 경로 추가
  const additionalPaths = [
    '/usr/local/bin',
    '/usr/bin',
    '/opt/homebrew/bin',
    '/Applications/Docker.app/Contents/Resources/bin'
  ]
  
  return `${basePath}:${additionalPaths.join(':')}`
}

// Docker 확인 함수들
async function checkDockerInstalled(): Promise<{ installed: boolean; version?: string; error?: string }> {
  try {
    // which/where 명령어로 docker 실행 파일 찾기
    const findCommand = process.platform === 'win32' ? 'where docker' : 'which docker'
    
    await execAsync(findCommand, {
      env: { ...process.env, PATH: getExtendedPath() }
    })
    
    // docker 찾았으면 버전 확인
    const { stdout } = await execAsync('docker --version', {
      env: { ...process.env, PATH: getExtendedPath() }
    })
    
    return { installed: true, version: stdout.trim() }
  } catch (error: any) {
    return { 
      installed: false, 
      error: 'Docker가 설치되어 있지 않습니다.'
    }
  }
}

async function checkDockerRunning(): Promise<{ running: boolean; info?: string; error?: string }> {
  try {
    const { stdout } = await execAsync('docker info', {
      env: { ...process.env, PATH: getExtendedPath() }
    })
    return { running: true, info: stdout.trim() }
  } catch (error: any) {
    // Docker는 설치되어 있지만 실행되지 않는 경우
    if (error.message.includes('Cannot connect to the Docker daemon')) {
      return {
        running: false,
        error: 'Docker가 실행되고 있지 않습니다. Docker Desktop을 실행해주세요.'
      }
    }
    return {
      running: false,
      error: error.message || 'Docker 상태를 확인할 수 없습니다.'
    }
  }
}

// IPC 핸들러 설정
function setupIpcHandlers() {
  // Docker handlers
  ipcMain.handle('docker:checkInstalled', async () => {
    return await checkDockerInstalled()
  })

  ipcMain.handle('docker:checkRunning', async () => {
    return await checkDockerRunning()
  })

  // Project handlers
  ipcMain.handle('db:getProjects', async () => {
    return await database.projects.getAll()
  })

  ipcMain.handle('db:getProject', async (_, uuid) => {
    return await database.projects.getOne(uuid)
  })

  ipcMain.handle('db:addProject', async (_, project) => {
    return await database.projects.create(project)
  })

  ipcMain.handle('db:updateProject', async (_, uuid, updates) => {
    return await database.projects.update(uuid, updates)
  })

  ipcMain.handle('db:deleteProject', async (_, uuid) => {
    return await database.projects.delete(uuid)
  })

  ipcMain.handle('db:getDbPath', () => {
    return database.projects.getDbPath()
  })

  // Task handlers
  ipcMain.handle('db:getTasks', async () => {
    return await database.tasks.getAll()
  })

  ipcMain.handle('db:getTasksByProject', async (_, projectUuid) => {
    return await database.tasks.getByProject(projectUuid)
  })

  ipcMain.handle('db:getTask', async (_, uuid) => {
    return await database.tasks.getOne(uuid)
  })

  ipcMain.handle('db:addTask', async (_, task) => {
    return await database.tasks.create(task)
  })

  ipcMain.handle('db:updateTask', async (_, uuid, updates) => {
    return await database.tasks.update(uuid, updates)
  })

  ipcMain.handle('db:deleteTask', async (_, uuid) => {
    return await database.tasks.delete(uuid)
  })

  ipcMain.handle('db:deleteTasksByProject', async (_, projectUuid) => {
    return await database.tasks.deleteByProject(projectUuid)
  })
}
