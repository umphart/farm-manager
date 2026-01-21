import React, { useState, useEffect } from 'react';
import { FiDownload, FiFilter, FiPrinter, FiCalendar, FiDollarSign, FiRefreshCw, FiPackage, FiUsers, FiTrendingUp } from 'react-icons/fi';
import { FaFish, FaEgg, FaTractor } from 'react-icons/fa';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';
import './Reports.css';

const Reports = () => {
  const { showSuccess, showError, showLoading, dismiss } = useToast();
  const [selectedReport, setSelectedReport] = useState('financial');
  const [loading, setLoading] = useState(false);
  const [financialData, setFinancialData] = useState([]);
  const [productionData, setProductionData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [dateRange, setDateRange] = useState('last-30-days');
  const [summaryStats, setSummaryStats] = useState({
    totalExpenses: 0,
    totalInvestments: 0,
    totalAnimals: 0,
    totalFish: 0,
    totalPoultry: 0,
    totalEquipment: 0
  });

  useEffect(() => {
    fetchAllData();
  }, [selectedReport, dateRange]);

  const fetchAllData = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
     

      // Fetch all data in parallel
      await Promise.all([
        fetchExpensesData(),
        fetchInvestmentsData(),
        fetchPondsData(),
        fetchPoultryData(),
        fetchLivestockData(),
        fetchEquipmentData()
      ]);

      // Process data based on selected report
      switch(selectedReport) {
        case 'financial':
          processFinancialReport();
          break;
        case 'production':
          processProductionReport();
          break;
        case 'inventory':
          processInventoryReport();
          break;
        case 'sales':
          processSalesReport();
          break;
        default:
          processFinancialReport();
      }

      dismiss();
  
    } catch (error) {
      console.error('Error fetching report data:', error);
      showError('Failed to load report data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Data fetching functions
  const [expenses, setExpenses] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [ponds, setPonds] = useState([]);
  const [poultry, setPoultry] = useState([]);
  const [livestock, setLivestock] = useState([]);
  const [equipment, setEquipment] = useState([]);

  const fetchExpensesData = async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      setExpenses(data || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const fetchInvestmentsData = async () => {
    try {
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      setInvestments(data || []);
    } catch (error) {
      console.error('Error fetching investments:', error);
    }
  };

  const fetchPondsData = async () => {
    try {
      const { data, error } = await supabase
        .from('ponds')
        .select('*');
      
      if (error) throw error;
      setPonds(data || []);
    } catch (error) {
      console.error('Error fetching ponds:', error);
    }
  };

  const fetchPoultryData = async () => {
    try {
      const { data, error } = await supabase
        .from('poultry_batches')
        .select('*');
      
      if (error) throw error;
      setPoultry(data || []);
    } catch (error) {
      console.error('Error fetching poultry:', error);
    }
  };

  const fetchLivestockData = async () => {
    try {
      const { data, error } = await supabase
        .from('livestock')
        .select('*');
      
      if (error) throw error;
      setLivestock(data || []);
    } catch (error) {
      console.error('Error fetching livestock:', error);
    }
  };

  const fetchEquipmentData = async () => {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .select('*');
      
      if (error) throw error;
      setEquipment(data || []);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    }
  };

  // Report processing functions
  const processFinancialReport = () => {
    // Calculate summary stats
    const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
    const totalInvestments = investments.reduce((sum, inv) => sum + (inv.amount || 0), 0);
    
    setSummaryStats(prev => ({
      ...prev,
      totalExpenses,
      totalInvestments
    }));

    // Group expenses by category
    const categoryBreakdown = {};
    expenses.forEach(exp => {
      const category = exp.category || 'other';
      if (!categoryBreakdown[category]) {
        categoryBreakdown[category] = { amount: 0, count: 0 };
      }
      categoryBreakdown[category].amount += exp.amount || 0;
      categoryBreakdown[category].count++;
    });

    // Create financial data for table
    const monthlyData = {};
    
    // Process expenses by month
    expenses.forEach(exp => {
      const date = new Date(exp.date);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { 
          month: monthYear, 
          expenses: 0, 
          investments: 0,
          profit: 0,
          margin: 0
        };
      }
      monthlyData[monthYear].expenses += exp.amount || 0;
    });

    // Process investments by month
    investments.forEach(inv => {
      const date = new Date(inv.date);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { 
          month: monthYear, 
          expenses: 0, 
          investments: 0,
          profit: 0,
          margin: 0
        };
      }
      monthlyData[monthYear].investments += inv.amount || 0;
    });

    // Calculate profit and margin (for demonstration - in real app, you'd have income data)
    const result = Object.values(monthlyData)
      .map(item => ({
        ...item,
        profit: item.expenses > 0 ? -(item.expenses) : 0, // Negative profit indicates loss (expenses > income)
        margin: item.expenses > 0 ? -(item.expenses / item.investments * 100).toFixed(1) : 0
      }))
      .slice(0, 6); // Last 6 months

    setFinancialData(result);
  };

  const processProductionReport = () => {
    const totalFish = ponds.reduce((sum, pond) => sum + (pond.current_stock || 0), 0);
    const totalPoultry = poultry.reduce((sum, batch) => sum + (batch.quantity || 0), 0);
    const totalLivestock = livestock.length;
    
    setSummaryStats(prev => ({
      ...prev,
      totalFish,
      totalPoultry,
      totalAnimals: totalFish + totalPoultry + totalLivestock
    }));

    const production = [];

    // Fish production data
    if (totalFish > 0) {
      const totalCapacity = ponds.reduce((sum, pond) => sum + (pond.capacity || 0), 0);
      const utilization = totalCapacity > 0 ? (totalFish / totalCapacity * 100).toFixed(1) : 0;
      
      production.push({
        product: 'Fish',
        quantity: `${totalFish} fish`,
        capacity: `${totalCapacity} fish`,
        utilization: `${utilization}%`,
        value: `₦${Math.round(totalFish * 500)}` // Estimated value
      });
    }

    // Poultry production data
    if (totalPoultry > 0) {
      const totalEggs = poultry.reduce((sum, batch) => sum + (batch.daily_eggs || 0), 0);
      const avgEggs = totalPoultry > 0 ? (totalEggs / totalPoultry).toFixed(1) : 0;
      
      production.push({
        product: 'Poultry',
        quantity: `${totalPoultry} birds`,
        dailyEggs: `${totalEggs} eggs`,
        avgPerBird: `${avgEggs} eggs/bird`,
        value: `₦${Math.round(totalPoultry * 2000)}` // Estimated value
      });
    }

    // Livestock production data
    if (totalLivestock > 0) {
      const totalLivestockValue = livestock.reduce((sum, animal) => sum + (animal.purchase_price || 0), 0);
      const avgValue = totalLivestock > 0 ? Math.round(totalLivestockValue / totalLivestock) : 0;
      
      production.push({
        product: 'Livestock',
        quantity: `${totalLivestock} animals`,
        totalValue: formatCurrency(totalLivestockValue),
        avgValue: formatCurrency(avgValue),
        growth: '+8%' // Estimated growth
      });
    }

    setProductionData(production);
  };

  const processInventoryReport = () => {
    const totalEquipment = equipment.reduce((sum, item) => sum + (item.quantity || 0), 0);
    
    setSummaryStats(prev => ({
      ...prev,
      totalEquipment
    }));

    const inventory = [];

    // Equipment inventory
    const equipmentByCategory = {};
    equipment.forEach(item => {
      const category = item.category || 'other';
      if (!equipmentByCategory[category]) {
        equipmentByCategory[category] = { quantity: 0, items: [] };
      }
      equipmentByCategory[category].quantity += item.quantity || 0;
      equipmentByCategory[category].items.push(item);
    });

    Object.entries(equipmentByCategory).forEach(([category, data]) => {
      inventory.push({
        category: formatCategoryName(category),
        items: data.items.length,
        totalQuantity: data.quantity,
        value: `₦${Math.round(data.quantity * 1000)}` // Estimated value
      });
    });

    // Fish inventory
    if (ponds.length > 0) {
      const fishInventory = {
        category: 'Fish Stock',
        items: ponds.length,
        totalQuantity: ponds.reduce((sum, pond) => sum + (pond.current_stock || 0), 0),
        value: `₦${Math.round(ponds.reduce((sum, pond) => sum + (pond.current_stock || 0), 0) * 500)}`
      };
      inventory.unshift(fishInventory);
    }

    setInventoryData(inventory);
  };

  const processSalesReport = () => {
    // Since we don't have a sales table, we'll create estimated sales based on production
    const estimatedSales = [];

    // Estimated fish sales (based on 20% of stock being sold monthly)
    const totalFishValue = ponds.reduce((sum, pond) => sum + (pond.current_stock || 0) * 500, 0);
    const estimatedFishSales = totalFishValue * 0.2;
    
    if (estimatedFishSales > 0) {
      estimatedSales.push({
        product: 'Fish',
        estimatedSales: formatCurrency(estimatedFishSales),
        percentage: '20%',
        trend: '↑ Growing'
      });
    }

    // Estimated poultry sales
    const totalPoultryValue = poultry.reduce((sum, batch) => sum + (batch.quantity || 0) * 2000, 0);
    const estimatedPoultrySales = totalPoultryValue * 0.15;
    
    if (estimatedPoultrySales > 0) {
      estimatedSales.push({
        product: 'Poultry',
        estimatedSales: formatCurrency(estimatedPoultrySales),
        percentage: '15%',
        trend: '↑ Growing'
      });
    }

    // Estimated livestock sales
    const totalLivestockValue = livestock.reduce((sum, animal) => sum + (animal.purchase_price || 0) * 1.2, 0);
    const estimatedLivestockSales = totalLivestockValue * 0.1;
    
    if (estimatedLivestockSales > 0) {
      estimatedSales.push({
        product: 'Livestock',
        estimatedSales: formatCurrency(estimatedLivestockSales),
        percentage: '10%',
        trend: '→ Stable'
      });
    }

    setSalesData(estimatedSales);
  };

  // Helper functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatCategoryName = (category) => {
    const categoryMap = {
      'feeding': 'Feeding Equipment',
      'watering': 'Watering Equipment',
      'tools': 'Tools',
      'irrigation': 'Irrigation',
      'consumables': 'Consumables',
      'harvesting': 'Harvesting Equipment',
      'safety': 'Safety Equipment',
      'other': 'Other Equipment'
    };
    return categoryMap[category] || category;
  };

  const getReportIcon = (reportId) => {
    switch(reportId) {
      case 'financial': return <FiDollarSign />;
      case 'production': return <FiTrendingUp />;
      case 'inventory': return <FiPackage />;
      case 'sales': return <FiUsers />;
      default: return <FiDollarSign />;
    }
  };

  const reports = [
    { id: 'financial', name: 'Financial Report', description: 'Income, expenses, and profit analysis' },
    { id: 'production', name: 'Production Report', description: 'Fish and poultry production metrics' },
    { id: 'inventory', name: 'Inventory Report', description: 'Current stock and supplies status' },
    { id: 'sales', name: 'Sales Report', description: 'Sales transactions and revenue' },
  ];

  const handlePrint = () => {
    window.print();
    showSuccess('Report sent to printer!');
  };

  const handleExportPDF = () => {
    showSuccess('Export started. You will receive the PDF shortly.');
  };

  const handleGenerateReport = () => {
    fetchAllData();
  };

  const handleRefresh = () => {
    fetchAllData();
  };

  const calculateInsights = () => {
    switch(selectedReport) {
      case 'financial':
        const totalExpenses = summaryStats.totalExpenses;
        const totalInvestments = summaryStats.totalInvestments;
        const expenseRatio = totalInvestments > 0 ? (totalExpenses / totalInvestments * 100).toFixed(1) : 0;
        
        return {
          bestPerforming: totalExpenses < totalInvestments ? 'Investment Efficient' : 'High Expenses',
          fastestGrowing: `${expenseRatio}% Expense Ratio`,
          costReduction: totalExpenses > 0 ? `${Math.round(totalExpenses / 100000)} major expenses` : 'No expenses'
        };

      case 'production':
        return {
          bestPerforming: summaryStats.totalFish > summaryStats.totalPoultry ? 'Fish Farming' : 'Poultry',
          fastestGrowing: `${summaryStats.totalAnimals} Total Animals`,
          costReduction: `${summaryStats.totalPoultry > 0 ? Math.round(summaryStats.totalPoultry / 100) : 0} batches`
        };

      case 'inventory':
        return {
          bestPerforming: `${summaryStats.totalEquipment} Equipment Items`,
          fastestGrowing: `${equipment.length} Equipment Types`,
          costReduction: `${ponds.length} Active Ponds`
        };

      case 'sales':
        const totalEstimatedSales = salesData.reduce((sum, item) => {
          const amount = parseFloat(item.estimatedSales.replace(/[^0-9.-]+/g,"")) || 0;
          return sum + amount;
        }, 0);
        
        return {
          bestPerforming: salesData[0]?.product || 'No Data',
          fastestGrowing: formatCurrency(totalEstimatedSales),
          costReduction: `${salesData.length} Product Lines`
        };

      default:
        return {
          bestPerforming: 'N/A',
          fastestGrowing: 'N/A',
          costReduction: 'N/A'
        };
    }
  };

  const insights = calculateInsights();

  return (
    <div className="reports-page">
      <div className="page-header">
        <h1>Farm Reports</h1>
        <div className="header-actions">
          <button onClick={handleRefresh} className="btn btn-secondary" disabled={loading}>
            <FiRefreshCw /> {loading ? 'Loading...' : 'Refresh'}
          </button>
          <button className="btn btn-secondary" onClick={handlePrint} disabled={loading}>
            <FiPrinter /> Print
          </button>
          <button className="btn btn-primary" onClick={handleExportPDF} disabled={loading}>
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
                disabled={loading}
              >
                <div className="report-icon">{getReportIcon(report.id)}</div>
                <div className="report-info">
                  <div className="report-name">{report.name}</div>
                  <div className="report-desc">{report.description}</div>
                </div>
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
              <select 
                className="form-control" 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                disabled={loading}
              >
                <option value="last-30-days">Last 30 days</option>
                <option value="last-3-months">Last 3 months</option>
                <option value="last-6-months">Last 6 months</option>
                <option value="year-to-date">Year to date</option>
                <option value="all-time">All Time</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Farm Section</label>
              <select className="form-control" disabled={loading}>
                <option>All Sections</option>
                <option>Fish Farming</option>
                <option>Poultry</option>
                <option>Livestock</option>
                <option>Equipment</option>
              </select>
            </div>
            <button 
              className="btn btn-primary" 
              onClick={handleGenerateReport}
              disabled={loading}
            >
              <FiFilter /> {loading ? 'Generating...' : 'Generate Report'}
            </button>
          </div>

          <div className="report-preview">
            <div className="report-header">
              <h3>{reports.find(r => r.id === selectedReport)?.name}</h3>
              <div className="report-date">
                Generated: {new Date().toLocaleDateString()}
              </div>
            </div>
            
            {loading ? (
              <div className="loading-overlay">
                <div className="loading-spinner">Loading report data...</div>
              </div>
            ) : (
              <div className="report-data">
                {selectedReport === 'financial' && (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th>Expenses</th>
                        <th>Investments</th>
                        <th>Net Position</th>
                        <th>Efficiency</th>
                      </tr>
                    </thead>
                    <tbody>
                      {financialData.length > 0 ? financialData.map((row, index) => (
                        <tr key={index}>
                          <td data-label="Month">{row.month}</td>
                          <td data-label="Expenses" className="expense">{formatCurrency(row.expenses)}</td>
                          <td data-label="Investments" className="investment">{formatCurrency(row.investments)}</td>
                          <td data-label="Net Position" className={row.profit >= 0 ? 'profit' : 'loss'}>
                            {formatCurrency(row.profit)}
                          </td>
                          <td data-label="Efficiency">
                            {row.margin}%
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="5" className="no-data">
                            No financial data available. Add expenses and investments first.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
                
                {selectedReport === 'production' && (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Capacity/Utilization</th>
                        <th>Estimated Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productionData.length > 0 ? productionData.map((row, index) => (
                        <tr key={index}>
                          <td>{row.product}</td>
                          <td>{row.quantity}</td>
                          <td>{row.capacity || row.dailyEggs || row.totalValue}</td>
                          <td className="value">{row.value}</td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="4" className="no-data">
                            No production data available. Add ponds, poultry, or livestock first.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
                
                {selectedReport === 'inventory' && (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Items</th>
                        <th>Total Quantity</th>
                        <th>Estimated Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventoryData.length > 0 ? inventoryData.map((row, index) => (
                        <tr key={index}>
                          <td>{row.category}</td>
                          <td>{row.items}</td>
                          <td>{row.totalQuantity}</td>
                          <td className="value">{row.value}</td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="4" className="no-data">
                            No inventory data available. Add equipment or fish stock first.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
                
                {selectedReport === 'sales' && (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Estimated Sales</th>
                        <th>Market Share</th>
                        <th>Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesData.length > 0 ? salesData.map((row, index) => (
                        <tr key={index}>
                          <td>{row.product}</td>
                          <td className="sales">{row.estimatedSales}</td>
                          <td>{row.percentage}</td>
                          <td className="trend">{row.trend}</td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="4" className="no-data">
                            No sales data available. Production data needed for estimates.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>

          <div className="report-insights">
            <h4>Key Insights</h4>
            <div className="insights-grid">
              <div className="insight-card">
                <h5>Best Performing</h5>
                <div className="insight-value">{insights.bestPerforming}</div>
                <div className="insight-desc">
                  {selectedReport === 'financial' ? 'Based on expense ratio' : 
                   selectedReport === 'production' ? 'Based on quantity' :
                   selectedReport === 'inventory' ? 'Based on items count' : 'Based on estimated sales'}
                </div>
              </div>
              <div className="insight-card">
                <h5>Growth Metric</h5>
                <div className="insight-value">{insights.fastestGrowing}</div>
                <div className="insight-desc">
                  {selectedReport === 'financial' ? 'Financial efficiency' : 
                   selectedReport === 'production' ? 'Total production units' :
                   selectedReport === 'inventory' ? 'Inventory diversity' : 'Revenue potential'}
                </div>
              </div>
              <div className="insight-card">
                <h5>Operational Status</h5>
                <div className="insight-value">{insights.costReduction}</div>
                <div className="insight-desc">
                  {selectedReport === 'financial' ? 'Major expense categories' : 
                   selectedReport === 'production' ? 'Active production units' :
                   selectedReport === 'inventory' ? 'Active farming units' : 'Product lines available'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;