import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiTrendingUp, FiUsers, FiPackage, FiRefreshCw, FiActivity } from 'react-icons/fi';
import { FaFish, FaEgg, FaTractor } from 'react-icons/fa';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';
import StatCard from '../components/StatCard';
import RecentActivity from '../components/RecentActivity';
import './Dashboard.css';

const Dashboard = () => {
  const { showSuccess, showError, showLoading, dismiss } = useToast();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState([]);
  const [operations, setOperations] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
     

      // Fetch all data in parallel
      const [
        pondsData,
        poultryData,
        livestockData,
        expensesData,
        investmentsData,
        equipmentData
      ] = await Promise.all([
        fetchPonds(),
        fetchPoultry(),
        fetchLivestock(),
        fetchExpenses(),
        fetchInvestments(),
        fetchEquipment()
      ]);

      // Process all data
      processDashboardData(
        pondsData,
        poultryData,
        livestockData,
        expensesData,
        investmentsData,
        equipmentData
      );

      dismiss();
     
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      showError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Data fetching functions
  const fetchPonds = async () => {
    try {
      const { data, error } = await supabase
        .from('ponds')
        .select('*');
      return error ? [] : data || [];
    } catch (error) {
      console.error('Error fetching ponds:', error);
      return [];
    }
  };

  const fetchPoultry = async () => {
    try {
      const { data, error } = await supabase
        .from('poultry_batches')
        .select('*');
      return error ? [] : data || [];
    } catch (error) {
      console.error('Error fetching poultry:', error);
      return [];
    }
  };

  const fetchLivestock = async () => {
    try {
      const { data, error } = await supabase
        .from('livestock')
        .select('*');
      return error ? [] : data || [];
    } catch (error) {
      console.error('Error fetching livestock:', error);
      return [];
    }
  };

  const fetchExpenses = async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false })
        .limit(10);
      return error ? [] : data || [];
    } catch (error) {
      console.error('Error fetching expenses:', error);
      return [];
    }
  };

  const fetchInvestments = async () => {
    try {
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .order('date', { ascending: false })
        .limit(10);
      return error ? [] : data || [];
    } catch (error) {
      console.error('Error fetching investments:', error);
      return [];
    }
  };

  const fetchEquipment = async () => {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      return error ? [] : data || [];
    } catch (error) {
      console.error('Error fetching equipment:', error);
      return [];
    }
  };

  // Process all dashboard data
  const processDashboardData = (
    ponds,
    poultry,
    livestock,
    expenses,
    investments,
    equipment
  ) => {
    // Calculate stats
    const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
    const totalInvestments = investments.reduce((sum, inv) => sum + (inv.amount || 0), 0);
    const totalFish = ponds.reduce((sum, pond) => sum + (pond.current_stock || 0), 0);
    const totalPoultry = poultry.reduce((sum, batch) => sum + (batch.quantity || 0), 0);
    const totalLivestock = livestock.length;
    const totalEquipment = equipment.reduce((sum, item) => sum + (item.quantity || 0), 0);
    
    // Format currency
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount || 0);
    };

    // Calculate fish capacity utilization
    const totalCapacity = ponds.reduce((sum, pond) => sum + (pond.capacity || 0), 0);
    const capacityUtilization = totalCapacity > 0 
      ? Math.round((totalFish / totalCapacity) * 100) 
      : 0;

    // Calculate monthly expenses (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const monthlyExpenses = expenses
      .filter(exp => new Date(exp.date) >= thirtyDaysAgo)
      .reduce((sum, exp) => sum + (exp.amount || 0), 0);

    // Calculate trend (compared to previous month)
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    const previousMonthlyExpenses = expenses
      .filter(exp => {
        const expDate = new Date(exp.date);
        return expDate >= sixtyDaysAgo && expDate < thirtyDaysAgo;
      })
      .reduce((sum, exp) => sum + (exp.amount || 0), 0);

    const expenseTrend = previousMonthlyExpenses > 0 
      ? ((monthlyExpenses - previousMonthlyExpenses) / previousMonthlyExpenses * 100).toFixed(1)
      : 0;

    // Update stats
    setStats([
      {
        title: 'Total Investment',
        value: formatCurrency(totalInvestments),
        icon: <FiDollarSign />,
        color: '#4CAF50',
        change: { 
          value: totalInvestments > 0 ? 'Active' : 'No Investment', 
          type: totalInvestments > 0 ? 'positive' : 'neutral' 
        }
      },
      {
        title: 'Monthly Expenses',
        value: formatCurrency(monthlyExpenses),
        icon: <FiTrendingUp />,
        color: '#F44336',
        change: { 
          value: `${expenseTrend >= 0 ? '+' : ''}${expenseTrend}%`, 
          type: expenseTrend <= 0 ? 'positive' : 'negative' 
        }
      },
      {
        title: 'Total Poultry',
        value: totalPoultry.toLocaleString(),
        icon: <FaEgg />,
        color: '#FF9800',
        change: { 
          value: `${poultry.length} batches`, 
          type: 'neutral' 
        }
      },
      {
        title: 'Fish Stock',
        value: totalFish.toLocaleString(),
        icon: <FaFish />,
        color: '#2196F3',
        change: { 
          value: `${capacityUtilization}% capacity used`, 
          type: capacityUtilization > 80 ? 'positive' : 'neutral' 
        }
      },
      {
        title: 'Livestock',
        value: totalLivestock.toString(),
        icon: <FiUsers />,
        color: '#9C27B0',
        change: { 
          value: `${livestock.length} animals`, 
          type: 'neutral' 
        }
      },
      {
        title: 'Equipment',
        value: totalEquipment.toString(),
        icon: <FiPackage />,
        color: '#795548',
        change: { 
          value: `${equipment.length} items`, 
          type: 'neutral' 
        }
      }
    ]);

    // Update operations
    setOperations([
      {
        title: 'Fish Farming',
        icon: <FaFish />,
        status: ponds.length > 0 ? 'active' : 'inactive',
        stock: `${totalFish} fish`,
        capacity: `${totalCapacity} capacity`,
        ponds: ponds.length,
        nextActivity: totalFish > 0 ? 'Stock monitoring' : 'Setup needed'
      },
      {
        title: 'Poultry',
        icon: <FaEgg />,
        status: poultry.length > 0 ? 'active' : 'inactive',
        stock: `${totalPoultry} birds`,
        batches: poultry.length,
        dailyEggs: poultry.reduce((sum, batch) => sum + (batch.daily_eggs || 0), 0),
        nextActivity: poultry.length > 0 ? 'Daily feeding' : 'Setup needed'
      },
      {
        title: 'Livestock',
        icon: <FiUsers />,
        status: livestock.length > 0 ? 'active' : 'inactive',
        stock: `${livestock.length} animals`,
        value: formatCurrency(livestock.reduce((sum, animal) => sum + (animal.purchase_price || 0), 0)),
        nextActivity: livestock.length > 0 ? 'Health check' : 'Setup needed'
      },
      {
        title: 'Equipment',
        icon: <FiPackage />,
        status: equipment.length > 0 ? 'active' : 'inactive',
        stock: `${totalEquipment} items`,
        categories: [...new Set(equipment.map(item => item.category))].length,
        nextActivity: equipment.length > 0 ? 'Maintenance check' : 'Add equipment'
      }
    ]);

    // Generate recent activities
    const activities = [];

    // Add recent expenses
    expenses.slice(0, 3).forEach(exp => {
      activities.push({
        id: `expense-${exp.id}`,
        type: 'expense',
        title: exp.description || 'Expense',
        amount: formatCurrency(exp.amount),
        date: new Date(exp.date).toLocaleDateString(),
        category: exp.category || 'general',
        icon: <FiDollarSign />
      });
    });

    // Add recent investments
    investments.slice(0, 3).forEach(inv => {
      activities.push({
        id: `investment-${inv.id}`,
        type: 'investment',
        title: inv.name || 'Investment',
        amount: formatCurrency(inv.amount),
        date: new Date(inv.date).toLocaleDateString(),
        category: inv.type || 'investment',
        icon: <FiTrendingUp />
      });
    });

    // Add recent pond activities
    ponds.slice(0, 2).forEach(pond => {
      activities.push({
        id: `pond-${pond.id}`,
        type: 'pond',
        title: `Pond: ${pond.name}`,
        amount: `${pond.current_stock || 0} fish`,
        date: new Date(pond.date_created).toLocaleDateString(),
        category: 'fish farming',
        icon: <FaFish />
      });
    });

    // Add recent poultry activities
    poultry.slice(0, 2).forEach(batch => {
      activities.push({
        id: `poultry-${batch.id}`,
        type: 'poultry',
        title: `Batch: ${batch.batch_name}`,
        amount: `${batch.quantity} birds`,
        date: new Date(batch.date_acquired).toLocaleDateString(),
        category: 'poultry',
        icon: <FaEgg />
      });
    });

    // Sort activities by date (most recent first)
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));

    setRecentActivities(activities.slice(0, 10));
  };

  const handleRefresh = () => {
    fetchDashboardData();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <div className="dashboard">
      <div className="page-header">
        <div className="header-left">
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
        <div className="header-right">
          <button 
            onClick={handleRefresh} 
            className="btn btn-secondary refresh-btn"
            disabled={loading}
          >
            <FiRefreshCw /> {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <FiActivity className="spinner-icon" />
            Loading farm data...
          </div>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          <div className="dashboard-content">
            <div className="operations-section">
              <h2>Farm Operations Status</h2>
              <div className="operations-grid">
                {operations.map((op, index) => (
                  <div key={index} className={`operation-card ${op.status}`}>
                    <div className="operation-header">
                      <div className="operation-icon" style={{ color: op.status === 'active' ? '#4CAF50' : '#9E9E9E' }}>
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
                      {op.capacity && (
                        <div className="detail-item">
                          <span className="detail-label">Capacity:</span>
                          <span className="detail-value">{op.capacity}</span>
                        </div>
                      )}
                      {op.batches && (
                        <div className="detail-item">
                          <span className="detail-label">Active Batches:</span>
                          <span className="detail-value">{op.batches}</span>
                        </div>
                      )}
                      {op.dailyEggs && op.dailyEggs > 0 && (
                        <div className="detail-item">
                          <span className="detail-label">Daily Eggs:</span>
                          <span className="detail-value">{op.dailyEggs}</span>
                        </div>
                      )}
                      {op.value && op.value !== formatCurrency(0) && (
                        <div className="detail-item">
                          <span className="detail-label">Total Value:</span>
                          <span className="detail-value">{op.value}</span>
                        </div>
                      )}
                      {op.ponds && (
                        <div className="detail-item">
                          <span className="detail-label">Active Ponds:</span>
                          <span className="detail-value">{op.ponds}</span>
                        </div>
                      )}
                      {op.categories && (
                        <div className="detail-item">
                          <span className="detail-label">Categories:</span>
                          <span className="detail-value">{op.categories}</span>
                        </div>
                      )}
                      <div className="detail-item">
                        <span className="detail-label">Next Activity:</span>
                        <span className="detail-value next-activity">{op.nextActivity}</span>
                      </div>
                    </div>
                    <div className="operation-footer">
                      <span className={`status-indicator ${op.status}`} />
                      <span className="status-text">
                        {op.status === 'active' ? 'Operational' : 
                         op.status === 'inactive' ? 'Not Active' : 'Setup Needed'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="recent-section">
              <RecentActivity activities={recentActivities} />
            </div>
          </div>

          <div className="quick-summary">
            <h3>Quick Summary</h3>
            <div className="summary-cards">
              <div className="summary-card">
                <div className="summary-icon">
                  <FaFish />
                </div>
                <div className="summary-content">
                  <h4>Fish Farming</h4>
                  <p>{operations.find(op => op.title === 'Fish Farming')?.ponds || 0} Active Ponds</p>
                  <div className="summary-value">
                    {stats.find(s => s.title === 'Fish Stock')?.value || '0'} fish
                  </div>
                </div>
              </div>
              
              <div className="summary-card">
                <div className="summary-icon">
                  <FaEgg />
                </div>
                <div className="summary-content">
                  <h4>Poultry</h4>
                  <p>{operations.find(op => op.title === 'Poultry')?.batches || 0} Active Batches</p>
                  <div className="summary-value">
                    {stats.find(s => s.title === 'Total Poultry')?.value || '0'} birds
                  </div>
                </div>
              </div>
              
              <div className="summary-card">
                <div className="summary-icon">
                  <FiDollarSign />
                </div>
                <div className="summary-content">
                  <h4>Financial Overview</h4>
                  <p>Investments vs Expenses</p>
                  <div className="summary-value">
                    {stats.find(s => s.title === 'Total Investment')?.value || '₦0'} invested
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;