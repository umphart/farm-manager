import React, { useState } from 'react';
import { FiPlus, FiActivity, FiUsers, FiPackage, FiEdit, FiTrash2 } from 'react-icons/fi';
import { FaEgg } from 'react-icons/fa';
import { useToast } from '../contexts/ToastContext';
import PoultryBatchModal from '../components/PoultryBatchModal';
import './Poultry.css';

const Poultry = () => {
  const { showSuccess, showError } = useToast();
  
  const [batches, setBatches] = useState([
    {
      id: 1,
      batchName: 'Layer Batch 1',
      dateAcquired: '2024-01-01',
      breed: 'layer',
      quantity: 500,
      house: 'House A',
      age: 20,
      source: 'hatchery',
      status: 'active',
      expectedProduction: 400,
      dailyEggs: 380,
      feedConsumption: 25,
    },
    {
      id: 2,
      batchName: 'Broiler Batch 1',
      dateAcquired: '2024-01-10',
      breed: 'broiler',
      quantity: 300,
      house: 'House B',
      age: 6,
      source: 'local market',
      status: 'growing',
      expectedProduction: 0,
      dailyEggs: 0,
      feedConsumption: 18,
    },
    {
      id: 3,
      batchName: 'Dual Purpose Batch',
      dateAcquired: '2024-01-05',
      breed: 'dual',
      quantity: 450,
      house: 'House C',
      age: 15,
      source: 'other farm',
      status: 'laying',
      expectedProduction: 270,
      dailyEggs: 250,
      feedConsumption: 22,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-NG').format(num);
  };

  const calculateTotalBirds = () => {
    return batches.reduce((sum, batch) => sum + batch.quantity, 0);
  };

  const calculateDailyEggs = () => {
    return batches.reduce((sum, batch) => sum + (batch.dailyEggs || 0), 0);
  };

  const calculateMortalityRate = () => {
    // Simulating some mortality
    const totalBirds = calculateTotalBirds();
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

  const handleDeleteBatch = (batchId) => {
    if (window.confirm('Are you sure you want to delete this batch? This action cannot be undone.')) {
      setBatches(batches.filter(batch => batch.id !== batchId));
      showSuccess('Batch deleted successfully!');
    }
  };

  const handleSaveBatch = (batchData) => {
    if (selectedBatch) {
      // Update existing batch
      setBatches(batches.map(batch => 
        batch.id === selectedBatch.id 
          ? { ...selectedBatch, ...batchData, id: selectedBatch.id }
          : batch
      ));
      showSuccess('Batch updated successfully!');
    } else {
      // Add new batch
      const newBatch = {
        id: Date.now(),
        ...batchData,
        dailyEggs: batchData.breed === 'layer' ? Math.round(batchData.quantity * 0.75) : 0,
        feedConsumption: Math.round(batchData.quantity * 0.05),
      };
      setBatches([...batches, newBatch]);
      showSuccess('New batch created successfully!');
    }
    setIsModalOpen(false);
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
    switch(status) {
      case 'active': return 'green';
      case 'growing': return 'blue';
      case 'laying': return 'orange';
      case 'harvested': return 'gray';
      case 'sold': return 'purple';
      default: return 'gray';
    }
  };

  return (
    <div className="poultry-page">
      <div className="page-header">
        <h1>Poultry Management</h1>
        <button className="btn btn-primary" onClick={handleAddBatch}>
          <FiPlus /> Add New Batch
        </button>
      </div>

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
            <div className="batch-summary">
              <span>Total Batches: {batches.length}</span>
              <span>Total Birds: {formatNumber(calculateTotalBirds())}</span>
            </div>
          </div>
          
          <div className="batches-grid">
            {batches.map(batch => (
              <div key={batch.id} className="batch-card">
                <div className="batch-header">
                  <div>
                    <h3>{batch.batchName}</h3>
                    <div className="batch-meta">
                      <span className="batch-breed">{getBreedDisplayName(batch.breed)}</span>
                      <span className="batch-date">Acquired: {batch.dateAcquired}</span>
                    </div>
                  </div>
                  <div className="batch-header-actions">
                    <span 
                      className="batch-status" 
                      style={{ backgroundColor: `${getStatusColor(batch.status)}20`, color: getStatusColor(batch.status) }}
                    >
                      {batch.status}
                    </span>
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
                  </div>
                </div>
                
                <div className="batch-details">
                  <div className="batch-detail">
                    <span className="detail-label">Quantity:</span>
                    <span className="detail-value">{formatNumber(batch.quantity)} birds</span>
                  </div>
                  <div className="batch-detail">
                    <span className="detail-label">House:</span>
                    <span className="detail-value">{batch.house}</span>
                  </div>
                  <div className="batch-detail">
                    <span className="detail-label">Age:</span>
                    <span className="detail-value">{batch.age} weeks</span>
                  </div>
                  <div className="batch-detail">
                    <span className="detail-label">Source:</span>
                    <span className="detail-value">{batch.source}</span>
                  </div>
                  {batch.breed === 'layer' && (
                    <div className="batch-detail">
                      <span className="detail-label">Daily Eggs:</span>
                      <span className="detail-value">{formatNumber(batch.dailyEggs)}</span>
                    </div>
                  )}
                  <div className="batch-detail">
                    <span className="detail-label">Feed/Day:</span>
                    <span className="detail-value">{batch.feedConsumption} kg</span>
                  </div>
                </div>

                <div className="batch-actions">
                  <button className="btn btn-sm btn-primary">View Details</button>
                  <button className="btn btn-sm btn-secondary">Record Eggs</button>
                  <button className="btn btn-sm btn-secondary">Update Health</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <h2>Daily Production</h2>
          <div className="production-table">
            <table>
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
                    <td>2024-01-15</td>
                    <td>{batch.batchName}</td>
                    <td>{batch.house}</td>
                    <td>{getBreedDisplayName(batch.breed)}</td>
                    <td>{batch.dailyEggs}</td>
                    <td>{Math.round(batch.dailyEggs * 0.01)}</td>
                    <td>{batch.feedConsumption}</td>
                    <td>{Math.round(batch.quantity * 0.3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

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