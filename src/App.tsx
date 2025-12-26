import { useState } from "react";
import { Layout } from "./components/layout";
import { Dashboard, Prepare } from "./pages";

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
