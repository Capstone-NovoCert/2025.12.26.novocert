import { useState } from "react";
import { Layout } from "./components/layout";
import { Dashboard, Prepare, Step1, ProjectDetail } from "./pages";

function App() {
  const [currentPage, setCurrentPage] = useState<string>("dashboard");
  const [currentProjectUuid, setCurrentProjectUuid] = useState<string | null>(null);

  const handleNavigate = (page: string, uuid: string | null = null) => {
    setCurrentPage(page);
    setCurrentProjectUuid(uuid);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard onNavigate={handleNavigate} />;
      case "prepare":
        return <Prepare />;
      case "pipeline":
        return <div>Pipeline 페이지 (준비 중)</div>;
      case "step1":
        return <Step1 />;
      case "step2":
        return <div>Step 2 (준비 중)</div>;
      case "step3":
        return <div>Step 3 (준비 중)</div>;
      case "step4":
        return <div>Step 4 (준비 중)</div>;
      case "step5":
        return <div>Step 5 (준비 중)</div>;
      case "project-detail":
        if (currentProjectUuid) {
          return <ProjectDetail uuid={currentProjectUuid} onNavigate={handleNavigate} />;
        }
        // uuid가 없으면 대시보드로 리디렉션
        return <Dashboard onNavigate={handleNavigate} />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={handleNavigate}>
      {renderPage()}
    </Layout>
  );
}

export default App;
