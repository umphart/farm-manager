import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { supabase } from '../lib/supabase';
import './Modal.css';

const PoultryBatchModal = ({ isOpen, onClose, onSave, batch }) => {
  const [formData, setFormData] = useState({
    batch_name: '',
    date_acquired: '',
    breed: 'layer',
    quantity: '',
    expected_production_date: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (batch) {
      setFormData({
        batch_name: batch.batchName || '',
        date_acquired: batch.dateAcquired || new Date().toISOString().split('T')[0],
        breed: batch.breed || 'layer',
        quantity: batch.quantity || '',
        expected_production_date: batch.expectedProductionDate || '',
      });
    } else {
      setFormData({
        batch_name: '',
        date_acquired: new Date().toISOString().split('T')[0],
        breed: 'layer',
        quantity: '',
        expected_production_date: '',
      });
    }
    setError('');
  }, [batch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const batchData = {
        batch_name: formData.batch_name,
        date_acquired: formData.date_acquired,
        breed: formData.breed,
        quantity: parseInt(formData.quantity),
        expected_production_date: formData.expected_production_date || null,
        status: 'active',
        house: 'House A',
        source: 'hatchery',
        // Calculate daily eggs based on breed and quantity
        daily_eggs: formData.breed === 'layer' || formData.breed === 'dual' 
          ? Math.round(parseInt(formData.quantity) * 0.75) 
          : 0,
        // Calculate feed consumption
        feed_consumption: Math.round(parseInt(formData.quantity) * 0.05),
      };

      let result;
      
      if (batch) {
        // Update existing batch
        result = await supabase
          .from('poultry_batches')
          .update(batchData)
          .eq('id', batch.id)
          .select();
      } else {
        // Create new batch
        result = await supabase
          .from('poultry_batches')
          .insert([batchData])
          .select();
      }

      if (result.error) throw result.error;

      // Transform the saved data to match component structure
      const savedBatch = result.data[0];
      const transformedBatch = {
        id: savedBatch.id,
        batchName: savedBatch.batch_name,
        dateAcquired: savedBatch.date_acquired,
        breed: savedBatch.breed,
        quantity: savedBatch.quantity,
        expectedProductionDate: savedBatch.expected_production_date,
        house: savedBatch.house || 'House A',
        source: savedBatch.source || 'hatchery',
        status: savedBatch.status || 'active',
        dailyEggs: savedBatch.daily_eggs || 0,
        feedConsumption: savedBatch.feed_consumption || 0,
      };

      onSave(transformedBatch);
      onClose();
    } catch (error) {
      console.error('Error saving poultry batch:', error);
      setError(error.message || 'Failed to save batch. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const breeds = [
    { value: 'layer', label: 'Layer (Egg Production)' },
    { value: 'broiler', label: 'Broiler (Meat Production)' },
    { value: 'dual', label: 'Dual Purpose' },
    { value: 'Maja', label: 'Maja (Noiler)' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{batch ? 'Edit Batch' : 'Add New Batch'}</h2>
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
                <label htmlFor="batch_name">Batch Name/ID *</label>
                <input
                  type="text"
                  id="batch_name"
                  name="batch_name"
                  value={formData.batch_name}
                  onChange={handleChange}
                  placeholder="e.g., Layer Batch 1, Broiler Batch 2"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="date_acquired">Date Acquired *</label>
                <input
                  type="date"
                  id="date_acquired"
                  name="date_acquired"
                  value={formData.date_acquired}
                  onChange={handleChange}
                  required
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="expected_production_date">Expected Production Date</label>
                <input
                  type="date"
                  id="expected_production_date"
                  name="expected_production_date"
                  value={formData.expected_production_date}
                  onChange={handleChange}
                  min={formData.date_acquired}
                  disabled={loading}
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
              {loading ? 'Saving...' : batch ? 'Update Batch' : 'Create Batch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PoultryBatchModal;