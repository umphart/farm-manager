import React, { useState, useEffect } from 'react';
import { FiPlus, FiPackage, FiTool, FiEdit, FiTrash2, FiDroplet, FiFilter, FiDownload, FiDollarSign, FiRefreshCw } from 'react-icons/fi';
import { FaSeedling, FaTractor } from 'react-icons/fa';
import { useToast } from '../contexts/ToastContext';
import EquipmentModal from '../components/EquipmentModal';
import { supabase } from '../lib/supabase';
import './Equipment.css';

const Equipment = () => {
  const { showSuccess, showError, showLoading, dismiss } = useToast();
  
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filters, setFilters] = useState({
    category: 'all',
  });

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
   
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === 'PGRST116' || error.code === '42P01') {
          showError('Equipment table not found. Please create it in Supabase first.');
        
          setLoading(false);
          return;
        }
        throw error;
      }
      
      // Transform data to match component structure
      const transformedEquipment = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit || 'units',
        notes: item.notes || '',
      }));
      
      setEquipment(transformedEquipment);
     
     
    } catch (error) {
      console.error('Error fetching equipment:', error);
      showError('Failed to load equipment. Please check your connection.');
     
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'feeding', label: 'Feeding Equipment' },
    { value: 'watering', label: 'Watering Equipment' },
    { value: 'tools', label: 'Tools' },
    { value: 'irrigation', label: 'Irrigation' },
    { value: 'consumables', label: 'Consumables' },
    { value: 'harvesting', label: 'Harvesting Equipment' },
    { value: 'safety', label: 'Safety Equipment' },
    { value: 'other', label: 'Other' },
  ];

  const filteredEquipment = equipment.filter(item => {
    if (filters.category !== 'all' && item.category !== filters.category) return false;
    return true;
  });

  const handleAddItem = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteItem = async (itemId) => {
    const itemName = equipment.find(item => item.id === itemId)?.name;
    
    if (window.confirm(`Are you sure you want to delete "${itemName}"? This action cannot be undone.`)) {
      const loadingToast = showLoading(`Deleting "${itemName}"...`);
      
      try {
        const { error } = await supabase
          .from('equipment')
          .delete()
          .eq('id', itemId);

        if (error) throw error;
        
        setEquipment(equipment.filter(item => item.id !== itemId));
        dismiss(loadingToast);
        showSuccess(`"${itemName}" deleted successfully!`);
      } catch (error) {
        console.error('Error deleting equipment:', error);
        dismiss(loadingToast);
        showError('Failed to delete equipment item. Please try again.');
      }
    }
  };

  const handleSaveItem = async (itemData) => {
    const isEditing = !!selectedItem;
  
    
    try {
      await fetchEquipment();
      setIsModalOpen(false);
      setSelectedItem(null);
      
     
      showSuccess(
        isEditing 
          ? 'Equipment updated successfully!' 
          : 'New equipment added successfully!'
      );
    } catch (error) {
      console.error('Error handling save:', error);
      
      showError('Failed to save equipment. Please try again.');
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
    });
  };

  const handleExportData = () => {
    showSuccess('Export started. You will receive the file shortly.');
  };

  const handleRefresh = () => {
    fetchEquipment();
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'feeding': return <FiPackage />;
      case 'watering': return <FiDroplet />;
      case 'tools': return <FiTool />;
      case 'irrigation': return <FaTractor />;
      case 'consumables': return <FaSeedling />;
      case 'harvesting': return <FiPackage />;
      case 'safety': return <FiTool />;
      default: return <FiPackage />;
    }
  };

  const calculateTotalItems = () => {
    return equipment.length;
  };
  return (
    <div className="equipment-page">
      <div className="page-header">
        <h1>Equipment & Inventory</h1>
        <div className="header-actions">
          <button onClick={handleRefresh} className="btn btn-secondary" disabled={loading}>
            <FiRefreshCw /> {loading ? 'Loading...' : 'Refresh'}
          </button>
          <button className="btn btn-primary" onClick={handleAddItem} disabled={loading}>
            <FiPlus /> Add Item
          </button>
          <button className="btn btn-secondary" onClick={handleExportData} disabled={loading}>
            <FiDownload /> Export
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-overlay">
          <div className="loading-spinner">Loading equipment...</div>
        </div>
      ) : (
        <>
          <div className="equipment-stats">
            <div className="equipment-stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)' }}>
                <FiPackage />
              </div>
              <div className="stat-info">
                <h3>Total Items</h3>
                <div className="stat-value">{calculateTotalItems()}</div>
                <div className="stat-label">Equipment & Inventory</div>
              </div>
            </div>
            
            <div className="equipment-stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)' }}>
                <FiTool />
              </div>
              <div className="stat-info">
                <h3>Categories</h3>
                <div className="stat-value">{categories.length - 1}</div>
                <div className="stat-label">Equipment Types</div>
              </div>
            </div>
            
            <div className="equipment-stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)' }}>
                <FiFilter />
              </div>
              <div className="stat-info">
                <h3>Total Quantity</h3>
                <div className="stat-value">{equipment.reduce((sum, item) => sum + item.quantity, 0)}</div>
                <div className="stat-label">All Items Combined</div>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="filters-section">
            <div className="filters-row">
              <div className="filter-item">
                <label>Category</label>
                <select 
                  className="filter-select"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-actions">
                <button className="btn btn-secondary btn-sm" onClick={handleResetFilters}>
                  <FiRefreshCw /> Reset
                </button>
                <div className="filter-info">
                  {filteredEquipment.length} of {equipment.length} items
                </div>
              </div>
            </div>
          </div>

          {equipment.length === 0 ? (
            <div className="empty-state">
              <FiPackage size={48} />
              <h3>No Equipment Found</h3>
              <p>Get started by adding your first equipment item.</p>
              <button className="btn btn-primary" onClick={handleAddItem}>
                <FiPlus /> Add First Item
              </button>
            </div>
          ) : (
            <>
              {/* Desktop Grid View */}
              <div className="equipment-grid desktop-view">
                {filteredEquipment.map(item => (
                  <div key={item.id} className="equipment-card">
                    <div className="equipment-header">
                      <div className="equipment-icon">
                        {getCategoryIcon(item.category)}
                      </div>
                      <div className="equipment-title">
                        <h3>{item.name}</h3>
                        <div className="equipment-category">{item.category}</div>
                      </div>
                      <div className="equipment-actions">
                        <button 
                          className="icon-btn" 
                          onClick={() => handleEditItem(item)}
                          title="Edit"
                        >
                          <FiEdit />
                        </button>
                        <button 
                          className="icon-btn delete" 
                          onClick={() => handleDeleteItem(item.id)}
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                    
                    <div className="equipment-details">
                      <div className="detail-row">
                        <div className="detail-item">
                          <span className="detail-label">Quantity:</span>
                          <span className="detail-value">{item.quantity} {item.unit}</span>
                        </div>
                      </div>
                      
                      {item.notes && (
                        <div className="equipment-notes">
                          <span className="notes-label">Notes:</span>
                          <p className="notes-content">{item.notes}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="equipment-actions-buttons">
                      <button className="btn btn-sm btn-primary">View Details</button>
                      <button className="btn btn-sm btn-secondary">Check Stock</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile Cards View */}
              <div className="mobile-cards-view">
                {filteredEquipment.map(item => (
                  <div key={item.id} className="mobile-card">
                    <div className="mobile-card-header">
                      <div className="mobile-card-icon">
                        {getCategoryIcon(item.category)}
                      </div>
                      <div className="mobile-card-title">
                        <h3>{item.name}</h3>
                        <div className="mobile-card-category">{item.category}</div>
                      </div>
                    </div>
                    
                    <div className="mobile-card-details">
                      <div className="mobile-detail-item">
                        <span className="mobile-detail-label">Quantity:</span>
                        <span className="mobile-detail-value">{item.quantity} {item.unit}</span>
                      </div>
                      
                      {item.notes && (
                        <div className="mobile-card-notes">
                          <span className="mobile-notes-label">Notes:</span>
                          <p className="mobile-notes-content">{item.notes}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="mobile-card-actions">
                      <button 
                        className="btn btn-sm btn-secondary" 
                        onClick={() => handleEditItem(item)}
                      >
                        <FiEdit /> Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-secondary delete" 
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <FiTrash2 /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      <EquipmentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveItem}
        equipment={selectedItem}
      />
    </div>
  );
};

export default Equipment;