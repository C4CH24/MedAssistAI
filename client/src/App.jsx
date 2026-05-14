import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";
import { API_BASE_URL } from "./utils/constants";
import { NotificationProvider } from "./context/NotificationContext";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/layout/Navbar";

// Page imports - CORRECTED PATHS based on your folder structure
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import Medications from "./pages/medications/Medications";
import AddMedication from "./pages/medications/AddMedication";
// Note: You don't have Reminders or Profile pages yet, so we'll comment them out
// import Reminders from "./pages/dashboard/Reminders";
// import Profile from "./pages/dashboard/Profile";
// import NotFound from "./pages/NotFound";

// Styles
import "./styles/global.css";

function App() {
  const [aiStatus, setAiStatus] = useState("checking");

  // Check AI engine status on startup
  useEffect(() => {
    const checkAIStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/ai/health`);
        const data = await response.json();
        if (data.fadhili?.available) {
          setAiStatus("primary");
        } else if (data.gemini?.available) {
          setAiStatus("fallback");
        } else {
          setAiStatus("offline");
        }
      } catch (error) {
        console.error("Failed to check AI status:", error);
        setAiStatus("unknown");
      }
    };

    checkAIStatus();
    // Check every 5 minutes
    const interval = setInterval(checkAIStatus, 300000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <NotificationProvider>
            <Router unstable_future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <div className="App">
                {/* AI Status Banner */}
                {aiStatus === "fallback" && (
                  <div className="ai-status-banner warning">
                    ?? Fadhili AI temporarily unavailable. Using backup AI service.
                  </div>
                )}
                {aiStatus === "offline" && (
                  <div className="ai-status-banner error">
                    ?? AI services offline. Using basic reminders only.
                  </div>
                )}

                <Navbar />
                <main className="container">
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                      path="/"
                      element={
                        <PrivateRoute>
                          <Dashboard />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/medications"
                      element={
                        <PrivateRoute>
                          <Medications />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/add-medication"
                      element={
                        <PrivateRoute>
                          <AddMedication />
                        </PrivateRoute>
                      }
                    />
                    {/* Temporarily redirect other routes to dashboard until pages are created */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
              </div>
            </Router>
          </NotificationProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
