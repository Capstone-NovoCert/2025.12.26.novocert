import { spawn, ChildProcess } from 'node:child_process'
import { REQUIRED_IMAGES } from './config'

interface DockerRunOptions {
  image: string
  containerName: string
  volumes?: string[]  // ['/host/path:/container/path']
  environment?: Record<string, string>
  command?: string[]
  platform?: string
}

interface DockerRunResult {
  success: boolean
  containerId?: string
  error?: string
  process?: ChildProcess
}

/**
 * Docker 컨테이너를 백그라운드에서 실행합니다.
 */
export async function runDockerContainer(options: DockerRunOptions): Promise<DockerRunResult> {
  const {
    image,
    containerName,
    volumes = [],
    environment = {},
    command = [],
    platform
  } = options

  return new Promise((resolve) => {
    const args: string[] = ['run', '--rm', '--name', containerName]

    // 플랫폼 지정
    if (platform) {
      args.push('--platform', platform)
    }

    // 볼륨 마운트
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

    const dockerProcess = spawn('docker', args, {
      detached: false,
      stdio: ['ignore', 'pipe', 'pipe']
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
 * Step1을 위한 Docker 컨테이너를 실행합니다.
 */
export async function runStep1Container(params: {
  projectName: string
  inputPath: string
  param1: string
  param2: string
  outputPath: string
}): Promise<DockerRunResult> {
  const { projectName, inputPath, param1, param2, outputPath } = params

  // Step1 이미지 찾기
  const step1Image = REQUIRED_IMAGES.find(img => img.step === 'step1')
  
  if (!step1Image) {
    return {
      success: false,
      error: 'Step1 이미지를 찾을 수 없습니다.'
    }
  }

  // 고유한 컨테이너 이름 생성 (타임스탬프 포함)
  const containerName = `step1-${projectName.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}`

  // Docker 컨테이너 실행
  return await runDockerContainer({
    image: step1Image.image,
    containerName,
    volumes: [
      `${inputPath}:/input`,
      `${outputPath}:/output`
    ],
    environment: {
      PARAM1: param1,
      PARAM2: param2,
      PROJECT_NAME: projectName
    },
    platform: step1Image.platform,
    command: []
  })
}

/**
 * 실행 중인 컨테이너를 중지합니다.
 */
export async function stopContainer(containerName: string): Promise<{ success: boolean; error?: string }> {
  return new Promise((resolve) => {
    const dockerProcess = spawn('docker', ['stop', containerName])

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
    const dockerProcess = spawn('docker', ['logs', containerName])

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

