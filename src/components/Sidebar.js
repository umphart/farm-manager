import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, FiDroplet, FiFeather, FiGitMerge, 
  FiDollarSign, FiTrendingUp, FiBarChart2, 
  FiSettings, FiMenu, FiChevronLeft 
} from 'react-icons/fi';
import { FaFish, FaEgg } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const menuItems = [
    { path: '/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { path: '/fish-farming', icon: <FaFish />, label: 'Fish Farming' },
    { path: '/poultry', icon: <FiFeather />, label: 'Poultry' },
    { path: '/livestock', icon: <FiGitMerge />, label: 'Livestock' },
    { path: '/expenses', icon: <FiDollarSign />, label: 'Expenses' },
    { path: '/investments', icon: <FiTrendingUp />, label: 'Investments' },
    { path: '/reports', icon: <FiBarChart2 />, label: 'Reports' },
    { path: '/settings', icon: <FiSettings />, label: 'Settings' },
  ];

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