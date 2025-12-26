import { useState, useEffect } from "react";

interface Project {
  uuid: string;
  name: string;
  status: string;
  parameters: Record<string, any>;
}

function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [dbPath, setDbPath] = useState("");

  useEffect(() => {
    loadProjects();
    loadDbPath();
  }, []);

  const loadProjects = async () => {
    const data = await window.db.getProjects();
    setProjects(data);
  };

  const loadDbPath = async () => {
    const path = await window.db.getDbPath();
    setDbPath(path);
  };

  const addProject = async () => {
    if (!newProjectName) return;

    await window.db.addProject({
      name: newProjectName,
      status: "pending",
      parameters: {},
    });

    setNewProjectName("");
    loadProjects();
  };

  const deleteProject = async (uuid: string) => {
    await window.db.deleteProject(uuid);
    loadProjects();
  };

  const updateProjectStatus = async (uuid: string, status: string) => {
    await window.db.updateProject(uuid, { status });
    loadProjects();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">프로젝트 관리</h1>
      <p className="text-sm text-gray-500 mb-8">
        Electron + LowDB + Tailwind CSS
      </p>

      {/* DB 경로 */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <p className="text-xs text-gray-600">
          <span className="font-semibold">DB 경로:</span> {dbPath}
        </p>
      </div>

      {/* 새 프로젝트 추가 */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          새 프로젝트 추가
        </h2>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="프로젝트 이름"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addProject()}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <button
            onClick={addProject}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            추가
          </button>
        </div>
      </div>

      {/* 프로젝트 목록 */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            프로젝트 목록{" "}
            <span className="text-gray-500">({projects.length})</span>
          </h2>
        </div>

        {projects.length === 0 ? (
          <div className="p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="mt-4 text-gray-500">프로젝트가 없습니다</p>
            <p className="text-sm text-gray-400">
              위에서 새 프로젝트를 추가해보세요
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    UUID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    프로젝트 이름
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project.uuid} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                      {project.uuid.split("-")[0]}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {project.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={project.status}
                        onChange={(e) =>
                          updateProjectStatus(project.uuid, e.target.value)
                        }
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          project.status
                        )} border-0 cursor-pointer`}
                      >
                        <option value="pending">대기</option>
                        <option value="in-progress">진행중</option>
                        <option value="completed">완료</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => deleteProject(project.uuid)}
                        className="text-red-600 hover:text-red-900 font-medium"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
