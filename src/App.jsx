import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ReportsPage from "./pages/ReportsPage";
import ReportViewer from "./pages/ReportViewer";

import { ReportProvider } from "./context/ReportContext";
import MedicalJourney from "./pages/MedicalJourney";

function App() {
  return (
    <BrowserRouter>
      <ReportProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route path="/login" element={<LoginPage />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/reports" element={<ReportsPage />} />

          <Route
            path="/report-viewer"
            element={<ReportViewer />}
          />
          <Route
  path="/medical-journey"
  element={<MedicalJourney />}
/>
          
        </Routes>
      </ReportProvider>
    </BrowserRouter>
  );
}

export default App;