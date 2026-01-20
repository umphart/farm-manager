import React, { useState, useEffect } from 'react';
import './Modal.css';
import { FiX } from 'react-icons/fi';

const PondModal = ({ isOpen, onClose, onSave, pond }) => {
  const [formData, setFormData] = useState({
    name: '',
    dateCreated: '',
    length: '',
    width: '',
    depth: '',
    capacity: '',
    breed: 'catfish',
    waterSource: 'borehole',
    status: 'active',
  });

  useEffect(() => {
    if (pond) {
      setFormData({
        name: pond.name || '',
        dateCreated: pond.dateCreated || new Date().toISOString().split('T')[0],
        length: pond.length || '',
        width: pond.width || '',
        depth: pond.depth || '',
        capacity: pond.capacity || '',
        breed: pond.breed || 'catfish',
        waterSource: pond.waterSource || 'borehole',
        status: pond.status || 'active',
      });
    } else {
      // Reset form for new pond
      setFormData({
        name: '',
        dateCreated: new Date().toISOString().split('T')[0],
        length: '',
        width: '',
        depth: '',
        capacity: '',
        breed: 'catfish',
        waterSource: 'borehole',
        status: 'active',
      });
    }
  }, [pond]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateCapacity = () => {
    const length = parseFloat(formData.length) || 0;
    const width = parseFloat(formData.width) || 0;
    const depth = parseFloat(formData.depth) || 0;
    
    if (length && width && depth) {
      // Formula: length × width × depth (in meters) × 1000 = approximate fish capacity
      const volume = length * width * depth;
      const capacity = Math.round(volume * 1000); // Rough estimate: 1000 fish per cubic meter
      setFormData(prev => ({ ...prev, capacity: capacity.toString() }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  const breeds = [
    'catfish',
    'tilapia',
    'carp',
    'salmon',
    'trout',
    'bass',
    'mackerel',
    'others'
  ];

  const waterSources = [
    'borehole',
    'river',
    'stream',
    'rainwater',
    'municipal',
    'other'
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{pond ? 'Edit Pond' : 'Add New Pond'}</h2>
          <button className="modal-close" onClick={onClose}>
            <FiX />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Pond Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Pond A, Main Pond"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="dateCreated">Date Created *</label>
                <input
                  type="date"
                  id="dateCreated"
                  name="dateCreated"
                  value={formData.dateCreated}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="breed">Fish Breed *</label>
                <select
                  id="breed"
                  name="breed"
                  value={formData.breed}
                  onChange={handleChange}
                  required
                >
                  {breeds.map(breed => (
                    <option key={breed} value={breed}>
                      {breed.charAt(0).toUpperCase() + breed.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="waterSource">Water Source</label>
                <select
                  id="waterSource"
                  name="waterSource"
                  value={formData.waterSource}
                  onChange={handleChange}
                >
                  {waterSources.map(source => (
                    <option key={source} value={source}>
                      {source.charAt(0).toUpperCase() + source.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="length">Length (meters) *</label>
                <input
                  type="number"
                  id="length"
                  name="length"
                  value={formData.length}
                  onChange={handleChange}
                  onBlur={calculateCapacity}
                  placeholder="e.g., 10"
                  min="1"
                  step="0.1"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="width">Width (meters) *</label>
                <input
                  type="number"
                  id="width"
                  name="width"
                  value={formData.width}
                  onChange={handleChange}
                  onBlur={calculateCapacity}
                  placeholder="e.g., 5"
                  min="1"
                  step="0.1"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="depth">Depth (meters) *</label>
                <input
                  type="number"
                  id="depth"
                  name="depth"
                  value={formData.depth}
                  onChange={handleChange}
                  onBlur={calculateCapacity}
                  placeholder="e.g., 1.5"
                  min="0.5"
                  step="0.1"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="capacity">Estimated Capacity (fish)</label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  placeholder="Auto-calculated"
                  readOnly
                />
                <small className="form-help">Calculated based on dimensions</small>
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
                  <option value="maintenance">Maintenance</option>
                  <option value="empty">Empty</option>
                  <option value="harvesting">Ready for Harvest</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {pond ? 'Update Pond' : 'Create Pond'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PondModal;