import { useState } from "react";
import { Layout } from "./components/layout";
import { Dashboard, Prepare, Step1 } from "./pages";

function App() {
  const [currentPage, setCurrentPage] = useState<string>("dashboard");

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
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
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default App;
