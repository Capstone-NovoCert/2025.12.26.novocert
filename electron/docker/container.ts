import { spawn, ChildProcess } from 'node:child_process'
import { getExtendedPath } from './utils'
import fs from 'node:fs'
import path from 'node:path'

interface DockerRunOptions {
  image: string
  containerName: string
  uid?: string
  gid?: string
  volumes?: string[]  // ['/host/path:/container/path']
  environment?: Record<string, string>
  command?: string[]
  platform?: string
  autoRemove?: boolean
  logFilePath?: string  // 로그를 저장할 파일 경로 (옵션)
}

interface DockerRunResult {
  success: boolean
  containerId?: string
  error?: string
  process?: ChildProcess
  logFilePath?: string  // 로그 파일 경로
}

/**
 * Docker 컨테이너를 실행합니다.
 */
export async function runDockerContainer(options: DockerRunOptions): Promise<DockerRunResult> {
  const {
    image,
    containerName,
    uid,
    gid,
    volumes = [],
    environment = {},
    command = [],
    platform,
    autoRemove = true,
    logFilePath
  } = options

  return new Promise((resolve) => {
    const args: string[] = ['run']

    // Auto remove 옵션
    if (autoRemove) {
      args.push('--rm')
    }

    // 컨테이너 이름
    args.push('--name', containerName)

    // 사용자/그룹 ID 설정
    if (uid && gid) {
      args.push('--user', `${uid}:${gid}`)
    }

    // 플랫폼 지정
    if (platform) {
      args.push('--platform', platform)
    }

    // 볼륨 마운트 (bind mount)
    volumes.forEach(volume => {
      args.push('-v', volume)
    })

    // 환경 변수
    Object.entries(environment).forEach(([key, value]) => {
      args.push('-e', `${key}=${value}`)
    })

    // 이미지 이름
    args.push(image)

    // 추가 명령어
    if (command.length > 0) {
      args.push(...command)
    }

    console.log('Docker run command:', 'docker', args.join(' '))

    // 로그 파일 스트림 생성
    let logStream: fs.WriteStream | null = null
    if (logFilePath) {
      // 로그 디렉토리가 없으면 생성
      const logDir = path.dirname(logFilePath)
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true })
      }
      logStream = fs.createWriteStream(logFilePath, { flags: 'a' })
      logStream.write(`=== Docker container started: ${containerName} ===\n`)
      logStream.write(`Command: docker ${args.join(' ')}\n`)
      logStream.write(`Timestamp: ${new Date().toISOString()}\n\n`)
    }

    // 확장된 PATH를 사용하여 docker 명령어 실행
    const dockerProcess = spawn('docker', args, {
      detached: false,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: {
        ...process.env,
        PATH: getExtendedPath()
      }
    })

    let containerId = ''
    let errorOutput = ''

    // stdout 수집 - 로그 파일에 저장
    dockerProcess.stdout?.on('data', (data) => {
      const output = data.toString()
      containerId += output
      
      if (logStream) {
        logStream.write(`[STDOUT] ${output}`)
      } else {
        console.log('Docker stdout:', output)
      }
    })

    // stderr 수집 - 로그 파일에 저장
    dockerProcess.stderr?.on('data', (data) => {
      const output = data.toString()
      errorOutput += output
      
      if (logStream) {
        logStream.write(`[STDERR] ${output}`)
      } else {
        console.error('Docker stderr:', output)
      }
    })

    // 프로세스 종료
    dockerProcess.on('close', (code) => {
      const message = `\n=== Docker container finished with exit code: ${code} ===\n`
      
      if (logStream) {
        logStream.write(message)
        logStream.end()
      } else {
        console.log(message)
      }
      
      if (code === 0) {
        resolve({
          success: true,
          containerId: containerId.trim(),
          process: dockerProcess,
          logFilePath
        })
      } else {
        resolve({
          success: false,
          error: errorOutput || `Docker exited with code ${code}`,
          logFilePath
        })
      }
    })

    // 프로세스 에러
    dockerProcess.on('error', (error) => {
      const message = `Docker process error: ${error.message}\n`
      
      if (logStream) {
        logStream.write(message)
        logStream.end()
      } else {
        console.error(message)
      }
      
      resolve({
        success: false,
        error: error.message,
        logFilePath
      })
    })
  })
}

/**
 * 실행 중인 컨테이너를 중지합니다.
 */
export async function stopContainer(containerName: string): Promise<{ success: boolean; error?: string }> {
  return new Promise((resolve) => {
    const dockerProcess = spawn('docker', ['stop', containerName], {
      env: {
        ...process.env,
        PATH: getExtendedPath()
      }
    })

    let errorOutput = ''

    dockerProcess.stderr?.on('data', (data) => {
      errorOutput += data.toString()
    })

    dockerProcess.on('close', (code) => {
      if (code === 0) {
        resolve({ success: true })
      } else {
        resolve({ success: false, error: errorOutput || `Failed to stop container ${containerName}` })
      }
    })

    dockerProcess.on('error', (error) => {
      resolve({ success: false, error: error.message })
    })
  })
}

/**
 * 컨테이너의 로그를 가져옵니다.
 */
export async function getContainerLogs(containerName: string): Promise<{ success: boolean; logs?: string; error?: string }> {
  return new Promise((resolve) => {
    const dockerProcess = spawn('docker', ['logs', containerName], {
      env: {
        ...process.env,
        PATH: getExtendedPath()
      }
    })

    let logs = ''
    let errorOutput = ''

    dockerProcess.stdout?.on('data', (data) => {
      logs += data.toString()
    })

    dockerProcess.stderr?.on('data', (data) => {
      errorOutput += data.toString()
    })

    dockerProcess.on('close', (code) => {
      if (code === 0) {
        resolve({ success: true, logs: logs + errorOutput })
      } else {
        resolve({ success: false, error: errorOutput })
      }
    })

    dockerProcess.on('error', (error) => {
      resolve({ success: false, error: error.message })
    })
  })
}
