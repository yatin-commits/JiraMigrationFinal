import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import IssueDetails from "./pages/IssueDetails.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import OtpPage from "./pages/OtpPage.jsx";
import ProjectIssuesPage from "./pages/ProjectIssuesPage.jsx";
import { isLoggedIn } from "./services/apiClient.js";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  if (!isLoggedIn()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/otp" element={<OtpPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <ProjectIssuesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/issue/:key"
        element={
          <ProtectedRoute>
            <IssueDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={<Navigate to={isLoggedIn() ? "/" : "/login"} replace />}
      />
    </Routes>
  );
}