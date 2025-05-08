/**
 * Main Layout Component
 * 
 * This component provides the main layout structure for the application,
 * including header, sidebar, and content area.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import ThemeSwitcher from '../ThemeSwitcher';
import './MainLayout.css';

/**
 * Main Layout Component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Main layout component
 */
const MainLayout = ({
  children,
  title = 'Credit Cooperative System',
  showSidebar = true
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { currentTheme } = useTheme();
  const location = useLocation();
  
  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };
  
  // Navigation items
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/loans', label: 'Loans', icon: '💰' },
    { path: '/ewallet', label: 'E-Wallet', icon: '💳' },
    { path: '/ewallet/damayan', label: 'Damayan', icon: '🤝' },
    { path: '/transactions', label: 'Transactions', icon: '📝' },
    { path: '/profile', label: 'Profile', icon: '👤' },
    { path: '/settings', label: 'Settings', icon: '⚙️' }
  ];
  
  return (
    <div className={`main-layout theme-${currentTheme}`}>
      {/* Header */}
      <header className="main-header">
        <div className="header-left">
          {showSidebar && (
            <button
              className="sidebar-toggle"
              onClick={toggleSidebar}
              aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            >
              {isSidebarOpen ? '≡' : '☰'}
            </button>
          )}
          <h1 className="app-title">{title}</h1>
        </div>
        
        <div className="header-right">
          <ThemeSwitcher variant="icon" showCustomizer />
          
          <div className="user-menu">
            <button className="user-menu-button">
              <span className="user-avatar">JD</span>
              <span className="user-name">John Doe</span>
            </button>
          </div>
        </div>
      </header>
      
      <div className="main-container">
        {/* Sidebar */}
        {showSidebar && (
          <aside className={`main-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
            <nav className="sidebar-nav">
              <ul className="nav-list">
                {navItems.map(item => (
                  <li key={item.path} className="nav-item">
                    <Link
                      to={item.path}
                      className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                    >
                      <span className="nav-icon">{item.icon}</span>
                      <span className="nav-label">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            
            <div className="sidebar-footer">
              <p className="copyright">
                &copy; {new Date().getFullYear()} Credit Cooperative
              </p>
            </div>
          </aside>
        )}
        
        {/* Main content */}
        <main className={`main-content ${showSidebar && isSidebarOpen ? 'with-sidebar' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  showSidebar: PropTypes.bool
};

export default MainLayout;
