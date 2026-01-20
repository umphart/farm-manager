import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import './Modal.css';
const PoultryBatchModal = ({ isOpen, onClose, onSave, batch }) => {
  const [formData, setFormData] = useState({
    batchName: '',
    dateAcquired: '',
    breed: 'layer',
    quantity: '',
    house: 'House A',
    age: '',
    source: 'hatchery',
    status: 'active',
    expectedProduction: '',
  });

  useEffect(() => {
    if (batch) {
      setFormData({
        batchName: batch.batchName || '',
        dateAcquired: batch.dateAcquired || new Date().toISOString().split('T')[0],
        breed: batch.breed || 'layer',
        quantity: batch.quantity || '',
        house: batch.house || 'House A',
        age: batch.age || '',
        source: batch.source || 'hatchery',
        status: batch.status || 'active',
        expectedProduction: batch.expectedProduction || '',
      });
    } else {
      setFormData({
        batchName: '',
        dateAcquired: new Date().toISOString().split('T')[0],
        breed: 'layer',
        quantity: '',
        house: 'House A',
        age: '',
        source: 'hatchery',
        status: 'active',
        expectedProduction: '',
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

  const calculateExpectedProduction = () => {
    const quantity = parseInt(formData.quantity) || 0;
    const breed = formData.breed;
    
    let rate = 0;
    if (breed === 'layer') rate = 0.8; // 80% production rate
    else if (breed === 'broiler') rate = 0; // broilers don't lay eggs
    else if (breed === 'dual') rate = 0.6; // dual purpose 60%
    
    const production = Math.round(quantity * rate);
    setFormData(prev => ({ ...prev, expectedProduction: production.toString() }));
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

  const houses = ['House A', 'House B', 'House C', 'House D', 'House E'];
  const sources = ['hatchery', 'local market', 'other farm', 'breeding'];

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
                  onBlur={calculateExpectedProduction}
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
                  onBlur={calculateExpectedProduction}
                  placeholder="e.g., 500"
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="house">House Assignment *</label>
                <select
                  id="house"
                  name="house"
                  value={formData.house}
                  onChange={handleChange}
                  required
                >
                  {houses.map(house => (
                    <option key={house} value={house}>{house}</option>
                  ))}
                </select>
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
              </div>

              <div className="form-group">
                <label htmlFor="source">Source</label>
                <select
                  id="source"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                >
                  {sources.map(source => (
                    <option key={source} value={source}>
                      {source.charAt(0).toUpperCase() + source.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="expectedProduction">Expected Daily Production</label>
                <input
                  type="number"
                  id="expectedProduction"
                  name="expectedProduction"
                  value={formData.expectedProduction}
                  onChange={handleChange}
                  placeholder="Auto-calculated for layers"
                  readOnly={formData.breed === 'layer'}
                />
                <small className="form-help">
                  {formData.breed === 'layer' 
                    ? 'Estimated daily eggs' 
                    : 'Not applicable for broilers'}
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="active">Active</option>
                  <option value="growing">Growing</option>
                  <option value="laying">Laying</option>
                  <option value="harvested">Harvested</option>
                  <option value="sold">Sold</option>
                </select>
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