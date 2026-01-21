import React, { useState, useEffect } from 'react';
import { FiPlus, FiActivity, FiUsers, FiPackage, FiEdit, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import { FaEgg } from 'react-icons/fa';
import { useToast } from '../contexts/ToastContext';
import PoultryBatchModal from '../components/PoultryBatchModal';
import { supabase } from '../lib/supabase';
import './Poultry.css';

const Poultry = () => {
  const { showSuccess, showError, showLoading, dismiss } = useToast();
  
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
  
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('poultry_batches')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === 'PGRST116' || error.code === '42P01') {
          const errorMsg = 'Poultry batches table not found. Please create it in Supabase first.';
          showError(errorMsg);
      
          setLoading(false);
          return;
        }
        throw error;
      }
      
      // Transform data to match component structure
      const transformedBatches = (data || []).map(batch => ({
        id: batch.id,
        batchName: batch.batch_name,
        dateAcquired: batch.date_acquired,
        breed: batch.breed,
        quantity: batch.quantity,
        expectedProductionDate: batch.expected_production_date,
        house: batch.house || 'House A',
        source: batch.source || 'hatchery',
        status: batch.status || 'active',
        dailyEggs: batch.daily_eggs || 0,
        feedConsumption: batch.feed_consumption || Math.round(batch.quantity * 0.05),
      }));
      
      setBatches(transformedBatches);
    
    } catch (error) {
      console.error('Error fetching poultry batches:', error);
      showError('Failed to load poultry batches. Please check your connection.');
    
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-NG').format(num || 0);
  };

  const calculateTotalBirds = () => {
    return batches.reduce((sum, batch) => sum + (batch.quantity || 0), 0);
  };

  const calculateDailyEggs = () => {
    return batches.reduce((sum, batch) => sum + (batch.dailyEggs || 0), 0);
  };

  const calculateMortalityRate = () => {
    const totalBirds = calculateTotalBirds();
    if (totalBirds === 0) return 0;
    const mortality = Math.round((totalBirds * 0.025) / totalBirds * 100 * 10) / 10;
    return mortality;
  };

  const handleAddBatch = () => {
    setSelectedBatch(null);
    setIsModalOpen(true);
  };

  const handleEditBatch = (batch) => {
    setSelectedBatch(batch);
    setIsModalOpen(true);
  };

  const handleDeleteBatch = async (batchId) => {
    const batchName = batches.find(b => b.id === batchId)?.batchName;
    
    if (window.confirm(`Are you sure you want to delete "${batchName}"? This action cannot be undone.`)) {
      const loadingToast = showLoading(`Deleting "${batchName}"...`);
      
      try {
        const { error } = await supabase
          .from('poultry_batches')
          .delete()
          .eq('id', batchId);

        if (error) throw error;
        
        setBatches(batches.filter(batch => batch.id !== batchId));
        dismiss(loadingToast);
        showSuccess(`"${batchName}" deleted successfully!`);
      } catch (error) {
        console.error('Error deleting poultry batch:', error);
        dismiss(loadingToast);
        showError('Failed to delete batch. Please try again.');
      }
    }
  };

  const handleSaveBatch = async (batchData) => {
    const isEditing = !!selectedBatch;
    const loadingToast = showLoading(
      isEditing ? 'Updating batch...' : 'Creating new batch...'
    );
    
    try {
      await fetchBatches();
      setIsModalOpen(false);
      setSelectedBatch(null);
      
      dismiss(loadingToast);
      showSuccess(
        isEditing 
          ? 'Batch updated successfully!' 
          : 'New batch created successfully!'
      );
    } catch (error) {
      console.error('Error handling save:', error);
      dismiss(loadingToast);
      showError('Failed to save batch. Please try again.');
    }
  };

  const handleRefresh = () => {
    fetchBatches();
  };

  const getBreedDisplayName = (breed) => {
    switch(breed) {
      case 'layer': return 'Layer';
      case 'broiler': return 'Broiler';
      case 'dual': return 'Dual Purpose';
      case 'local': return 'Local Breed';
      default: return breed;
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'active': return '#4CAF50';
      case 'growing': return '#2196F3';
      case 'laying': return '#FF9800';
      case 'harvested': return '#9E9E9E';
      case 'sold': return '#9C27B0';
      default: return '#9E9E9E';
    }
  };

  // Calculate age based on date acquired (for display purposes)
  const calculateAgeInWeeks = (dateAcquired) => {
    const acquiredDate = new Date(dateAcquired);
    const today = new Date();
    const diffTime = Math.abs(today - acquiredDate);
    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
    return diffWeeks;
  };

  return (
    <div className="poultry-page">
      <div className="page-header">
        <h1>Poultry Management</h1>
        <div className="header-actions">
          <button onClick={handleRefresh} className="btn btn-secondary" disabled={loading}>
            <FiRefreshCw /> {loading ? 'Loading...' : 'Refresh'}
          </button>
          <button className="btn btn-primary" onClick={handleAddBatch} disabled={loading}>
            <FiPlus /> Add New Batch
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-overlay">
          <div className="loading-spinner">Loading poultry batches...</div>
        </div>
      ) : (
        <>
          <div className="poultry-stats">
            <div className="poultry-stat-card">
              <div className="poultry-stat-icon">
                <FaEgg />
              </div>
              <div className="poultry-stat-info">
                <h3>Total Birds</h3>
                <div className="poultry-stat-value">{formatNumber(calculateTotalBirds())}</div>
                <div className="poultry-stat-label">Live Birds</div>
              </div>
            </div>
            
            <div className="poultry-stat-card">
              <div className="poultry-stat-icon">
                <FiPackage />
              </div>
              <div className="poultry-stat-info">
                <h3>Daily Eggs</h3>
                <div className="poultry-stat-value">{formatNumber(calculateDailyEggs())}</div>
                <div className="poultry-stat-label">Average per day</div>
              </div>
            </div>
            
            <div className="poultry-stat-card">
              <div className="poultry-stat-icon">
                <FiActivity />
              </div>
              <div className="poultry-stat-info">
                <h3>Mortality Rate</h3>
                <div className="poultry-stat-value">{calculateMortalityRate()}%</div>
                <div className="poultry-stat-label">This month</div>
              </div>
            </div>
            
            <div className="poultry-stat-card">
              <div className="poultry-stat-icon">
                <FiUsers />
              </div>
              <div className="poultry-stat-info">
                <h3>Active Houses</h3>
                <div className="poultry-stat-value">
                  {[...new Set(batches.map(batch => batch.house))].length}
                </div>
                <div className="poultry-stat-label">In use</div>
              </div>
            </div>
          </div>

          <div className="poultry-content">
            <div className="section">
              <div className="section-header">
                <h2>Poultry Batches</h2>
                <div className="table-summary">
                  <span>Total Batches: {batches.length}</span>
                  <span>Total Birds: {formatNumber(calculateTotalBirds())}</span>
                </div>
              </div>
              
              {batches.length === 0 ? (
                <div className="empty-state">
                  <FaEgg size={48} />
                  <h3>No Poultry Batches Found</h3>
                  <p>Get started by creating your first poultry batch.</p>
                  <button className="btn btn-primary" onClick={handleAddBatch}>
                    <FiPlus /> Create First Batch
                  </button>
                </div>
              ) : (
                <>
                  {/* Desktop Table View - Removed Age column */}
                  <div className="batches-table desktop-view">
                    <div className="table-container">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Batch Name</th>
                            <th>Breed</th>
                            <th>Quantity</th>
                            <th>House</th>
                            <th>Status</th>
                            <th>Daily Eggs</th>
                            <th>Feed/Day</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {batches.map(batch => (
                            <tr key={batch.id}>
                              <td data-label="Batch Name">
                                <div className="batch-name">
                                  <strong>{batch.batchName}</strong>
                                  <div className="batch-meta">
                                    <span className="batch-date">Acquired: {batch.dateAcquired}</span>
                                    <span className="batch-source">{batch.source}</span>
                                  </div>
                                </div>
                              </td>
                              <td data-label="Breed">
                                <span className="batch-breed">{getBreedDisplayName(batch.breed)}</span>
                              </td>
                              <td data-label="Quantity">{formatNumber(batch.quantity)} birds</td>
                              <td data-label="House">{batch.house}</td>
                              <td data-label="Status">
                                <span 
                                  className="batch-status" 
                                  style={{ 
                                    backgroundColor: `${getStatusColor(batch.status)}20`, 
                                    color: getStatusColor(batch.status) 
                                  }}
                                >
                                  {batch.status}
                                </span>
                              </td>
                              <td data-label="Daily Eggs">{batch.dailyEggs > 0 ? formatNumber(batch.dailyEggs) : '-'}</td>
                              <td data-label="Feed/Day">{batch.feedConsumption} kg</td>
                              <td data-label="Actions">
                                <div className="batch-actions-icons">
                                  <button 
                                    className="icon-btn" 
                                    onClick={() => handleEditBatch(batch)}
                                    title="Edit Batch"
                                  >
                                    <FiEdit />
                                  </button>
                                  <button 
                                    className="icon-btn delete" 
                                    onClick={() => handleDeleteBatch(batch.id)}
                                    title="Delete Batch"
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

                  {/* Mobile Cards View - Removed Age */}
                  <div className="mobile-batches-view">
                    {batches.map(batch => (
                      <div key={batch.id} className="mobile-batch-card">
                        <div className="mobile-batch-header">
                          <div className="mobile-batch-title">
                            <h3>{batch.batchName}</h3>
                            <div className="mobile-batch-meta">
                              <span className="mobile-batch-breed">{getBreedDisplayName(batch.breed)}</span>
                              <span className="mobile-batch-date">Acquired: {batch.dateAcquired}</span>
                            </div>
                          </div>
                          <div className="mobile-batch-status">
                            <span 
                              className="batch-status" 
                              style={{ 
                                backgroundColor: `${getStatusColor(batch.status)}20`, 
                                color: getStatusColor(batch.status) 
                              }}
                            >
                              {batch.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mobile-batch-details">
                          <div className="mobile-detail-row">
                            <div className="mobile-detail-item">
                              <span className="mobile-detail-label">Quantity:</span>
                              <span className="mobile-detail-value">{formatNumber(batch.quantity)} birds</span>
                            </div>
                            <div className="mobile-detail-item">
                              <span className="mobile-detail-label">House:</span>
                              <span className="mobile-detail-value">{batch.house}</span>
                            </div>
                          </div>
                          
                          <div className="mobile-detail-row">
                            <div className="mobile-detail-item">
                              <span className="mobile-detail-label">Source:</span>
                              <span className="mobile-detail-value">{batch.source}</span>
                            </div>
                            <div className="mobile-detail-item">
                              <span className="mobile-detail-label">Expected Date:</span>
                              <span className="mobile-detail-value">
                                {batch.expectedProductionDate || 'Not set'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="mobile-detail-row">
                            <div className="mobile-detail-item">
                              <span className="mobile-detail-label">Daily Eggs:</span>
                              <span className="mobile-detail-value">{batch.dailyEggs > 0 ? formatNumber(batch.dailyEggs) : '-'}</span>
                            </div>
                            <div className="mobile-detail-item">
                              <span className="mobile-detail-label">Feed/Day:</span>
                              <span className="mobile-detail-value">{batch.feedConsumption} kg</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mobile-batch-actions">
                          <button 
                            className="btn btn-sm btn-secondary" 
                            onClick={() => handleEditBatch(batch)}
                          >
                            <FiEdit /> Edit
                          </button>
                          <button 
                            className="btn btn-sm btn-secondary delete" 
                            onClick={() => handleDeleteBatch(batch.id)}
                          >
                            <FiTrash2 /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="section">
              <div className="section-header">
                <h2>Daily Production</h2>
                <div className="table-summary">
                  <span>Showing {batches.filter(b => b.breed === 'layer' || b.breed === 'dual').length} batches</span>
                </div>
              </div>
              
              {/* Desktop Production Table */}
              <div className="production-table desktop-view">
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Batch</th>
                        <th>House</th>
                        <th>Breed</th>
                        <th>Eggs Collected</th>
                        <th>Damaged Eggs</th>
                        <th>Feed Consumed (kg)</th>
                        <th>Water (L)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batches.filter(b => b.breed === 'layer' || b.breed === 'dual').map(batch => (
                        <tr key={batch.id}>
                          <td data-label="Date">Today</td>
                          <td data-label="Batch">{batch.batchName}</td>
                          <td data-label="House">{batch.house}</td>
                          <td data-label="Breed">{getBreedDisplayName(batch.breed)}</td>
                          <td data-label="Eggs Collected">{batch.dailyEggs}</td>
                          <td data-label="Damaged Eggs">{Math.round(batch.dailyEggs * 0.01)}</td>
                          <td data-label="Feed Consumed">{batch.feedConsumption}</td>
                          <td data-label="Water">{Math.round(batch.quantity * 0.3)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Production Cards */}
              <div className="mobile-production-view">
                {batches.filter(b => b.breed === 'layer' || b.breed === 'dual').map(batch => (
                  <div key={batch.id} className="mobile-production-card">
                    <div className="mobile-production-header">
                      <h4>{batch.batchName}</h4>
                      <span className="mobile-production-breed">{getBreedDisplayName(batch.breed)}</span>
                    </div>
                    
                    <div className="mobile-production-details">
                      <div className="mobile-production-item">
                        <span className="label">Date:</span>
                        <span className="value">Today</span>
                      </div>
                      <div className="mobile-production-item">
                        <span className="label">House:</span>
                        <span className="value">{batch.house}</span>
                      </div>
                      <div className="mobile-production-item">
                        <span className="label">Eggs Collected:</span>
                        <span className="value">{batch.dailyEggs}</span>
                      </div>
                      <div className="mobile-production-item">
                        <span className="label">Damaged Eggs:</span>
                        <span className="value">{Math.round(batch.dailyEggs * 0.01)}</span>
                      </div>
                      <div className="mobile-production-item">
                        <span className="label">Feed Consumed:</span>
                        <span className="value">{batch.feedConsumption} kg</span>
                      </div>
                      <div className="mobile-production-item">
                        <span className="label">Water:</span>
                        <span className="value">{Math.round(batch.quantity * 0.3)} L</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      <PoultryBatchModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBatch}
        batch={selectedBatch}
      />
    </div>
  );
};

export default Poultry;