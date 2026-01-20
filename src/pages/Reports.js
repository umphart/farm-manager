import React, { useState } from 'react';
import { FiDownload, FiFilter, FiPrinter, FiCalendar } from 'react-icons/fi';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('financial');

  const reports = [
    { id: 'financial', name: 'Financial Report', description: 'Income, expenses, and profit analysis' },
    { id: 'production', name: 'Production Report', description: 'Fish and poultry production metrics' },
    { id: 'inventory', name: 'Inventory Report', description: 'Current stock and supplies status' },
    { id: 'health', name: 'Health Report', description: 'Animal health and vaccination records' },
    { id: 'sales', name: 'Sales Report', description: 'Sales transactions and revenue' },
    { id: 'growth', name: 'Growth Report', description: 'Farm growth and expansion metrics' },
  ];

  const reportData = {
    financial: [
      { month: 'Jan 2024', income: 2850000, expenses: 1250000, profit: 1600000 },
      { month: 'Dec 2023', income: 2650000, expenses: 1150000, profit: 1500000 },
      { month: 'Nov 2023', income: 2450000, expenses: 1050000, profit: 1400000 },
    ],
    production: [
      { product: 'Catfish', quantity: '5000 kg', value: '₦12,500,000' },
      { product: 'Poultry Eggs', quantity: '37,500 pieces', value: '₦1,875,000' },
      { product: 'Poultry Meat', quantity: '250 kg', value: '₦1,250,000' },
    ]
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="reports-page">
      <div className="page-header">
        <h1>Farm Reports</h1>
        <div className="header-actions">
          <button className="btn btn-secondary">
            <FiPrinter /> Print
          </button>
          <button className="btn btn-primary">
            <FiDownload /> Export PDF
          </button>
        </div>
      </div>

      <div className="reports-container">
        <div className="reports-sidebar">
          <h3>Report Types</h3>
          <div className="report-types">
            {reports.map(report => (
              <button
                key={report.id}
                className={`report-type-btn ${selectedReport === report.id ? 'active' : ''}`}
                onClick={() => setSelectedReport(report.id)}
              >
                <div className="report-name">{report.name}</div>
                <div className="report-desc">{report.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="reports-content">
          <div className="report-filters">
            <div className="filter-group">
              <label>
                <FiCalendar /> Date Range
              </label>
              <select className="form-control">
                <option>Last 30 days</option>
                <option>Last 3 months</option>
                <option>Last 6 months</option>
                <option>Year to date</option>
                <option>Custom range</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Farm Section</label>
              <select className="form-control">
                <option>All Sections</option>
                <option>Fish Farming</option>
                <option>Poultry</option>
                <option>Livestock</option>
              </select>
            </div>
            <button className="btn btn-primary">
              <FiFilter /> Generate Report
            </button>
          </div>

          <div className="report-preview">
            <h3>{reports.find(r => r.id === selectedReport)?.name}</h3>
            <div className="report-data">
              {selectedReport === 'financial' && (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Income</th>
                      <th>Expenses</th>
                      <th>Profit</th>
                      <th>Margin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.financial.map((row, index) => (
                      <tr key={index}>
                        <td>{row.month}</td>
                        <td>{formatCurrency(row.income)}</td>
                        <td>{formatCurrency(row.expenses)}</td>
                        <td className="profit">{formatCurrency(row.profit)}</td>
                        <td className="margin">{((row.profit / row.income) * 100).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              
              {selectedReport === 'production' && (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Value</th>
                      <th>Growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.production.map((row, index) => (
                      <tr key={index}>
                        <td>{row.product}</td>
                        <td>{row.quantity}</td>
                        <td>{row.value}</td>
                        <td className="growth">+12.5%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="report-insights">
            <h4>Key Insights</h4>
            <div className="insights-grid">
              <div className="insight-card">
                <h5>Best Performing</h5>
                <div className="insight-value">Fish Farming</div>
                <div className="insight-desc">65% of total revenue</div>
              </div>
              <div className="insight-card">
                <h5>Fastest Growing</h5>
                <div className="insight-value">Poultry</div>
                <div className="insight-desc">+18% monthly growth</div>
              </div>
              <div className="insight-card">
                <h5>Cost Reduction</h5>
                <div className="insight-value">-8.2%</div>
                <div className="insight-desc">Feed costs reduced</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;