import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FiHome, FiFeather, FiGitMerge, 
  FiDollarSign, FiTrendingUp, FiBarChart2, 
  FiSettings, FiMenu, FiChevronLeft, FiPackage,
  FiLogOut // Added logout icon
} from 'react-icons/fi';
import { FaFish, FaEgg } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ sidebarOpen, setSidebarOpen, onLogout }) => {
  const navigate = useNavigate();
  
  const menuItems = [
    { path: '/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { path: '/fish-farming', icon: <FaFish />, label: 'Fish Farming' },
    { path: '/poultry', icon: <FiFeather />, label: 'Poultry' },
    { path: '/livestock', icon: <FiGitMerge />, label: 'Livestock' },
    { path: '/equipment', icon: <FiPackage />, label: 'Equipment' },
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

  // Handle logout
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Fallback logout logic
      localStorage.removeItem('isAuthenticated');
    }
    navigate('/login');
    handleNavClick(); // Close sidebar on mobile
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
          
          {/* Logout Button - Separated from other navigation items */}
          <div className="logout-container">
            <button 
              className="logout-btn"
              onClick={handleLogout}
              title="Logout"
            >
              <span className="nav-icon"><FiLogOut /></span>
              {sidebarOpen && <span className="nav-label">Logout</span>}
            </button>
          </div>
        </nav>
        
        {/* Optional: User info section */}
        {sidebarOpen && (
          <div className="sidebar-footer">
            <div className="user-info">
              <div className="user-avatar">
                <span>SM</span>
              </div>
              <div className="user-details">
                <p className="user-name">Sman Farm</p>
                <p className="user-role">Administrator</p>
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