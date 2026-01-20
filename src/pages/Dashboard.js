import React from 'react';
import { FiDollarSign, FiTrendingUp, FiUsers } from 'react-icons/fi'; // Removed FiPackage
import { FaFish, FaEgg } from 'react-icons/fa';
import StatCard from '../components/StatCard';
import RecentActivity from '../components/RecentActivity';
import './Dashboard.css';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: 4850000,
      icon: <FiDollarSign />,
      color: '#4CAF50',
      change: { value: '12.5%', type: 'positive' }
    },
    {
      title: 'Monthly Expenses',
      value: 1250000,
      icon: <FiTrendingUp />,
      color: '#F44336',
      change: { value: '8.2%', type: 'negative' }
    },
    {
      title: 'Active Poultry',
      value: '1,250',
      icon: <FaEgg />,
      color: '#FF9800'
    },
    {
      title: 'Fish Stock',
      value: '5,000',
      icon: <FaFish />,
      color: '#2196F3'
    }
  ];

  const operations = [
    {
      title: 'Fish Farming',
      icon: <FaFish />,
      status: 'active',
      stock: '5,000 fish',
      nextActivity: 'Harvest in 30 days'
    },
    {
      title: 'Poultry',
      icon: <FaEgg />,
      status: 'active',
      stock: '1,250 birds',
      nextActivity: 'Vaccination tomorrow'
    },
    {
      title: 'Livestock',
      icon: <FiUsers />,
      status: 'planned',
      stock: 'Not started',
      nextActivity: 'Setup next month'
    }
  ];

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Farm Dashboard</h1>
        <div className="date-display">
          {new Date().toLocaleDateString('en-NG', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="dashboard-content">
        <div className="operations-section">
          <h2>Farm Operations</h2>
          <div className="operations-grid">
            {operations.map((op, index) => (
              <div key={index} className="operation-card">
                <div className="operation-header">
                  <div className="operation-icon">
                    {op.icon}
                  </div>
                  <span className={`operation-status ${op.status}`}>
                    {op.status}
                  </span>
                </div>
                <h3>{op.title}</h3>
                <div className="operation-details">
                  <div className="detail-item">
                    <span className="detail-label">Current Stock:</span>
                    <span className="detail-value">{op.stock}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Next Activity:</span>
                    <span className="detail-value">{op.nextActivity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <RecentActivity />
      </div>
    </div>
  );
};

export default Dashboard;