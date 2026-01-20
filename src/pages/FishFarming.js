import React, { useState } from 'react';
import { FiPlus, FiDroplet, FiThermometer, FiActivity, FiEdit, FiTrash2 } from 'react-icons/fi';
import { FaFish } from 'react-icons/fa';
import { useToast } from '../contexts/ToastContext';
import PondModal from '../components/PondModal';
import './FishFarming.css';

const FishFarming = () => {
  const { showSuccess } = useToast();
  
  const [ponds, setPonds] = useState([
    { 
      id: 1, 
      name: 'Pond A', 
      dateCreated: '2024-01-01',
      length: 10,
      width: 5,
      depth: 1.5,
      capacity: 2000, 
      breed: 'catfish',
      waterSource: 'borehole',
      currentStock: 1800, 
      waterTemp: 28, 
      pH: 7.2, 
      status: 'active' 
    },
    { 
      id: 2, 
      name: 'Pond B', 
      dateCreated: '2024-01-10',
      length: 8,
      width: 4,
      depth: 1.2,
      capacity: 1500, 
      breed: 'tilapia',
      waterSource: 'river',
      currentStock: 1200, 
      waterTemp: 27.5, 
      pH: 7.0, 
      status: 'active' 
    },
    { 
      id: 3, 
      name: 'Pond C', 
      dateCreated: '2024-01-15',
      length: 6,
      width: 3,
      depth: 1.0,
      capacity: 1000, 
      breed: 'catfish',
      waterSource: 'borehole',
      currentStock: 0, 
      waterTemp: 0, 
      pH: 0, 
      status: 'maintenance' 
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPond, setSelectedPond] = useState(null);

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-NG').format(num);
  };

  const calculateTotalStock = () => {
    return ponds.reduce((sum, pond) => sum + pond.currentStock, 0);
  };

  const handleAddPond = () => {
    setSelectedPond(null);
    setIsModalOpen(true);
  };

  const handleEditPond = (pond) => {
    setSelectedPond(pond);
    setIsModalOpen(true);
  };

  const handleDeletePond = (pondId) => {
    if (window.confirm('Are you sure you want to delete this pond? This action cannot be undone.')) {
      setPonds(ponds.filter(pond => pond.id !== pondId));
      showSuccess('Pond deleted successfully!');
    }
  };

  const handleSavePond = (pondData) => {
    if (selectedPond) {
      // Update existing pond
      setPonds(ponds.map(pond => 
        pond.id === selectedPond.id 
          ? { ...selectedPond, ...pondData, id: selectedPond.id }
          : pond
      ));
      showSuccess('Pond updated successfully!');
    } else {
      // Add new pond
      const newPond = {
        id: Date.now(),
        ...pondData,
        currentStock: 0,
        waterTemp: 0,
        pH: 0,
      };
      setPonds([...ponds, newPond]);
      showSuccess('New pond created successfully!');
    }
    setIsModalOpen(false);
  };

  const getBreedDisplayName = (breed) => {
    return breed.charAt(0).toUpperCase() + breed.slice(1);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return '#4CAF50';
      case 'maintenance': return '#FF9800';
      case 'inactive': return '#9E9E9E';
      case 'harvested': return '#2196F3';
      default: return '#9E9E9E';
    }
  };

  return (
    <div className="fish-farming-page">
      <div className="page-header">
        <h1>Fish Farming Management</h1>
        <button className="btn btn-primary" onClick={handleAddPond}>
          <FiPlus /> Add New Pond
        </button>
      </div>

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
            <FiThermometer />
          </div>
          <div className="fish-stat-info">
            <h3>Avg. Temperature</h3>
            <div className="fish-stat-value">27.8°C</div>
            <div className="fish-stat-label">Optimal: 26-30°C</div>
          </div>
        </div>
        
        <div className="fish-stat-card">
          <div className="fish-stat-icon">
            <FiActivity />
          </div>
          <div className="fish-stat-info">
            <h3>Next Harvest</h3>
            <div className="fish-stat-value">30 days</div>
            <div className="fish-stat-label">Estimated yield: 1.5 tons</div>
          </div>
        </div>
      </div>

      <div className="ponds-section">
        <div className="section-header">
          <h2>Pond Management</h2>
          <div className="table-summary">
            <span>Total Ponds: {ponds.length}</span>
            <span>Total Capacity: {formatNumber(ponds.reduce((sum, pond) => sum + pond.capacity, 0))} fish</span>
          </div>
        </div>
        
        {/* Desktop Table View */}
        <div className="ponds-table desktop-view">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Pond Name</th>
                  <th>Breed</th>
                  <th>Dimensions</th>
                  <th>Capacity</th>
                  <th>Current Stock</th>
                  <th>Utilization</th>
                  <th>Status</th>
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
                        </div>
                      </div>
                    </td>
                    <td data-label="Breed">
                      <span className="pond-breed">{getBreedDisplayName(pond.breed)}</span>
                    </td>
                    <td data-label="Dimensions">{pond.length}m × {pond.width}m × {pond.depth}m</td>
                    <td data-label="Capacity">{formatNumber(pond.capacity)}</td>
                    <td data-label="Current Stock">{formatNumber(pond.currentStock)}</td>
                    <td data-label="Utilization">
                      {pond.capacity > 0 ? ((pond.currentStock / pond.capacity) * 100).toFixed(1) + '%' : '0%'}
                    </td>
                    <td data-label="Status">
                      <span 
                        className="pond-status" 
                        style={{ 
                          backgroundColor: `${getStatusColor(pond.status)}20`, 
                          color: getStatusColor(pond.status) 
                        }}
                      >
                        {pond.status}
                      </span>
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

        {/* Mobile Cards View */}
        <div className="mobile-ponds-view">
          {ponds.map(pond => (
            <div key={pond.id} className="mobile-pond-card">
              <div className="mobile-pond-header">
                <div className="mobile-pond-title">
                  <h3>{pond.name}</h3>
                  <div className="mobile-pond-meta">
                    <span className="mobile-pond-breed">{getBreedDisplayName(pond.breed)}</span>
                    <span className="mobile-pond-date">Created: {pond.dateCreated}</span>
                  </div>
                </div>
                <div className="mobile-pond-status">
                  <span 
                    className="pond-status" 
                    style={{ 
                      backgroundColor: `${getStatusColor(pond.status)}20`, 
                      color: getStatusColor(pond.status) 
                    }}
                  >
                    {pond.status}
                  </span>
                </div>
              </div>
              
              <div className="mobile-pond-details">
                <div className="mobile-detail-row">
                  <div className="mobile-detail-item">
                    <span className="mobile-detail-label">Dimensions:</span>
                    <span className="mobile-detail-value">{pond.length}m × {pond.width}m × {pond.depth}m</span>
                  </div>
                  <div className="mobile-detail-item">
                    <span className="mobile-detail-label">Capacity:</span>
                    <span className="mobile-detail-value">{formatNumber(pond.capacity)} fish</span>
                  </div>
                </div>
                
                <div className="mobile-detail-row">
                  <div className="mobile-detail-item">
                    <span className="mobile-detail-label">Current Stock:</span>
                    <span className="mobile-detail-value">{formatNumber(pond.currentStock)} fish</span>
                  </div>
                  <div className="mobile-detail-item">
                    <span className="mobile-detail-label">Utilization:</span>
                    <span className="mobile-detail-value">
                      {pond.capacity > 0 ? ((pond.currentStock / pond.capacity) * 100).toFixed(1) + '%' : '0%'}
                    </span>
                  </div>
                </div>
                
                <div className="mobile-detail-row">
                  <div className="mobile-detail-item">
                    <span className="mobile-detail-label">Water Source:</span>
                    <span className="mobile-detail-value">{pond.waterSource}</span>
                  </div>
                </div>
                
                {pond.status === 'active' && pond.currentStock > 0 && (
                  <div className="mobile-water-parameters">
                    <h4>Water Parameters</h4>
                    <div className="mobile-parameters-grid">
                      <div className="mobile-parameter">
                        <span className="mobile-param-label">Temperature:</span>
                        <span className="mobile-param-value">{pond.waterTemp}°C</span>
                      </div>
                      <div className="mobile-parameter">
                        <span className="mobile-param-label">pH Level:</span>
                        <span className="mobile-param-value">{pond.pH}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mobile-pond-actions">
                <button 
                  className="btn btn-sm btn-secondary" 
                  onClick={() => handleEditPond(pond)}
                >
                  <FiEdit /> Edit
                </button>
                <button 
                  className="btn btn-sm btn-secondary delete" 
                  onClick={() => handleDeletePond(pond.id)}
                >
                  <FiTrash2 /> Delete
                </button>
                <button className="btn btn-sm btn-primary">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="feeding-schedule">
        <div className="section-header">
          <h2>Feeding Schedule</h2>
          <div className="table-summary">
            <span>Showing {ponds.filter(p => p.status === 'active' && p.currentStock > 0).length} ponds</span>
          </div>
        </div>
        
        {/* Desktop Table View */}
        <div className="schedule-table desktop-view">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Pond</th>
                  <th>Breed</th>
                  <th>Feed Type</th>
                  <th>Quantity (kg)</th>
                  <th>Frequency</th>
                  <th>Last Fed</th>
                  <th>Next Feeding</th>
                </tr>
              </thead>
              <tbody>
                {ponds.filter(p => p.status === 'active' && p.currentStock > 0).map(pond => (
                  <tr key={pond.id}>
                    <td data-label="Pond">{pond.name}</td>
                    <td data-label="Breed">{getBreedDisplayName(pond.breed)}</td>
                    <td data-label="Feed Type">{pond.breed === 'catfish' ? 'Floating Pellets' : 'Sinking Pellets'}</td>
                    <td data-label="Quantity">{Math.round(pond.currentStock * 0.02)}</td>
                    <td data-label="Frequency">3 times/day</td>
                    <td data-label="Last Fed">Today 08:00</td>
                    <td data-label="Next Feeding">Today 14:00</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Feeding Cards */}
        <div className="mobile-feeding-view">
          {ponds.filter(p => p.status === 'active' && p.currentStock > 0).map(pond => (
            <div key={pond.id} className="mobile-feeding-card">
              <div className="mobile-feeding-header">
                <h4>{pond.name}</h4>
                <span className="mobile-feeding-breed">{getBreedDisplayName(pond.breed)}</span>
              </div>
              
              <div className="mobile-feeding-details">
                <div className="mobile-feeding-item">
                  <span className="label">Feed Type:</span>
                  <span className="value">{pond.breed === 'catfish' ? 'Floating Pellets' : 'Sinking Pellets'}</span>
                </div>
                <div className="mobile-feeding-item">
                  <span className="label">Quantity:</span>
                  <span className="value">{Math.round(pond.currentStock * 0.02)} kg</span>
                </div>
                <div className="mobile-feeding-item">
                  <span className="label">Frequency:</span>
                  <span className="value">3 times/day</span>
                </div>
                <div className="mobile-feeding-item">
                  <span className="label">Last Fed:</span>
                  <span className="value">Today 08:00</span>
                </div>
                <div className="mobile-feeding-item">
                  <span className="label">Next Feeding:</span>
                  <span className="value">Today 14:00</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <PondModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePond}
        pond={selectedPond}
      />
    </div>
  );
};

export default FishFarming;