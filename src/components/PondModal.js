// src/components/PondModal.js
import React, { useState, useEffect } from 'react';
import './Modal.css';
import { FiX } from 'react-icons/fi';
import { supabase } from '../lib/supabase';

const PondModal = ({ isOpen, onClose, onSave, pond }) => {
  const [formData, setFormData] = useState({
    name: '',
    date_created: '',
    length: '',
    width: '',
    capacity: '', // No. of Fish in Pond (maximum capacity)
    breed: 'catfish',
    // Removed initial_stock field - current_stock will be set to capacity for new ponds
  });

  const [calculatedArea, setCalculatedArea] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (pond) {
      setFormData({
        name: pond.name || '',
        date_created: pond.dateCreated || new Date().toISOString().split('T')[0],
        length: pond.length || '',
        width: pond.width || '',
        capacity: pond.capacity || '', // Maximum capacity
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
        date_created: new Date().toISOString().split('T')[0],
        length: '',
        width: '',
        capacity: '',
        breed: 'catfish',
      });
      setCalculatedArea(0);
    }
    setError('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const capacity = parseInt(formData.capacity);
      
      if (capacity <= 0) {
        throw new Error('Number of fish in pond must be greater than 0');
      }

      const pondData = {
        name: formData.name,
        date_created: formData.date_created,
        length: parseFloat(formData.length),
        width: parseFloat(formData.width),
        capacity: capacity, // Maximum number of fish the pond can hold
        breed: formData.breed,
        // For new pond: current_stock = capacity (pond starts full)
        // For editing: keep existing current_stock
        current_stock: pond ? pond.currentStock : capacity,
        status: 'active',
        water_source: 'borehole',
        depth: 1.5
      };

      let result;
      
      if (pond) {
        // Update existing pond
        // When editing, only update capacity if it's not less than current stock
        if (capacity < pond.currentStock) {
          throw new Error(`Cannot reduce capacity below current stock (${pond.currentStock} fish)`);
        }
        
        result = await supabase
          .from('ponds')
          .update(pondData)
          .eq('id', pond.id)
          .select();
      } else {
        // Create new pond
        result = await supabase
          .from('ponds')
          .insert([pondData])
          .select();
      }

      if (result.error) throw result.error;

      // Transform the saved data to match the expected format
      const savedPond = result.data[0];
      const transformedPond = {
        id: savedPond.id,
        name: savedPond.name,
        dateCreated: savedPond.date_created,
        length: savedPond.length,
        width: savedPond.width,
        capacity: savedPond.capacity,
        breed: savedPond.breed,
        currentStock: savedPond.current_stock || 0,
        status: savedPond.status || 'active',
        waterSource: savedPond.water_source || 'borehole',
        depth: savedPond.depth || 1.5
      };

      onSave(transformedPond);
      onClose();
    } catch (error) {
      console.error('Error saving pond:', error);
      setError(error.message || 'Failed to save pond. Please try again.');
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{pond ? 'Edit Pond' : 'Add New Pond'}</h2>
          <button 
            className="modal-close" 
            onClick={onClose}
            disabled={loading}
          >
            <FiX />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className="alert alert-error">
                <strong>Error:</strong> {error}
              </div>
            )}
            
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
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="date_created">Date Created *</label>
                <input
                  type="date"
                  id="date_created"
                  name="date_created"
                  value={formData.date_created}
                  onChange={handleChange}
                  required
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="capacity">No. of Fish in Pond *</label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  placeholder="Maximum number of fish pond can hold"
                  min="1"
                  required
                  disabled={loading}
                />
                <div className="form-info">
                  <div className="area-info">
                    Pond Area: {calculatedArea.toFixed(1)} sq ft
                  </div>
                  <div className="capacity-info">
                    {pond ? (
                      <>
                        <div>Current Stock: {pond.currentStock} fish</div>
                        <div>Capacity Utilization: {pond.capacity > 0 ? 
                          Math.round((pond.currentStock / pond.capacity) * 100) : 0}%
                        </div>
                        {formData.capacity && pond.currentStock > 0 && parseInt(formData.capacity) < pond.currentStock && (
                          <div className="warning-text">
                            ⚠️ Cannot reduce capacity below current stock
                          </div>
                        )}
                      </>
                    ) : (
                      <div>New pond will start with full capacity</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : pond ? 'Update Pond' : 'Create Pond'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PondModal;