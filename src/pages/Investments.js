import React, { useState } from 'react';
import { FiPlus, FiTrendingUp, FiDollarSign, FiCalendar, FiEdit, FiTrash2 } from 'react-icons/fi';
import { useToast } from '../contexts/ToastContext';
import InvestmentModal from '../components/InvestmentModal';
import './Investments.css';

const Investments = () => {
  const { showSuccess, showError } = useToast();
  
  const [investments, setInvestments] = useState([
    { 
      id: 1, 
      name: 'New Fish Ponds', 
      amount: 1200000, 
      date: '2024-01-10', 
      type: 'Infrastructure', 
      description: 'Construction of 3 new fish ponds',
      expectedROI: '15',
      duration: '12',
      status: 'in-progress',
      notes: 'Includes excavation and water system installation'
    },
    { 
      id: 2, 
      name: 'Poultry Expansion', 
      amount: 850000, 
      date: '2024-01-05', 
      type: 'Equipment', 
      description: 'Purchase of automated feeding systems',
      expectedROI: '18',
      duration: '6',
      status: 'completed',
      notes: 'Installed in House A and B'
    },
    { 
      id: 3, 
      name: 'Feed Storage', 
      amount: 350000, 
      date: '2023-12-20', 
      type: 'Facility', 
      description: 'Construction of feed storage facility',
      expectedROI: '12',
      duration: '24',
      status: 'completed',
      notes: 'Capacity: 10 tons'
    },
    { 
      id: 4, 
      name: 'Water System', 
      amount: 280000, 
      date: '2023-12-15', 
      type: 'Infrastructure', 
      description: 'Borehole and irrigation system',
      expectedROI: '10',
      duration: '18',
      status: 'in-progress',
      notes: 'Includes water treatment system'
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [roiData, setRoiData] = useState({
    initialInvestment: '',
    monthlyReturn: '',
    timePeriod: '',
    totalReturn: 0,
    roiPercentage: 0,
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalInvestment = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const activeProjects = investments.filter(inv => inv.status === 'in-progress').length;
  const completedProjects = investments.filter(inv => inv.status === 'completed').length;
  
  const calculateAverageROI = () => {
    const rois = investments
      .filter(inv => inv.expectedROI)
      .map(inv => parseFloat(inv.expectedROI));
    
    if (rois.length === 0) return '0%';
    
    const average = rois.reduce((sum, roi) => sum + roi, 0) / rois.length;
    return `${average.toFixed(1)}%`;
  };

  const handleAddInvestment = () => {
    setSelectedInvestment(null);
    setIsModalOpen(true);
  };

  const handleEditInvestment = (investment) => {
    setSelectedInvestment(investment);
    setIsModalOpen(true);
  };

  const handleDeleteInvestment = (investmentId) => {
    if (window.confirm('Are you sure you want to delete this investment? This action cannot be undone.')) {
      setInvestments(investments.filter(inv => inv.id !== investmentId));
      showSuccess('Investment deleted successfully!');
    }
  };

  const handleSaveInvestment = (investmentData) => {
    if (selectedInvestment) {
      // Update existing investment
      setInvestments(investments.map(inv => 
        inv.id === selectedInvestment.id 
          ? { ...selectedInvestment, ...investmentData, type: investmentData.type.charAt(0).toUpperCase() + investmentData.type.slice(1) }
          : inv
      ));
      showSuccess('Investment updated successfully!');
    } else {
      // Add new investment
      const newInvestment = {
        id: Date.now(),
        ...investmentData,
        type: investmentData.type.charAt(0).toUpperCase() + investmentData.type.slice(1),
      };
      setInvestments([...investments, newInvestment]);
      showSuccess('New investment created successfully!');
    }
    setIsModalOpen(false);
  };

  const handleRoiInputChange = (field, value) => {
    setRoiData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateROI = () => {
    const initial = parseFloat(roiData.initialInvestment) || 0;
    const monthlyReturn = parseFloat(roiData.monthlyReturn) || 0;
    const months = parseFloat(roiData.timePeriod) || 0;

    if (initial > 0 && months > 0) {
      const totalReturn = monthlyReturn * months;
      const roiPercentage = ((totalReturn - initial) / initial) * 100;
      
      setRoiData(prev => ({
        ...prev,
        totalReturn,
        roiPercentage: roiPercentage.toFixed(2)
      }));
      
      showSuccess('ROI calculated successfully!');
    } else {
      showError('Please enter valid values for calculation');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'planned': return 'status-planned';
      case 'in-progress': return 'status-in-progress';
      case 'completed': return 'status-completed';
      case 'delayed': return 'status-delayed';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-planned';
    }
  };

  const getStatusDisplay = (status) => {
    switch(status) {
      case 'planned': return 'Planned';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'delayed': return 'Delayed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  return (
    <div className="investments-page">
      <div className="page-header">
        <h1>Investment Tracking</h1>
        <button className="btn btn-primary" onClick={handleAddInvestment}>
          <FiPlus /> New Investment
        </button>
      </div>

      <div className="investments-summary">
        <div className="summary-card">
          <div className="summary-icon">
            <FiDollarSign />
          </div>
          <div className="summary-content">
            <h3>Total Investment</h3>
            <div className="summary-value">{formatCurrency(totalInvestment)}</div>
            <div className="summary-label">All Investments</div>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon">
            <FiTrendingUp />
          </div>
          <div className="summary-content">
            <h3>Average ROI</h3>
            <div className="summary-value">{calculateAverageROI()}</div>
            <div className="summary-label">Expected Return</div>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon">
            <FiCalendar />
          </div>
          <div className="summary-content">
            <h3>Active Projects</h3>
            <div className="summary-value">{activeProjects}</div>
            <div className="summary-label">of {investments.length} total</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <FiTrendingUp />
          </div>
          <div className="summary-content">
            <h3>Completed</h3>
            <div className="summary-value">{completedProjects}</div>
            <div className="summary-label">Projects</div>
          </div>
        </div>
      </div>

      <div className="investments-table">
        <div className="section-header">
          <h2>Recent Investments</h2>
          <div className="table-summary">
            <span>Showing {investments.length} investments</span>
          </div>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Investment</th>
                <th>Type</th>
                <th>Date</th>
                <th>Amount</th>
                <th>ROI</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {investments.map(inv => (
                <tr key={inv.id}>
                  <td>
                    <div className="investment-name">
                      <strong>{inv.name}</strong>
                      {inv.description && (
                        <div className="investment-description">{inv.description}</div>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`type-badge type-${inv.type.toLowerCase()}`}>
                      {inv.type}
                    </span>
                  </td>
                  <td>{inv.date}</td>
                  <td className="amount">{formatCurrency(inv.amount)}</td>
                  <td className="roi">{inv.expectedROI}%</td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(inv.status)}`}>
                      {getStatusDisplay(inv.status)}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="icon-btn" 
                        onClick={() => handleEditInvestment(inv)}
                        title="Edit"
                      >
                        <FiEdit />
                      </button>
                      <button 
                        className="icon-btn delete" 
                        onClick={() => handleDeleteInvestment(inv.id)}
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="roi-calculator">
        <h2>ROI Calculator</h2>
        <div className="calculator-container">
          <div className="calculator-form">
            <div className="form-group">
              <label>Initial Investment (₦)</label>
              <input 
                type="number" 
                className="form-control" 
                placeholder="Enter amount"
                value={roiData.initialInvestment}
                onChange={(e) => handleRoiInputChange('initialInvestment', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Monthly Return (₦)</label>
              <input 
                type="number" 
                className="form-control" 
                placeholder="Expected monthly return"
                value={roiData.monthlyReturn}
                onChange={(e) => handleRoiInputChange('monthlyReturn', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Time Period (months)</label>
              <input 
                type="number" 
                className="form-control" 
                placeholder="Number of months"
                value={roiData.timePeriod}
                onChange={(e) => handleRoiInputChange('timePeriod', e.target.value)}
              />
            </div>
            <button className="btn btn-primary" onClick={calculateROI}>
              Calculate ROI
            </button>
          </div>
          
          <div className="calculation-result">
            <h4>Projected Results</h4>
            <div className="result-grid">
              <div className="result-item">
                <span>Total Return:</span>
                <strong>{formatCurrency(roiData.totalReturn)}</strong>
              </div>
              <div className="result-item">
                <span>Net Profit:</span>
                <strong>{formatCurrency(roiData.totalReturn - (parseFloat(roiData.initialInvestment) || 0))}</strong>
              </div>
              <div className="result-item">
                <span>ROI Percentage:</span>
                <strong className={roiData.roiPercentage >= 0 ? 'positive' : 'negative'}>
                  {roiData.roiPercentage}%
                </strong>
              </div>
              <div className="result-item">
                <span>Monthly ROI:</span>
                <strong>{roiData.timePeriod ? (parseFloat(roiData.roiPercentage) / parseFloat(roiData.timePeriod)).toFixed(2) + '%' : '0%'}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <InvestmentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveInvestment}
        investment={selectedInvestment}
      />
    </div>
  );
};

export default Investments;