import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
            MedAssistAI
          </Link>

          {user && (
            <div className="flex items-center space-x-4">
              <Link to="/medications" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">
                {t("medications")}
              </Link>
              <Link to="/add-medication" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">
                {t("addMedication")}
              </Link>
              
              <button
                onClick={toggleLanguage}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded"
              >
                {language === "en" ? "SW" : "EN"}
              </button>
              
              <button
                onClick={toggleTheme}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded"
              >
                {theme === "light" ? "??" : "??"}
              </button>
              
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                {t("logout")}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
