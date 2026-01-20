import React from 'react';
import { FiActivity, FiDollarSign, FiPackage } from 'react-icons/fi';
import { FaFish, FaEgg } from 'react-icons/fa';
import './RecentActivity.css';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'expense',
      icon: <FiDollarSign />,
      title: 'Feed Purchase',
      description: 'Purchased 50 bags of fish feed',
      amount: '₦450,000',
      time: '2 hours ago',
      color: '#F44336'
    },
    {
      id: 2,
      type: 'activity',
      icon: <FaFish />,
      title: 'Fish Harvest',
      description: 'Harvested 500kg of catfish',
      amount: '₦1,200,000',
      time: '1 day ago',
      color: '#2196F3'
    },
    {
      id: 3,
      type: 'stock',
      icon: <FiPackage />,
      title: 'New Stock',
      description: 'Added 500 new fingerlings',
      amount: '₦150,000',
      time: '2 days ago',
      color: '#4CAF50'
    },
    {
      id: 4,
      type: 'maintenance',
      icon: <FiActivity />,
      title: 'Pond Maintenance',
      description: 'Cleaned and treated Pond B',
      amount: '₦75,000',
      time: '3 days ago',
      color: '#FF9800'
    },
    {
      id: 5,
      type: 'poultry',
      icon: <FaEgg />,
      title: 'Egg Collection',
      description: 'Collected 1,250 eggs today',
      amount: '₦62,500',
      time: '4 days ago',
      color: '#9C27B0'
    }
  ];

  return (
    <div className="recent-activity">
      <div className="activity-header">
        <h2>Recent Activity</h2>
        <button className="btn btn-sm">View All</button>
      </div>
      
      <div className="activity-list">
        {activities.map(activity => (
          <div key={activity.id} className="activity-item">
            <div 
              className="activity-icon"
              style={{ backgroundColor: `${activity.color}20`, color: activity.color }}
            >
              {activity.icon}
            </div>
            <div className="activity-content">
              <div className="activity-title">{activity.title}</div>
              <div className="activity-description">{activity.description}</div>
              <div className="activity-time">{activity.time}</div>
            </div>
            <div className="activity-amount">{activity.amount}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;