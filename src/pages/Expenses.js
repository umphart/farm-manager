// src/pages/Expenses.js
import React, { useState, useEffect } from 'react';
import { FiPlus, FiFilter, FiDownload, FiEdit, FiTrash2, FiCalendar, FiDollarSign, FiRefreshCw } from 'react-icons/fi';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';
import ExpenseModal from '../components/ExpenseModal';
import './Expenses.css';

const Expenses = () => {
  const { showSuccess, showError, showLoading, dismiss } = useToast();
  
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [filters, setFilters] = useState({
    category: 'all',
    farmSection: 'all',
    dateFrom: '',
    dateTo: '',
  });
  const [ponds, setPonds] = useState({}); // Store pond names for display

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      setLoading(true);
      
      
      // Fetch expenses from Supabase
      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });

      if (expensesError) {
        // Check if table doesn't exist
        if (expensesError.code === 'PGRST116' || expensesError.code === '42P01') {
          const errorMsg = 'Expenses table not found. Please create it in Supabase first.';
          showError(errorMsg);
          return;
        }
        throw expensesError;
      }

      // Fetch ponds data for linked expenses
      const { data: pondsData, error: pondsError } = await supabase
        .from('ponds')
        .select('id, name');

      if (pondsError && pondsError.code !== 'PGRST116' && pondsError.code !== '42P01') {
        console.warn('Error fetching ponds for expense display:', pondsError);
      }

      // Create a map of pond IDs to names
      const pondsMap = {};
      if (pondsData) {
        pondsData.forEach(pond => {
          pondsMap[pond.id] = pond.name;
        });
      }

      setPonds(pondsMap);
      setExpenses(expensesData || []);
      
      dismiss();
     
    } catch (error) {
      console.error('Error fetching expenses:', error);
      showError('Failed to load expenses. Please check your connection and try again.');
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

  const calculateTotalExpenses = () => {
    return filteredExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  };

  const calculateMonthlyExpenses = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return expenses
      .filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
      })
      .reduce((sum, exp) => sum + (exp.amount || 0), 0);
  };

  const calculateAverageDaily = () => {
    const monthly = calculateMonthlyExpenses();
    return Math.round(monthly / 30);
  };

  const getCategoryDisplay = (category) => {
    const categoryMap = {
      'feed': 'Feed',
      'medication': 'Medication',
      'labor': 'Labor',
      'equipment': 'Equipment',
      'utilities': 'Utilities',
      'transport': 'Transport',
      'maintenance': 'Maintenance',
      'veterinary': 'Veterinary',
      'pond_setup': 'Pond Setup',
      'other': 'Other'
    };
    return categoryMap[category] || category;
  };

  const getFarmSectionDisplay = (section) => {
    const sectionMap = {
      'fish': 'Fish Farming',
      'poultry': 'Poultry',
      'livestock': 'Livestock',
      'general': 'General',
      'administration': 'Administration'
    };
    return sectionMap[section] || section;
  };

  const filteredExpenses = expenses.filter(expense => {
    if (filters.category !== 'all' && expense.category !== filters.category) return false;
    if (filters.farmSection !== 'all' && expense.farm_section !== filters.farmSection) return false;
    if (filters.dateFrom && new Date(expense.date) < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && new Date(expense.date) > new Date(filters.dateTo)) return false;
    return true;
  });

  const handleAddExpense = () => {
    setSelectedExpense(null);
    setIsModalOpen(true);
  };

  const handleEditExpense = (expense) => {
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  const handleDeleteExpense = async (expenseId) => {
    const expenseToDelete = expenses.find(exp => exp.id === expenseId);
    
    if (window.confirm(`Are you sure you want to delete this expense: "${expenseToDelete?.description}"? This action cannot be undone.`)) {
      const loadingToast = showLoading('Deleting expense...');
      
      try {
        const { error } = await supabase
          .from('expenses')
          .delete()
          .eq('id', expenseId);

        if (error) throw error;
        
        // Update local state
        setExpenses(expenses.filter(exp => exp.id !== expenseId));
        
        dismiss(loadingToast);
        showSuccess('Expense deleted successfully!');
      } catch (error) {
        console.error('Error deleting expense:', error);
        dismiss(loadingToast);
        showError('Failed to delete expense. Please try again.');
      }
    }
  };

  const handleSaveExpense = async (expenseData) => {
    try {
      // Refresh the expenses list
      await fetchExpenses();
      setIsModalOpen(false);
      setSelectedExpense(null);
    } catch (error) {
      console.error('Error handling save:', error);
      showError('Failed to save expense. Please try again.');
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      category: 'all',
      farmSection: 'all',
      dateFrom: '',
      dateTo: '',
    });
    showSuccess('Filters reset successfully!');
  };

  const handleExportData = async () => {
    try {
      // Create CSV content
      const headers = ['Date', 'Category', 'Description', 'Farm Section', 'Amount (₦)', 'Payment Method', 'Receipt No', 'Notes', 'Linked Pond'];
      const csvRows = [
        headers.join(','),
        ...filteredExpenses.map(exp => [
          exp.date,
          getCategoryDisplay(exp.category),
          `"${exp.description.replace(/"/g, '""')}"`,
          getFarmSectionDisplay(exp.farm_section),
          exp.amount,
          exp.payment_method || '',
          exp.receipt_no || '',
          `"${(exp.notes || '').replace(/"/g, '""')}"`,
          exp.pond_id ? ponds[exp.pond_id] || '' : ''
        ].join(','))
      ].join('\n');

      // Create and download CSV file
      const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `expenses_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showSuccess('Expenses exported successfully!');
    } catch (error) {
      console.error('Error exporting data:', error);
      showError('Failed to export expenses. Please try again.');
    }
  };

  const handleRefresh = () => {
    fetchExpenses();
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'feed', label: 'Feed' },
    { value: 'medication', label: 'Medication' },
    { value: 'labor', label: 'Labor' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'transport', label: 'Transport' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'veterinary', label: 'Veterinary' },
    { value: 'pond_setup', label: 'Pond Setup' },
    { value: 'other', label: 'Other' }
  ];

  const farmSections = [
    { value: 'all', label: 'All Sections' },
    { value: 'fish', label: 'Fish Farming' },
    { value: 'poultry', label: 'Poultry' },
    { value: 'livestock', label: 'Livestock' },
    { value: 'general', label: 'General' },
    { value: 'administration', label: 'Administration' }
  ];

  // Calculate category breakdown for chart
  const categoryBreakdown = categories
    .filter(cat => cat.value !== 'all')
    .map(category => {
      const categoryTotal = filteredExpenses
        .filter(exp => exp.category === category.value)
        .reduce((sum, exp) => sum + (exp.amount || 0), 0);
      
      return {
        ...category,
        total: categoryTotal,
        percentage: calculateTotalExpenses() > 0 
          ? (categoryTotal / calculateTotalExpenses() * 100).toFixed(1)
          : 0
      };
    })
    .filter(cat => cat.total > 0)
    .sort((a, b) => b.total - a.total);

  // Calculate section breakdown for chart
  const sectionBreakdown = farmSections
    .filter(section => section.value !== 'all')
    .map(section => {
      const sectionTotal = filteredExpenses
        .filter(exp => exp.farm_section === section.value)
        .reduce((sum, exp) => sum + (exp.amount || 0), 0);
      
      return {
        ...section,
        total: sectionTotal,
        percentage: calculateTotalExpenses() > 0 
          ? (sectionTotal / calculateTotalExpenses() * 100).toFixed(1)
          : 0
      };
    })
    .filter(section => section.total > 0)
    .sort((a, b) => b.total - a.total);

  return (
    <div className="expenses-page">
      <div className="page-header">
        <h1>Expense Management</h1>
        <div className="header-actions">
          <button onClick={handleRefresh} className="btn btn-secondary" disabled={loading}>
            <FiRefreshCw /> {loading ? 'Loading...' : 'Refresh'}
          </button>
          <button className="btn btn-primary" onClick={handleAddExpense} disabled={loading}>
            <FiPlus /> Add New Expense
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="expenses-summary">
        <div className="summary-card">
          <div className="summary-icon">
            <FiDollarSign />
          </div>
          <div className="summary-content">
            <h3>Total Expenses</h3>
            <div className="summary-value">{formatCurrency(calculateTotalExpenses())}</div>
            <div className="summary-label">All Time Records</div>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon">
            <FiCalendar />
          </div>
          <div className="summary-content">
            <h3>Monthly Expenses</h3>
            <div className="summary-value">{formatCurrency(calculateMonthlyExpenses())}</div>
            <div className="summary-label">Current Month</div>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon">
            <FiDollarSign />
          </div>
          <div className="summary-content">
            <h3>Average Daily</h3>
            <div className="summary-value">{formatCurrency(calculateAverageDaily())}</div>
            <div className="summary-label">Per Day Average</div>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon">
            <FiFilter />
          </div>
          <div className="summary-content">
            <h3>Active Records</h3>
            <div className="summary-value">{expenses.length}</div>
            <div className="summary-label">Expense Entries</div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="category">Category</label>
            <select 
              id="category"
              className="filter-select"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              disabled={loading}
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="farmSection">Farm Section</label>
            <select 
              id="farmSection"
              className="filter-select"
              value={filters.farmSection}
              onChange={(e) => handleFilterChange('farmSection', e.target.value)}
              disabled={loading}
            >
              {farmSections.map(section => (
                <option key={section.value} value={section.value}>{section.label}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="dateFrom">Date From</label>
            <input 
              id="dateFrom"
              type="date" 
              className="filter-select"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="dateTo">Date To</label>
            <input 
              id="dateTo"
              type="date" 
              className="filter-select"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              disabled={loading}
            />
          </div>
        </div>
        
    
      </div>

      {loading ? (
        <div className="loading-overlay">
         
        </div>
      ) : filteredExpenses.length === 0 ? (
        <div className="empty-state">
          <FiDollarSign size={48} />
          <h3>No Expenses Found</h3>
          <p>{expenses.length === 0 ? "Get started by adding your first expense." : "No expenses match your filters."}</p>
          <button className="btn btn-primary" onClick={handleAddExpense}>
            <FiPlus /> Add First Expense
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="desktop-table">
            <table className="expenses-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Farm Section</th>
                  <th>Amount</th>
                  
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map(expense => (
                  <tr key={expense.id}>
                    <td>
                      <div className="date-cell">
                        <div className="date-day">{formatDate(expense.date)}</div>
                        <div className="date-weekday">
                          {new Date(expense.date).toLocaleDateString('en-NG', { weekday: 'short' })}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`category-badge category-${expense.category}`}>
                        {getCategoryDisplay(expense.category)}
                      </span>
                    </td>
                    <td>
                      <div className="description-cell">
                        <div className="description-main">{expense.description}</div>
                        {expense.notes && (
                          <div className="description-notes">{expense.notes}</div>
                        )}
                        {expense.receipt_no && (
                          <div className="description-receipt">Receipt: {expense.receipt_no}</div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="farm-section">
                        {getFarmSectionDisplay(expense.farm_section)}
                      </span>
                    </td>
                    <td className="amount-cell">{formatCurrency(expense.amount)}</td>
                    
                    <td>
                      <div className="table-actions">
                        <button 
                          className="icon-btn" 
                          onClick={() => handleEditExpense(expense)}
                          title="Edit Expense"
                        >
                          <FiEdit />
                        </button>
                        <button 
                          className="icon-btn delete" 
                          onClick={() => handleDeleteExpense(expense.id)}
                          title="Delete Expense"
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

          {/* Mobile Card View */}
          <div className="mobile-card-view">
            {filteredExpenses.map(expense => (
              <div key={expense.id} className="expense-card">
                <div className="expense-card-header">
                  <div className="expense-card-date">
                    <div className="date-day">{formatDate(expense.date)}</div>
                    <div className="date-weekday">
                      {new Date(expense.date).toLocaleDateString('en-NG', { weekday: 'long' })}
                    </div>
                  </div>
                  <div className="expense-card-amount">{formatCurrency(expense.amount)}</div>
                </div>
                
                <div className="expense-card-details">
                  <div className="expense-card-row">
                    <span className="expense-card-label">Category:</span>
                    <span className={`category-badge category-${expense.category}`}>
                      {getCategoryDisplay(expense.category)}
                    </span>
                  </div>
                  
                  <div className="expense-card-row">
                    <span className="expense-card-label">Farm Section:</span>
                    <span className="expense-card-value">
                      {getFarmSectionDisplay(expense.farm_section)}
                    </span>
                  </div>
                  
                  {expense.pond_id && (
                    <div className="expense-card-row">
                      <span className="expense-card-label">Linked Pond:</span>
                      <span className="expense-card-value pond-link">
                        {ponds[expense.pond_id] || 'Pond #' + expense.pond_id}
                      </span>
                    </div>
                  )}
                  
                  {expense.receipt_no && (
                    <div className="expense-card-row">
                      <span className="expense-card-label">Receipt No:</span>
                      <span className="expense-card-value receipt-number">
                        {expense.receipt_no}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="expense-card-description">
                  <div className="description-main">{expense.description}</div>
                  {expense.notes && (
                    <div className="description-notes">{expense.notes}</div>
                  )}
                </div>
                
                <div className="expense-card-actions">
                  <button 
                    className="icon-btn" 
                    onClick={() => handleEditExpense(expense)}
                    title="Edit Expense"
                  >
                    <FiEdit /> Edit
                  </button>
                  <button 
                    className="icon-btn delete" 
                    onClick={() => handleDeleteExpense(expense.id)}
                    title="Delete Expense"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="expenses-chart">
            <h3>Expense Breakdown Analysis</h3>
            <div className="chart-container">
              <div className="chart-summary">
                <h4>Expenses by Category</h4>
                <div className="category-breakdown">
                  {categoryBreakdown.map(category => (
                    <div key={category.value} className="category-item">
                      <div className="category-info">
                        <span className="category-name">{category.label}</span>
                        <span className="category-amount">{formatCurrency(category.total)}</span>
                      </div>
                      <div className="category-bar">
                        <div 
                          className="category-fill" 
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                      <div className="category-percentage">{category.percentage}% of total</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="chart-summary">
                <h4>Expenses by Farm Section</h4>
                <div className="section-breakdown">
                  {sectionBreakdown.map(section => (
                    <div key={section.value} className="section-item">
                      <div className="section-name">{section.label}</div>
                      <div className="section-amount">{formatCurrency(section.total)}</div>
                      <div className="section-percentage">{section.percentage}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Expense Modal */}
      <ExpenseModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveExpense}
        expense={selectedExpense}
      />
    </div>
  );
};

export default Expenses;