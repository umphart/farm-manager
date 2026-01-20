import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, FiFeather, FiGitMerge, 
  FiDollarSign, FiTrendingUp, FiBarChart2, 
  FiSettings, FiMenu, FiChevronLeft,FiPackage
} from 'react-icons/fi';
import { FaFish, FaEgg } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
const menuItems = [
  { path: '/dashboard', icon: <FiHome />, label: 'Dashboard' },
  { path: '/fish-farming', icon: <FaFish />, label: 'Fish Farming' },
  { path: '/poultry', icon: <FiFeather />, label: 'Poultry' },
  { path: '/livestock', icon: <FiGitMerge />, label: 'Livestock' },
  { path: '/equipment', icon: <FiPackage />, label: 'Equipment' }, // New item
  { path: '/expenses', icon: <FiDollarSign />, label: 'Expenses' },
  { path: '/investments', icon: <FiTrendingUp />, label: 'Investments' },
  { path: '/reports', icon: <FiBarChart2 />, label: 'Reports' },
  { path: '/settings', icon: <FiSettings />, label: 'Settings' },
];

  // Close sidebar on mobile when clicking a link
  const handleNavClick = () => {
    if (window.innerWidth <= 992) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <FaEgg className="logo-icon" />
            {sidebarOpen && <h2>Sman Farm</h2>}
          </div>
          <button 
            className="toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? <FiChevronLeft /> : <FiMenu />}
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `nav-item ${isActive ? 'active' : ''}`
              }
              onClick={handleNavClick}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </NavLink>
          ))}
        </nav>
        
        {sidebarOpen && (
          <div className="sidebar-footer">
            <div className="farm-stats">
              <h4>Farm Overview</h4>
              <div className="stat-item">
                <span>Active Operations:</span>
                <span className="stat-value">3</span>
              </div>
              <div className="stat-item">
                <span>Total Expenses:</span>
                <span className="stat-value">₦2,450,000</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Mobile menu toggle button - shown only on mobile when sidebar is closed */}
      {!sidebarOpen && (
        <button 
          className="mobile-menu-toggle"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <FiMenu />
        </button>
      )}
      
      {/* Overlay for mobile - shown when sidebar is open on mobile */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;