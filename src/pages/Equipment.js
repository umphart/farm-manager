import React, { useState } from 'react';
import { FiPlus, FiPackage, FiTool, FiEdit, FiTrash2, FiDroplet, FiFilter, FiDownload, FiDollarSign, FiRefreshCw } from 'react-icons/fi';
import { FaSeedling, FaTractor } from 'react-icons/fa';
import { useToast } from '../contexts/ToastContext';
import EquipmentModal from '../components/EquipmentModal';
import './Equipment.css';

const Equipment = () => {
  const { showSuccess } = useToast();
  
  const [equipment, setEquipment] = useState([
    {
      id: 1,
      name: 'Automatic Feeder',
      category: 'feeding',
      quantity: 5,
      unit: 'units',
      location: 'Poultry House A',
      status: 'good',
      lastMaintenance: '2024-01-10',
      nextMaintenance: '2024-02-10',
      notes: 'Requires monthly cleaning',
    },
    {
      id: 2,
      name: 'Water Drinker',
      category: 'watering',
      quantity: 12,
      unit: 'units',
      location: 'Poultry Houses',
      status: 'good',
      lastMaintenance: '2024-01-15',
      nextMaintenance: '2024-02-15',
      notes: 'Check water flow regularly',
    },
    {
      id: 3,
      name: 'Fish Feed Pellets',
      category: 'consumables',
      quantity: 50,
      unit: 'bags',
      location: 'Feed Storage',
      status: 'in-stock',
      lastMaintenance: '2024-01-01',
      nextMaintenance: 'N/A',
      notes: '25kg bags - Catfish feed',
    },
    {
      id: 4,
      name: 'Rake',
      category: 'tools',
      quantity: 3,
      unit: 'units',
      location: 'Tool Shed',
      status: 'needs-repair',
      lastMaintenance: '2023-12-01',
      nextMaintenance: 'ASAP',
      notes: 'Handle needs replacement',
    },
    {
      id: 5,
      name: 'Water Pump',
      category: 'irrigation',
      quantity: 2,
      unit: 'units',
      location: 'Fish Ponds',
      status: 'good',
      lastMaintenance: '2024-01-05',
      nextMaintenance: '2024-02-05',
      notes: 'Pond A & B circulation',
    },
    {
      id: 6,
      name: 'Egg Trays',
      category: 'harvesting',
      quantity: 100,
      unit: 'trays',
      location: 'Poultry Storage',
      status: 'in-stock',
      lastMaintenance: 'N/A',
      nextMaintenance: 'N/A',
      notes: '30-egg capacity trays',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    location: 'all',
  });

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

  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'good', label: 'Good' },
    { value: 'needs-repair', label: 'Needs Repair' },
    { value: 'under-maintenance', label: 'Under Maintenance' },
    { value: 'in-stock', label: 'In Stock' },
    { value: 'low-stock', label: 'Low Stock' },
    { value: 'out-of-stock', label: 'Out of Stock' },
  ];

  const locations = [
    { value: 'all', label: 'All Locations' },
    { value: 'poultry-houses', label: 'Poultry Houses' },
    { value: 'fish-ponds', label: 'Fish Ponds' },
    { value: 'feed-storage', label: 'Feed Storage' },
    { value: 'tool-shed', label: 'Tool Shed' },
    { value: 'main-building', label: 'Main Building' },
    { value: 'field', label: 'Field' },
  ];

  const filteredEquipment = equipment.filter(item => {
    if (filters.category !== 'all' && item.category !== filters.category) return false;
    if (filters.status !== 'all' && item.status !== filters.status) return false;
    if (filters.location !== 'all' && item.location.toLowerCase().includes(filters.location) === false) return false;
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

  const handleDeleteItem = (itemId) => {
    if (window.confirm('Are you sure you want to delete this equipment item? This action cannot be undone.')) {
      setEquipment(equipment.filter(item => item.id !== itemId));
      showSuccess('Equipment item deleted successfully!');
    }
  };

  const handleSaveItem = (itemData) => {
    if (selectedItem) {
      setEquipment(equipment.map(item => 
        item.id === selectedItem.id 
          ? { ...selectedItem, ...itemData }
          : item
      ));
      showSuccess('Equipment updated successfully!');
    } else {
      const newItem = {
        id: Date.now(),
        ...itemData,
      };
      setEquipment([...equipment, newItem]);
      showSuccess('New equipment added successfully!');
    }
    setIsModalOpen(false);
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
      status: 'all',
      location: 'all',
    });
  };

  const handleExportData = () => {
    showSuccess('Export started. You will receive the file shortly.');
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

  const getStatusColor = (status) => {
    switch(status) {
      case 'good': return '#4CAF50';
      case 'needs-repair': return '#FF9800';
      case 'under-maintenance': return '#2196F3';
      case 'in-stock': return '#4CAF50';
      case 'low-stock': return '#FF9800';
      case 'out-of-stock': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const calculateTotalItems = () => {
    return equipment.length;
  };

  const calculateTotalValue = () => {
    // This would calculate based on item values in a real app
    return equipment.length * 5000; // Example calculation
  };

  const calculateNeedsRepair = () => {
    return equipment.filter(item => item.status === 'needs-repair').length;
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
    <div className="equipment-page">
      <div className="page-header">
        <h1>Equipment & Inventory</h1>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handleAddItem}>
            <FiPlus /> Add Item
          </button>
          <button className="btn btn-secondary" onClick={handleExportData}>
            <FiDownload /> Export
          </button>
        </div>
      </div>

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
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)' }}>
            <FiDollarSign />
          </div>
          <div className="stat-info">
            <h3>Estimated Value</h3>
            <div className="stat-value">{formatCurrency(calculateTotalValue())}</div>
            <div className="stat-label">Total Worth</div>
          </div>
        </div>
        
        <div className="equipment-stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)' }}>
            <FiTool />
          </div>
          <div className="stat-info">
            <h3>Needs Repair</h3>
            <div className="stat-value">{calculateNeedsRepair()}</div>
            <div className="stat-label">Items Requiring Attention</div>
          </div>
        </div>
        
        <div className="equipment-stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)' }}>
            <FiFilter />
          </div>
          <div className="stat-info">
            <h3>Categories</h3>
            <div className="stat-value">{categories.length - 1}</div>
            <div className="stat-label">Equipment Types</div>
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
          
          <div className="filter-item">
            <label>Status</label>
            <select 
              className="filter-select"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-item">
            <label>Location</label>
            <select 
              className="filter-select"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            >
              {locations.map(location => (
                <option key={location.value} value={location.value}>{location.label}</option>
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
                <div className="detail-item">
                  <span className="detail-label">Location:</span>
                  <span className="detail-value">{item.location}</span>
                </div>
              </div>
              
              <div className="detail-row">
                <div className="detail-item">
                  <span className="detail-label">Status:</span>
                  <span 
                    className="detail-value status-badge"
                    style={{ 
                      backgroundColor: `${getStatusColor(item.status)}20`,
                      color: getStatusColor(item.status)
                    }}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Last Maintenance:</span>
                  <span className="detail-value">{item.lastMaintenance}</span>
                </div>
              </div>
              
              <div className="detail-row">
                <div className="detail-item">
                  <span className="detail-label">Next Maintenance:</span>
                  <span className="detail-value">{item.nextMaintenance}</span>
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
              <button className="btn btn-sm btn-primary">View History</button>
              <button className="btn btn-sm btn-secondary">Record Maintenance</button>
              <button className="btn btn-sm btn-secondary">Transfer</button>
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
              
              <div className="mobile-detail-item">
                <span className="mobile-detail-label">Location:</span>
                <span className="mobile-detail-value">{item.location}</span>
              </div>
              
              <div className="mobile-detail-item">
                <span className="mobile-detail-label">Status:</span>
                <span 
                  className="mobile-detail-value status-badge"
                  style={{ 
                    backgroundColor: `${getStatusColor(item.status)}20`,
                    color: getStatusColor(item.status)
                  }}
                >
                  {item.status}
                </span>
              </div>
              
              <div className="mobile-detail-item">
                <span className="mobile-detail-label">Last Maintenance:</span>
                <span className="mobile-detail-value">{item.lastMaintenance}</span>
              </div>
              
              <div className="mobile-detail-item">
                <span className="mobile-detail-label">Next Maintenance:</span>
                <span className="mobile-detail-value">{item.nextMaintenance}</span>
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

      {/* Upcoming Maintenance Table */}
      <div className="upcoming-maintenance">
        <div className="section-header">
          <h2>Upcoming Maintenance</h2>
          <div className="table-summary">
            <span>Showing {Math.min(5, equipment.filter(item => item.nextMaintenance !== 'N/A' && item.nextMaintenance !== 'ASAP').length)} items</span>
          </div>
        </div>
        
        {/* Desktop Table View */}
        <div className="maintenance-table desktop-view">
          <table className="data-table">
            <thead>
              <tr>
                <th>Equipment</th>
                <th>Category</th>
                <th>Location</th>
                <th>Last Maintenance</th>
                <th>Next Due</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {equipment
                .filter(item => item.nextMaintenance !== 'N/A' && item.nextMaintenance !== 'ASAP')
                .slice(0, 5)
                .map(item => (
                  <tr key={item.id}>
                    <td data-label="Equipment">{item.name}</td>
                    <td data-label="Category">{item.category}</td>
                    <td data-label="Location">{item.location}</td>
                    <td data-label="Last Maintenance">{item.lastMaintenance}</td>
                    <td data-label="Next Due" className="due-date">{item.nextMaintenance}</td>
                    <td data-label="Status">
                      <span 
                        className="status-badge"
                        style={{ 
                          backgroundColor: `${getStatusColor(item.status)}20`,
                          color: getStatusColor(item.status)
                        }}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td data-label="Action">
                      <button className="btn btn-sm btn-primary">Schedule</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Maintenance Cards */}
        <div className="mobile-maintenance-view">
          {equipment
            .filter(item => item.nextMaintenance !== 'N/A' && item.nextMaintenance !== 'ASAP')
            .slice(0, 5)
            .map(item => (
              <div key={item.id} className="mobile-maintenance-card">
                <div className="mobile-maintenance-header">
                  <h4>{item.name}</h4>
                  <span className="mobile-maintenance-category">{item.category}</span>
                </div>
                
                <div className="mobile-maintenance-details">
                  <div className="mobile-maintenance-item">
                    <span className="label">Location:</span>
                    <span className="value">{item.location}</span>
                  </div>
                  <div className="mobile-maintenance-item">
                    <span className="label">Last Maintenance:</span>
                    <span className="value">{item.lastMaintenance}</span>
                  </div>
                  <div className="mobile-maintenance-item">
                    <span className="label">Next Due:</span>
                    <span className="value due-date">{item.nextMaintenance}</span>
                  </div>
                  <div className="mobile-maintenance-item">
                    <span className="label">Status:</span>
                    <span 
                      className="value status-badge"
                      style={{ 
                        backgroundColor: `${getStatusColor(item.status)}20`,
                        color: getStatusColor(item.status)
                      }}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
                
                <div className="mobile-maintenance-actions">
                  <button className="btn btn-sm btn-primary">Schedule</button>
                </div>
              </div>
            ))}
        </div>
      </div>

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