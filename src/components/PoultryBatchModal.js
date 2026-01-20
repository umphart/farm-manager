import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import './Modal.css';

const PoultryBatchModal = ({ isOpen, onClose, onSave, batch }) => {
  const [formData, setFormData] = useState({
    batchName: '',
    dateAcquired: '',
    breed: 'layer',
    quantity: '',
    age: '',
    expectedProductionDate: '',
  });

  useEffect(() => {
    if (batch) {
      setFormData({
        batchName: batch.batchName || '',
        dateAcquired: batch.dateAcquired || new Date().toISOString().split('T')[0],
        breed: batch.breed || 'layer',
        quantity: batch.quantity || '',
        age: batch.age || '',
        expectedProductionDate: batch.expectedProductionDate || '',
      });
    } else {
      setFormData({
        batchName: '',
        dateAcquired: new Date().toISOString().split('T')[0],
        breed: 'layer',
        quantity: '',
        age: '',
        expectedProductionDate: '',
      });
    }
  }, [batch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  const breeds = [
    { value: 'layer', label: 'Layer (Egg Production)' },
    { value: 'broiler', label: 'Broiler (Meat Production)' },
    { value: 'dual', label: 'Dual Purpose' },
    { value: 'local', label: 'Local Breed' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{batch ? 'Edit Batch' : 'Add New Batch'}</h2>
          <button className="modal-close" onClick={onClose}>
            <FiX />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="batchName">Batch Name/ID *</label>
                <input
                  type="text"
                  id="batchName"
                  name="batchName"
                  value={formData.batchName}
                  onChange={handleChange}
                  placeholder="e.g., Layer Batch 1, Broiler Batch 2"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="dateAcquired">Date Acquired *</label>
                <input
                  type="date"
                  id="dateAcquired"
                  name="dateAcquired"
                  value={formData.dateAcquired}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="breed">Bird Breed *</label>
                <select
                  id="breed"
                  name="breed"
                  value={formData.breed}
                  onChange={handleChange}
                  required
                >
                  {breeds.map(breed => (
                    <option key={breed.value} value={breed.value}>
                      {breed.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="quantity">Quantity (birds) *</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="e.g., 500"
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="age">Age (weeks)</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="e.g., 20"
                  min="0"
                />
                <small className="form-help">
                  Age of birds at time of acquisition
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="expectedProductionDate">Expected Production Date</label>
                <input
                  type="date"
                  id="expectedProductionDate"
                  name="expectedProductionDate"
                  value={formData.expectedProductionDate}
                  onChange={handleChange}
                  min={formData.dateAcquired}
                />
                <small className="form-help">
                  For layers: Expected start of egg laying
                  <br />
                  For broilers: Expected harvest date
                </small>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {batch ? 'Update Batch' : 'Create Batch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PoultryBatchModal;