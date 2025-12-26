import { useState } from "react";
import { NumberInput, PathInput, TextInput } from "../../components/form";

function Step1() {
  const [projectName, setProjectName] = useState("");
  const [inputPath, setInputPath] = useState("");
  const [param1, setParam1] = useState("");
  const [param2, setParam2] = useState("");
  const [outputPath, setOutputPath] = useState("");

  return (
    <div className="h-full flex gap-6">
      {/* 왼쪽: 프로젝트 및 Step 정보 */}
      <div className="w-1/3">
        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-0">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Step 1</h2>
            <p className="text-sm text-gray-500">데이터 전처리 단계</p>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Step 설명
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                이 단계에서는 입력 데이터를 전처리하고 필요한 형식으로
                변환합니다.
              </p>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="font-medium text-gray-700 mb-2">필요한 입력:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>프로젝트 이름</li>
                  <li>입력 파일 경로</li>
                  <li>처리 파라미터 1 (정수)</li>
                  <li>처리 파라미터 2 (정수)</li>
                  <li>출력 파일 경로</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex gap-2">
              <svg
                className="w-5 h-5 text-yellow-600 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-xs text-yellow-800">
                모든 파라미터를 입력한 후 실행 버튼을 클릭하세요.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 오른쪽: 파라미터 입력 */}
      <div className="flex-1">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            파라미터 설정
          </h2>

          <div className="space-y-6">
            <TextInput
              label="Project Name"
              value={projectName}
              onChange={setProjectName}
              placeholder="프로젝트 이름 입력"
              required={true}
              description="새로 시작할 프로젝트의 이름을 입력하세요"
            />

            <PathInput
              label="Input Path"
              value={inputPath}
              onChange={setInputPath}
              placeholder="/path/to/input/file"
              required={true}
              description="입력 데이터 파일의 전체 경로를 입력하세요"
            />

            <NumberInput
              label="Parameter 1"
              value={param1}
              onChange={setParam1}
              placeholder="0"
              required={true}
              description="처리할 첫 번째 파라미터 (정수)"
            />

            <NumberInput
              label="Parameter 2"
              value={param2}
              onChange={setParam2}
              placeholder="0"
              required={true}
              description="처리할 두 번째 파라미터 (정수)"
            />

            <PathInput
              label="Output Path"
              value={outputPath}
              onChange={setOutputPath}
              placeholder="/path/to/output/file"
              required={true}
              description="결과를 저장할 파일의 전체 경로를 입력하세요"
            />
          </div>

          {/* Run Button */}
          <div className="mt-8 pt-6 border-t">
            <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Run Step 1
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step1;
