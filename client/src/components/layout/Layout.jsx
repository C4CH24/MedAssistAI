import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="layout">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="layout-main">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="layout-content">
          <div className="container">
            {children}
          </div>
        </main>
      </div>
      <Footer />
      <style jsx>{`
        .layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, #F7FAFC 0%, #EDF2F7 100%);
        }
        .layout-main {
          display: flex;
          flex: 1;
          position: relative;
        }
        .layout-content {
          flex: 1;
          padding: 2rem;
          transition: all 0.3s ease;
          overflow-y: auto;
          max-height: calc(100vh - 140px);
        }
        .layout-content::-webkit-scrollbar {
          width: 6px;
        }
        .layout-content::-webkit-scrollbar-track {
          background: #EDF2F7;
        }
        .layout-content::-webkit-scrollbar-thumb {
          background: #CBD5E0;
          border-radius: 3px;
        }
        .layout-content::-webkit-scrollbar-thumb:hover {
          background: #A0AEC0;
        }
        @media (max-width: 768px) {
          .layout-content {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;
