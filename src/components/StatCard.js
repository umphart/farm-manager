import React from 'react';
import './StatCard.css';

const StatCard = ({ title, value, icon, color, change }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="stat-card">
      <div className="stat-header">
        <h3 className="stat-title">{title}</h3>
        <div className="stat-icon" style={{ backgroundColor: `${color}20`, color: color }}>
          {icon}
        </div>
      </div>
      <div className="stat-value">
        {typeof value === 'number' ? formatCurrency(value) : value}
      </div>
      {change && (
        <div className={`stat-change ${change.type}`}>
          {change.value} {change.type === 'positive' ? '↑' : '↓'}
        </div>
      )}
    </div>
  );
};

export default StatCard;