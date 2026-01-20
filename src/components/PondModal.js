import React, { useState, useEffect } from 'react';
import './Modal.css';
import { FiX } from 'react-icons/fi';

const PondModal = ({ isOpen, onClose, onSave, pond }) => {
  const [formData, setFormData] = useState({
    name: '',
    dateCreated: '',
    length: '',
    width: '',
    estimatedFish: '',
    breed: 'catfish',
  });

  const [calculatedArea, setCalculatedArea] = useState(0);

  useEffect(() => {
    if (pond) {
      setFormData({
        name: pond.name || '',
        dateCreated: pond.dateCreated || new Date().toISOString().split('T')[0],
        length: pond.length || '',
        width: pond.width || '',
        estimatedFish: pond.estimatedFish || '',
        breed: pond.breed || 'catfish',
      });
      
      // Calculate area if dimensions exist
      if (pond.length && pond.width) {
        const area = parseFloat(pond.length) * parseFloat(pond.width);
        setCalculatedArea(area);
      }
    } else {
      // Reset form for new pond
      setFormData({
        name: '',
        dateCreated: new Date().toISOString().split('T')[0],
        length: '',
        width: '',
        estimatedFish: '',
        breed: 'catfish',
      });
      setCalculatedArea(0);
    }
  }, [pond]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Calculate area when dimensions change
    if (name === 'length' || name === 'width') {
      const lengthValue = name === 'length' ? parseFloat(value) || 0 : parseFloat(formData.length) || 0;
      const widthValue = name === 'width' ? parseFloat(value) || 0 : parseFloat(formData.width) || 0;
      const area = lengthValue * widthValue;
      setCalculatedArea(area);
    }
  };

  const getRecommendedCapacity = () => {
    const length = parseFloat(formData.length) || 0;
    const width = parseFloat(formData.width) || 0;
    
    if (length && width) {
      const area = length * width;
      
      // Adjust density based on breed for recommendation
      let densityFactor = 1.5; // default: 1 fish per 1.5 sq ft
      
      switch(formData.breed) {
        case 'catfish':
          densityFactor = 1.2; // catfish can be stocked more densely
          break;
        case 'tilapia':
          densityFactor = 1.5;
          break;
        case 'carp':
          densityFactor = 2; // carp need more space
          break;
        case 'salmon':
          densityFactor = 3; // salmon need more space
          break;
        case 'trout':
          densityFactor = 2.5;
          break;
        case 'bass':
          densityFactor = 2;
          break;
        case 'mackerel':
          densityFactor = 1.8;
          break;
        default:
          densityFactor = 1.5;
      }
      
      return Math.round(area / densityFactor);
    }
    return 0;
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

  const recommendedCapacity = getRecommendedCapacity();

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
                <label htmlFor="length">Length (feet) *</label>
                <input
                  type="number"
                  id="length"
                  name="length"
                  value={formData.length}
                  onChange={handleChange}
                  placeholder="e.g., 30"
                  min="1"
                  step="0.5"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="width">Width (feet) *</label>
                <input
                  type="number"
                  id="width"
                  name="width"
                  value={formData.width}
                  onChange={handleChange}
                  placeholder="e.g., 15"
                  min="1"
                  step="0.5"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="estimatedFish">Estimated Fish Capacity *</label>
                <input
                  type="number"
                  id="estimatedFish"
                  name="estimatedFish"
                  value={formData.estimatedFish}
                  onChange={handleChange}
                  placeholder="Enter number of fish"
                  min="1"
                  required
                />
                <div className="form-info">
                  <div className="area-info">
                    Pond Area: {calculatedArea.toFixed(1)} sq ft
                  </div>
                  {calculatedArea > 0 && (
                    <div className="recommendation">
                      Recommended for {formData.breed}: ~{recommendedCapacity} fish
                    </div>
                  )}
                </div>
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