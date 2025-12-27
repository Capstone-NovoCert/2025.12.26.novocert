import { spawn, ChildProcess } from 'node:child_process'
import { getExtendedPath } from './utils'

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
}

interface DockerRunResult {
  success: boolean
  containerId?: string
  error?: string
  process?: ChildProcess
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
    autoRemove = true
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

    // stdout 수집
    dockerProcess.stdout?.on('data', (data) => {
      const output = data.toString()
      console.log('Docker stdout:', output)
      containerId += output
    })

    // stderr 수집
    dockerProcess.stderr?.on('data', (data) => {
      const output = data.toString()
      console.error('Docker stderr:', output)
      errorOutput += output
    })

    // 프로세스 종료
    dockerProcess.on('close', (code) => {
      console.log(`Docker process exited with code ${code}`)
      
      if (code === 0) {
        resolve({
          success: true,
          containerId: containerId.trim(),
          process: dockerProcess
        })
      } else {
        resolve({
          success: false,
          error: errorOutput || `Docker exited with code ${code}`
        })
      }
    })

    // 프로세스 에러
    dockerProcess.on('error', (error) => {
      console.error('Docker process error:', error)
      resolve({
        success: false,
        error: error.message
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
