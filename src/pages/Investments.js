import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrendingUp, FiDollarSign, FiCalendar, FiEdit, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';
import InvestmentModal from '../components/InvestmentModal';
import './Investments.css';

const Investments = () => {
  const { showSuccess, showError, showLoading, dismiss } = useToast();
  
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [roiData, setRoiData] = useState({
    initialInvestment: '',
    monthlyReturn: '',
    timePeriod: '',
    totalReturn: 0,
    roiPercentage: 0,
  });

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    setLoading(true);
    try {
     
      
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        // Check if table doesn't exist
        if (error.code === 'PGRST116' || error.code === '42P01') {
          const errorMsg = 'Investments table not found. Please create it in Supabase first.';
          showError(errorMsg);
          return;
        }
        throw error;
      }

      setInvestments(data || []);
      
   
     
    } catch (error) {
      console.error('Error fetching investments:', error);
      showError('Failed to load investments. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const totalInvestment = investments.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  
  // Calculate average investment amount
  const calculateAverageInvestment = () => {
    if (investments.length === 0) return 0;
    return totalInvestment / investments.length;
  };

  // Get latest investment date
  const getLatestInvestmentDate = () => {
    if (investments.length === 0) return 'N/A';
    return formatDate(investments[0].date); // Already sorted by date descending
  };

  const handleAddInvestment = () => {
    setSelectedInvestment(null);
    setIsModalOpen(true);
  };

  const handleEditInvestment = (investment) => {
    setSelectedInvestment(investment);
    setIsModalOpen(true);
  };

  const handleDeleteInvestment = async (investmentId) => {
    const investmentToDelete = investments.find(inv => inv.id === investmentId);
    
    if (window.confirm(`Are you sure you want to delete this investment: "${investmentToDelete?.name}"? This action cannot be undone.`)) {
      const loadingToast = showLoading('Deleting investment...');
      
      try {
        const { error } = await supabase
          .from('investments')
          .delete()
          .eq('id', investmentId);

        if (error) throw error;
        
        // Update local state
        setInvestments(investments.filter(inv => inv.id !== investmentId));
        
        dismiss(loadingToast);
        showSuccess('Investment deleted successfully!');
      } catch (error) {
        console.error('Error deleting investment:', error);
        dismiss(loadingToast);
        showError('Failed to delete investment. Please try again.');
      }
    }
  };

  const handleSaveInvestment = async (investmentData) => {
    try {
      // Refresh the investments list
      await fetchInvestments();
      setIsModalOpen(false);
      setSelectedInvestment(null);
    } catch (error) {
      console.error('Error handling save:', error);
      showError('Failed to save investment. Please try again.');
    }
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

  const getTypeDisplay = (type) => {
    const typeMap = {
      'infrastructure': 'Infrastructure',
      'equipment': 'Equipment',
      'facility': 'Facility',
      'stock': 'Stock Purchase',
      'technology': 'Technology',
      'land': 'Land Acquisition',
      'other': 'Other'
    };
    return typeMap[type] || type;
  };

  const handleRefresh = () => {
    fetchInvestments();
  };

  return (
    <div className="investments-page">
      <div className="page-header">
        <h1>Investment Tracking</h1>
        <div className="header-actions">
          <button onClick={handleRefresh} className="btn btn-secondary" disabled={loading}>
            <FiRefreshCw /> {loading ? 'Loading...' : 'Refresh'}
          </button>
          <button className="btn btn-primary" onClick={handleAddInvestment} disabled={loading}>
            <FiPlus /> New Investment
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-overlay">
         
        </div>
      ) : (
        <>
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
                <h3>Total Investments</h3>
                <div className="summary-value">{investments.length}</div>
                <div className="summary-label">Investment Records</div>
              </div>
            </div>
            
            <div className="summary-card">
              <div className="summary-icon">
                <FiCalendar />
              </div>
              <div className="summary-content">
                <h3>Latest Investment</h3>
                <div className="summary-value">
                  {getLatestInvestmentDate()}
                </div>
                <div className="summary-label">Most Recent</div>
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-icon">
                <FiTrendingUp />
              </div>
              <div className="summary-content">
                <h3>Average Investment</h3>
                <div className="summary-value">
                  {formatCurrency(calculateAverageInvestment())}
                </div>
                <div className="summary-label">Per Investment</div>
              </div>
            </div>
          </div>

          {investments.length === 0 ? (
            <div className="empty-state">
              <FiDollarSign size={48} />
              <h3>No Investments Found</h3>
              <p>Get started by adding your first investment.</p>
              <button className="btn btn-primary" onClick={handleAddInvestment}>
                <FiPlus /> Add First Investment
              </button>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="desktop-table">
                <div className="section-header">
                  <h2>Recent Investments</h2>
                  <div className="table-summary">
                    <span>Showing {investments.length} investments</span>
                    <span>Total Value: {formatCurrency(totalInvestment)}</span>
                  </div>
                </div>
                <div className="table-wrapper">
                  <table className="investments-table">
                    <thead>
                      <tr>
                        <th>Investment Name</th>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {investments.map(inv => (
                        <tr key={inv.id}>
                          <td>
                            <div className="investment-name">
                              <strong>{inv.name}</strong>
                            </div>
                          </td>
                          <td>
                            <div className="date-cell">
                              <div className="date-day">{formatDate(inv.date)}</div>
                            </div>
                          </td>
                          <td>
                            <span className={`type-badge type-${inv.type}`}>
                              {getTypeDisplay(inv.type)}
                            </span>
                          </td>
                          <td className="amount-cell">{formatCurrency(inv.amount)}</td>
                          <td>
                            <div className="table-actions">
                              <button 
                                className="icon-btn" 
                                onClick={() => handleEditInvestment(inv)}
                                title="Edit Investment"
                              >
                                <FiEdit />
                              </button>
                              <button 
                                className="icon-btn delete" 
                                onClick={() => handleDeleteInvestment(inv.id)}
                                title="Delete Investment"
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

              {/* Mobile Card View */}
              <div className="mobile-card-view">
                <div className="section-header">
                  <h2>Recent Investments</h2>
                  <div className="table-summary">
                    <span>Showing {investments.length} investments</span>
                  </div>
                </div>
                <div className="mobile-cards">
                  {investments.map(inv => (
                    <div key={inv.id} className="mobile-card">
                      <div className="mobile-card-header">
                        <div className="mobile-card-title">
                          <strong>{inv.name}</strong>
                        </div>
                      </div>
                      <div className="mobile-card-details">
                        <div className="mobile-detail-item">
                          <span className="mobile-detail-label">Type</span>
                          <span className={`type-badge type-${inv.type}`}>
                            {getTypeDisplay(inv.type)}
                          </span>
                        </div>
                        <div className="mobile-detail-item">
                          <span className="mobile-detail-label">Date</span>
                          <span className="mobile-detail-value">{formatDate(inv.date)}</span>
                        </div>
                        <div className="mobile-detail-item">
                          <span className="mobile-detail-label">Amount</span>
                          <span className="mobile-detail-value amount">{formatCurrency(inv.amount)}</span>
                        </div>
                      </div>
                      <div className="mobile-card-actions">
                        <button 
                          className="btn btn-sm btn-secondary" 
                          onClick={() => handleEditInvestment(inv)}
                        >
                          <FiEdit /> Edit
                        </button>
                        <button 
                          className="btn btn-sm btn-secondary delete" 
                          onClick={() => handleDeleteInvestment(inv.id)}
                        >
                          <FiTrash2 /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

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
                    disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
                  />
                </div>
                <button className="btn btn-primary" onClick={calculateROI} disabled={loading}>
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
        </>
      )}

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