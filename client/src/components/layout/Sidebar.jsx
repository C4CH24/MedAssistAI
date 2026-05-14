import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { t, language, toggleLanguage } = useLanguage();

  const menuItems = [
    {
      path: '/',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" strokeWidth="2"/>
        </svg>
      ),
      label: t('dashboard')
    },
    {
      path: '/medications',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2"/>
          <path d="M8 8H16" strokeWidth="2" strokeLinecap="round"/>
          <path d="M8 12H16" strokeWidth="2" strokeLinecap="round"/>
          <path d="M8 16H12" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      label: t('medications')
    },
    {
      path: '/reminders',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="13" r="9" strokeWidth="2"/>
          <path d="M12 8V13L15 16" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      label: t('reminders')
    },
    {
      path: '/reports',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M21 21H4C3.46957 21 2.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V4" strokeWidth="2"/>
          <path d="M7 15L10 10L13 13L18 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: t('reports')
    },
    {
      path: '/ai-insights',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="3" strokeWidth="2"/>
          <path d="M19.4 15C19.0343 15.8989 18.662 16.7905 18.28 17.68L19.86 19.26L17.26 21.86L15.68 20.28C14.7905 20.662 13.8989 21.0343 13 21.4V24H11V21.4C10.1011 21.0343 9.20952 20.662 8.32 20.28L6.74 21.86L4.14 19.26L5.72 17.68C5.338 16.7905 4.96566 15.8989 4.6 15H2V13H4.6C4.96566 12.1011 5.338 11.2095 5.72 10.32L4.14 8.74L6.74 6.14L8.32 7.72C9.20952 7.338 10.1011 6.96566 11 6.6V4H13V6.6C13.8989 6.96566 14.7905 7.338 15.68 7.72L17.26 6.14L19.86 8.74L18.28 10.32C18.662 11.2095 19.0343 12.1011 19.4 13H22V15H19.4Z" strokeWidth="2"/>
        </svg>
      ),
      label: t('aiInsights')
    }
  ];

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-ai-status">
            <div className="status-dot primary"></div>
            <span className="status-text">Fadhili AI</span>
            <span className="status-badge primary">Primary</span>
          </div>
          <button className="sidebar-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M18 6L6 18" strokeWidth="2" strokeLinecap="round"/>
              <path d="M6 6L18 18" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-help">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="2"/>
              <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.395 7.40913C11.0008 7.05016 11.7089 6.91894 12.3972 7.03871C13.0855 7.15849 13.7084 7.52152 14.1452 8.06353C14.582 8.60553 14.801 9.29152 14.76 9.99C14.76 12 11.76 13 11.76 13" strokeWidth="2"/>
              <path d="M12 17H12.01" strokeWidth="2"/>
            </svg>
            <span>Help & Support</span>
          </div>
          <div className="sidebar-language" onClick={toggleLanguage}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="2"/>
              <path d="M2 12H22" strokeWidth="2"/>
              <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" strokeWidth="2"/>
            </svg>
            <span>{language === 'en' ? 'Switch to Kiswahili' : 'Badili kwa Kiingereza'}</span>
          </div>
        </div>

        <style jsx>{`
          .sidebar {
            width: 280px;
            background: white;
            height: calc(100vh - 72px);
            position: sticky;
            top: 72px;
            left: 0;
            border-right: 1px solid #EDF2F7;
            display: flex;
            flex-direction: column;
            transition: all 0.3s ease;
            z-index: 900;
          }
          @media (max-width: 1024px) {
            .sidebar {
              position: fixed;
              top: 0;
              left: -280px;
              height: 100vh;
              z-index: 1000;
            }
            .sidebar.open {
              left: 0;
              box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
            }
          }
          .sidebar-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 999;
          }
          .sidebar-header {
            padding: 1.5rem;
            border-bottom: 1px solid #EDF2F7;
            position: relative;
          }
          .sidebar-ai-status {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            background: #F7FAFC;
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;
          }
          .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
          }
          .status-dot.primary {
            background: #48BB78;
            box-shadow: 0 0 0 2px rgba(72,187,120,0.2);
          }
          .status-text {
            font-size: 0.875rem;
            font-weight: 500;
            color: #2D3748;
          }
          .status-badge {
            font-size: 0.625rem;
            font-weight: 600;
            padding: 0.25rem 0.5rem;
            border-radius: 1rem;
            margin-left: auto;
            background: #48BB78;
            color: white;
          }
          .sidebar-close {
            display: none;
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            cursor: pointer;
            color: #4A5568;
            padding: 0.5rem;
            border-radius: 0.375rem;
          }
          .sidebar-close:hover {
            background: #EDF2F7;
          }
          @media (max-width: 1024px) {
            .sidebar-close {
              display: block;
            }
          }
          .sidebar-nav {
            flex: 1;
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }
          .sidebar-link {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem 1rem;
            text-decoration: none;
            color: #4A5568;
            border-radius: 0.5rem;
            transition: all 0.3s ease;
          }
          .sidebar-link:hover {
            background: #EDF2F7;
          }
          .sidebar-link.active {
            background: linear-gradient(135deg, #4A90E2 0%, #6BA5E8 100%);
            color: white;
          }
          .sidebar-link.active svg {
            stroke: white;
          }
          .sidebar-footer {
            padding: 1.5rem;
            border-top: 1px solid #EDF2F7;
          }
          .sidebar-help,
          .sidebar-language {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.5rem;
            color: #718096;
            font-size: 0.75rem;
            cursor: pointer;
            border-radius: 0.375rem;
            transition: all 0.3s ease;
          }
          .sidebar-help:hover,
          .sidebar-language:hover {
            background: #EDF2F7;
            color: #4A5568;
          }
        `}</style>
      </aside>
    </>
  );
};

export default Sidebar;
