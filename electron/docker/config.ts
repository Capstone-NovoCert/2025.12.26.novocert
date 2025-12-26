/**
 * Docker 이미지 설정
 * 애플리케이션에서 사용할 Docker 이미지 목록을 정의합니다.
 */

export interface DockerImageConfig {
  name: string        // 표시할 이름
  image: string       // 실제 이미지 이름 (예: nginx:latest)
  description: string // 설명
}

/**
 * 필요한 Docker 이미지 목록
 */
export const REQUIRED_IMAGES: DockerImageConfig[] = [
  {
    name: 'Nginx',
    image: 'nginx:latest',
    description: '웹 서버 및 리버스 프록시'
  },
  {
    name: 'PostgreSQL',
    image: 'postgres:latest',
    description: '관계형 데이터베이스'
  },
  {
    name: 'Redis',
    image: 'redis:latest',
    description: '인메모리 데이터 저장소'
  }
]

