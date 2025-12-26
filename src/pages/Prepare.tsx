function Prepare() {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">환경 준비</h1>
      <p className="text-sm text-gray-500 mb-8">
        Docker 환경을 확인하고 필요한 이미지를 설치합니다
      </p>

      <div className="space-y-6">
        {/* Docker 설치 확인 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🐳</span>
                <h2 className="text-xl font-semibold text-gray-900">
                  1. Docker 설치 확인
                </h2>
              </div>
              <p className="text-gray-600 ml-11">
                시스템에 Docker가 설치되어 있는지 확인합니다.
              </p>
            </div>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium ml-4">
              확인
            </button>
          </div>
          <div className="mt-4 ml-11">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>상태: 확인 전</span>
            </div>
          </div>
        </div>

        {/* Docker Daemon 실행 확인 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">⚙️</span>
                <h2 className="text-xl font-semibold text-gray-900">
                  2. Docker Daemon 실행 확인
                </h2>
              </div>
              <p className="text-gray-600 ml-11">
                Docker 서비스가 현재 실행 중인지 확인합니다.
              </p>
            </div>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium ml-4">
              확인
            </button>
          </div>
          <div className="mt-4 ml-11">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>상태: 확인 전</span>
            </div>
          </div>
        </div>

        {/* Docker Image 다운로드 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">📦</span>
                <h2 className="text-xl font-semibold text-gray-900">
                  3. Docker Image 설치
                </h2>
              </div>
              <p className="text-gray-600 ml-11">
                프로그램에 필요한 Docker 이미지를 다운로드합니다.
              </p>
            </div>
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium ml-4">
              설치
            </button>
          </div>
          <div className="mt-4 ml-11">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>상태: 설치 전</span>
              </div>
              <div className="text-xs text-gray-400 mt-2">
                필요한 이미지: ubuntu:latest, python:3.9, node:18-alpine
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 안내 */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <svg
            className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">시작하기 전에</p>
            <p>
              모든 항목을 확인하고 설치가 완료되어야 파이프라인을 실행할 수
              있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Prepare;
