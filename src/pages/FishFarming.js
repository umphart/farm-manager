import React, { useState, useEffect } from 'react';
import { 
  FiPlus, 
  FiDroplet, 
  FiThermometer, 
  FiActivity, 
  FiEdit, 
  FiTrash2, 
  FiRefreshCw,
  FiMinus,
  FiPlusCircle,
  FiMinusCircle
} from 'react-icons/fi';
import { FaFish } from 'react-icons/fa';
import PondModal from '../components/PondModal';
import { supabase } from '../lib/supabase';
import { useToast } from '../contexts/ToastContext';
import './FishFarming.css';

const FishFarming = () => {
  const { showSuccess, showError, showLoading, dismiss } = useToast();
  const [ponds, setPonds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPond, setSelectedPond] = useState(null);
  const [error, setError] = useState('');
  const [stockUpdateModal, setStockUpdateModal] = useState({ isOpen: false, pond: null, action: 'add' });

  useEffect(() => {
    fetchPonds();
  }, []);

  const fetchPonds = async () => {
    setLoading(true);
    try {
      setError('');
      
      const { data, error } = await supabase
        .from('ponds')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === 'PGRST116' || error.code === '42P01') {
          const errorMsg = 'Ponds table not found. Please create it in Supabase first.';
          showError(errorMsg);
          setError(errorMsg);
          
          setLoading(false);
          return;
        }
        throw error;
      }
      
      const transformedPonds = (data || []).map(pond => ({
        id: pond.id,
        name: pond.name,
        dateCreated: pond.date_created,
        length: pond.length,
        width: pond.width,
        capacity: pond.capacity || 0, // This is the "No. of Fish in Pond" value
        breed: pond.breed,
        currentStock: pond.current_stock || 0,
        status: pond.status || 'active',
        waterSource: pond.water_source || 'borehole',
        depth: pond.depth || 1.5
      }));
      
      setPonds(transformedPonds);
      
      if (data.length > 0) {
        // showSuccess(`Loaded ${data.length} ponds successfully!`);
      }
    } catch (error) {
      console.error('Error fetching ponds:', error);
      const errorMsg = 'Failed to load ponds. Please check your connection and try again.';
      showError(errorMsg);
      setError(errorMsg);
      
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (pondId, action, quantity) => {
    if (!quantity || quantity <= 0) {
      showError('Please enter a valid quantity');
      return;
    }

    const pond = ponds.find(p => p.id === pondId);
    if (!pond) return;

    const loadingToast = showLoading(`Updating stock for ${pond.name}...`);
    
    try {
      let newStock;
      if (action === 'add') {
        newStock = pond.currentStock + parseInt(quantity);
        // Check if new stock exceeds capacity (No. of Fish in Pond)
        if (pond.capacity > 0 && newStock > pond.capacity) {
          throw new Error(`Cannot exceed maximum capacity of ${formatNumber(pond.capacity)} fish`);
        }
      } else {
        newStock = pond.currentStock - parseInt(quantity);
        if (newStock < 0) {
          throw new Error('Cannot remove more fish than current stock');
        }
      }

      const { error } = await supabase
        .from('ponds')
        .update({ current_stock: newStock })
        .eq('id', pondId);

      if (error) throw error;
      
      // Update local state
      setPonds(prev => prev.map(p => 
        p.id === pondId 
          ? { ...p, currentStock: newStock }
          : p
      ));
      
      dismiss(loadingToast);
      showSuccess(`Stock updated successfully! New stock: ${newStock}`);
      setStockUpdateModal({ isOpen: false, pond: null, action: 'add' });
    } catch (error) {
      console.error('Error updating stock:', error);
      dismiss(loadingToast);
      showError(error.message || 'Failed to update stock');
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-NG').format(num || 0);
  };

  const calculateTotalStock = () => {
    return ponds.reduce((sum, pond) => sum + (pond.currentStock || 0), 0);
  };

  const handleAddPond = () => {
    setSelectedPond(null);
    setIsModalOpen(true);
  };

  const handleEditPond = (pond) => {
    setSelectedPond(pond);
    setIsModalOpen(true);
  };

  const handleDeletePond = async (pondId) => {
    const pondName = ponds.find(p => p.id === pondId)?.name;
    
    if (window.confirm(`Are you sure you want to delete "${pondName}"? This action cannot be undone.`)) {
      const loadingToast = showLoading(`Deleting "${pondName}"...`);
      
      try {
        const { error } = await supabase
          .from('ponds')
          .delete()
          .eq('id', pondId);

        if (error) throw error;
        
        setPonds(ponds.filter(pond => pond.id !== pondId));
        dismiss(loadingToast);
        showSuccess(`"${pondName}" deleted successfully!`);
      } catch (error) {
        console.error('Error deleting pond:', error);
        dismiss(loadingToast);
        showError('Failed to delete pond. Please try again.');
      }
    }
  };

  const handleSavePond = async (pondData) => {
    const isEditing = !!selectedPond;
    
    try {
      await fetchPonds();
      setIsModalOpen(false);
      setSelectedPond(null);
      
      showSuccess(
        isEditing 
          ? 'Pond updated successfully!' 
          : 'New pond created successfully!'
      );
    } catch (error) {
      console.error('Error handling save:', error);
      
      showError('Failed to save pond. Please try again.');
    }
  };

  const handleRefresh = () => {
    fetchPonds();
  };

  const getBreedDisplayName = (breed) => {
    return breed ? breed.charAt(0).toUpperCase() + breed.slice(1) : 'Unknown';
  };

  const StockUpdateModal = ({ isOpen, onClose, pond, action }) => {
    const [quantity, setQuantity] = useState('');
    
    if (!isOpen || !pond) return null;

    const handleSubmit = (e) => {
      e.preventDefault();
      updateStock(pond.id, action, quantity);
    };

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h3>{action === 'add' ? 'Add Fish to Pond' : 'Remove Fish from Pond'}</h3>
            <button className="modal-close" onClick={onClose}>×</button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Pond: {pond.name}</label>
                <div className="current-stock-info">
                  Current Stock: <strong>{formatNumber(pond.currentStock)} fish</strong>
                </div>
                <div className="capacity-info-modal">
                  Pond Capacity: <strong>{formatNumber(pond.capacity)} fish</strong>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="quantity">
                  Quantity to {action === 'add' ? 'Add' : 'Remove'}:
                </label>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder={`Enter number of fish to ${action}`}
                  min="1"
                  max={action === 'remove' ? pond.currentStock : (pond.capacity > 0 ? pond.capacity - pond.currentStock : undefined)}
                  required
                  className="form-input"
                />
                {action === 'add' && pond.capacity > 0 && (
                  <div className="hint">
                    Maximum that can be added: {formatNumber(pond.capacity - pond.currentStock)} fish
                    (Capacity: {formatNumber(pond.capacity)} fish)
                  </div>
                )}
                {action === 'remove' && pond.currentStock > 0 && (
                  <div className="hint">
                    Maximum removable: {formatNumber(pond.currentStock)} fish
                  </div>
                )}
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {action === 'add' ? 'Add Fish' : 'Remove Fish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fish-farming-page">
      <div className="page-header">
        <h1>Fish Farming Management</h1>
        <div className="header-actions">
          <button onClick={handleRefresh} className="btn btn-secondary" disabled={loading}>
            <FiRefreshCw /> {loading ? 'Loading...' : 'Refresh'}
          </button>
          <button className="btn btn-primary" onClick={handleAddPond} disabled={loading}>
            <FiPlus /> Add New Pond
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-overlay">
          <div className="loading-spinner">Loading ponds...</div>
        </div>
      ) : (
        <>
          <div className="fish-stats-grid">
            <div className="fish-stat-card">
              <div className="fish-stat-icon">
                <FaFish />
              </div>
              <div className="fish-stat-info">
                <h3>Total Stock</h3>
                <div className="fish-stat-value">{formatNumber(calculateTotalStock())}</div>
                <div className="fish-stat-label">Live Fish</div>
              </div>
            </div>
            
            <div className="fish-stat-card">
              <div className="fish-stat-icon">
                <FiDroplet />
              </div>
              <div className="fish-stat-info">
                <h3>Active Ponds</h3>
                <div className="fish-stat-value">{ponds.filter(p => p.status === 'active').length}</div>
                <div className="fish-stat-label">of {ponds.length} total</div>
              </div>
            </div>
            
            <div className="fish-stat-card">
              <div className="fish-stat-icon">
                <FiPlusCircle />
              </div>
              <div className="fish-stat-info">
                <h3>Total Capacity</h3>
                <div className="fish-stat-value">{formatNumber(ponds.reduce((sum, pond) => sum + (pond.capacity || 0), 0))}</div>
                <div className="fish-stat-label">Maximum Fish</div>
              </div>
            </div>
            
            <div className="fish-stat-card">
              <div className="fish-stat-icon">
                <FiActivity />
              </div>
              <div className="fish-stat-info">
                <h3>Capacity Used</h3>
                <div className="fish-stat-value">
                  {ponds.reduce((sum, pond) => sum + (pond.capacity || 0), 0) > 0 ? 
                    `${Math.round((calculateTotalStock() / ponds.reduce((sum, pond) => sum + (pond.capacity || 0), 0)) * 100)}%` : 
                    '0%'}
                </div>
                <div className="fish-stat-label">of Total Capacity</div>
              </div>
            </div>
          </div>

          <div className="ponds-section">
            <div className="section-header">
              <h2>Pond Management</h2>
              <div className="table-summary">
                <span>Total Ponds: {ponds.length}</span>
                <span>Total Stock: {formatNumber(calculateTotalStock())} fish</span>
                <span>Total Capacity: {formatNumber(ponds.reduce((sum, pond) => sum + (pond.capacity || 0), 0))} fish</span>
              </div>
            </div>
            
            {ponds.length === 0 ? (
              <div className="empty-state">
                <FaFish size={48} />
                <h3>No Ponds Found</h3>
                <p>Get started by creating your first fish pond.</p>
                <button className="btn btn-primary" onClick={handleAddPond}>
                  <FiPlus /> Create First Pond
                </button>
              </div>
            ) : (
              <>
                <div className="ponds-table desktop-view">
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Pond Name</th>
                          <th>Breed</th>
                          <th>Dimensions</th>
                          <th>No. of Fish in Pond</th>
                          <th>Current Stock</th>
                          <th>Stock Actions</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ponds.map(pond => (
                          <tr key={pond.id}>
                            <td data-label="Pond Name">
                              <div className="pond-name">
                                <strong>{pond.name}</strong>
                                <div className="pond-meta">
                                  <span className="pond-date">Created: {pond.dateCreated}</span>
                                  <span className="pond-source">Water: {pond.waterSource}</span>
                                  <span className={`pond-status-indicator ${pond.status}`}>
                                    {pond.status}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td data-label="Breed">
                              <span className="pond-breed">{getBreedDisplayName(pond.breed)}</span>
                            </td>
                            <td data-label="Dimensions">{pond.length}m × {pond.width}m × {pond.depth}m</td>
                            <td data-label="No. of Fish in Pond">
                              <div className="capacity-info">
                                {formatNumber(pond.capacity)} fish
                              </div>
                            </td>
                            <td data-label="Current Stock">
                              <div className="stock-info">
                                <strong>{formatNumber(pond.currentStock)}</strong>
                                <div className="stock-ratio">
                                  {pond.capacity > 0 ? 
                                    `${Math.round((pond.currentStock / pond.capacity) * 100)}% of capacity` : 
                                    'Capacity not set'}
                                </div>
                              </div>
                            </td>
                            <td data-label="Stock Actions">
                              <div className="stock-actions">
                                <button 
                                  className="btn btn-sm btn-success stock-btn"
                                  onClick={() => setStockUpdateModal({ 
                                    isOpen: true, 
                                    pond: pond, 
                                    action: 'add' 
                                  })}
                                  title="Add fish to pond"
                                  disabled={pond.capacity > 0 && pond.currentStock >= pond.capacity}
                                >
                                  <FiPlusCircle /> Add
                                </button>
                                <button 
                                  className="btn btn-sm btn-warning stock-btn"
                                  onClick={() => setStockUpdateModal({ 
                                    isOpen: true, 
                                    pond: pond, 
                                    action: 'remove' 
                                  })}
                                  disabled={pond.currentStock === 0}
                                  title={pond.currentStock === 0 ? "No fish to remove" : "Remove fish from pond"}
                                >
                                  <FiMinusCircle /> Remove
                                </button>
                              </div>
                            </td>
                            <td data-label="Actions">
                              <div className="pond-actions-icons">
                                <button 
                                  className="icon-btn" 
                                  onClick={() => handleEditPond(pond)}
                                  title="Edit Pond"
                                >
                                  <FiEdit />
                                </button>
                                <button 
                                  className="icon-btn delete" 
                                  onClick={() => handleDeletePond(pond.id)}
                                  title="Delete Pond"
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

                <div className="mobile-ponds-view">
                  {ponds.map(pond => (
                    <div key={pond.id} className="mobile-pond-card">
                      <div className="mobile-pond-header">
                        <div className="mobile-pond-title">
                          <h3>{pond.name}</h3>
                          <div className="mobile-pond-meta">
                            <span className="mobile-pond-breed">{getBreedDisplayName(pond.breed)}</span>
                            <span className="mobile-pond-date">Created: {pond.dateCreated}</span>
                            <span className={`mobile-pond-status ${pond.status}`}>
                              {pond.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mobile-pond-details">
                        <div className="mobile-detail-row">
                          <div className="mobile-detail-item">
                            <span className="mobile-detail-label">Dimensions:</span>
                            <span className="mobile-detail-value">{pond.length}m × {pond.width}m × {pond.depth}m</span>
                          </div>
                          <div className="mobile-detail-item">
                            <span className="mobile-detail-label">No. of Fish in Pond:</span>
                            <span className="mobile-detail-value">{formatNumber(pond.capacity)} fish</span>
                          </div>
                        </div>
                        
                        <div className="mobile-detail-row">
                          <div className="mobile-detail-item">
                            <span className="mobile-detail-label">Current Stock:</span>
                            <span className="mobile-detail-value">
                              <strong>{formatNumber(pond.currentStock)}</strong> fish
                              {pond.capacity > 0 && (
                                <span className="mobile-stock-ratio">
                                  ({Math.round((pond.currentStock / pond.capacity) * 100)}%)
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mobile-stock-actions">
                          <h4>Stock Management</h4>
                          <div className="mobile-stock-buttons">
                            <button 
                              className="btn btn-sm btn-success"
                              onClick={() => setStockUpdateModal({ 
                                isOpen: true, 
                                pond: pond, 
                                action: 'add' 
                              })}
                              disabled={pond.capacity > 0 && pond.currentStock >= pond.capacity}
                            >
                              <FiPlusCircle /> Add Fish
                            </button>
                            <button 
                              className="btn btn-sm btn-warning"
                              onClick={() => setStockUpdateModal({ 
                                isOpen: true, 
                                pond: pond, 
                                action: 'remove' 
                              })}
                              disabled={pond.currentStock === 0}
                            >
                              <FiMinusCircle /> Remove Fish
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mobile-pond-actions">
                        <button 
                          className="btn btn-sm btn-secondary" 
                          onClick={() => handleEditPond(pond)}
                        >
                          <FiEdit /> Edit Pond
                        </button>
                        <button 
                          className="btn btn-sm btn-secondary delete" 
                          onClick={() => handleDeletePond(pond.id)}
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
        </>
      )}

      <PondModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePond}
        pond={selectedPond}
      />
      
      <StockUpdateModal 
        isOpen={stockUpdateModal.isOpen}
        onClose={() => setStockUpdateModal({ isOpen: false, pond: null, action: 'add' })}
        pond={stockUpdateModal.pond}
        action={stockUpdateModal.action}
      />
    </div>
  );
};

export default FishFarming;