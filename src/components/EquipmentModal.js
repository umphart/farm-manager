import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { supabase } from '../lib/supabase';
import './Modal.css';

const EquipmentModal = ({ isOpen, onClose, onSave, equipment }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'feeding',
    quantity: '',
    unit: 'units',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (equipment) {
      setFormData({
        name: equipment.name || '',
        category: equipment.category || 'feeding',
        quantity: equipment.quantity || '',
        unit: equipment.unit || 'units',
        notes: equipment.notes || '',
      });
    } else {
      setFormData({
        name: '',
        category: 'feeding',
        quantity: '',
        unit: 'units',
        notes: '',
      });
    }
    setError('');
  }, [equipment]);

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
      const equipmentData = {
        name: formData.name,
        category: formData.category,
        quantity: parseInt(formData.quantity),
        unit: formData.unit,
        notes: formData.notes || '',
      };

      let result;
      
      if (equipment) {
        // Update existing equipment
        result = await supabase
          .from('equipment')
          .update(equipmentData)
          .eq('id', equipment.id)
          .select();
      } else {
        // Create new equipment
        result = await supabase
          .from('equipment')
          .insert([equipmentData])
          .select();
      }

      if (result.error) throw result.error;

      // Transform the saved data to match component structure
      const savedEquipment = result.data[0];
      const transformedEquipment = {
        id: savedEquipment.id,
        name: savedEquipment.name,
        category: savedEquipment.category,
        quantity: savedEquipment.quantity,
        unit: savedEquipment.unit || 'units',
        notes: savedEquipment.notes || '',
      };

      onSave(transformedEquipment);
      onClose();
    } catch (error) {
      console.error('Error saving equipment:', error);
      setError(error.message || 'Failed to save equipment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const categories = [
    { value: 'feeding', label: 'Feeding Equipment' },
    { value: 'watering', label: 'Watering Equipment' },
    { value: 'tools', label: 'Tools' },
    { value: 'irrigation', label: 'Irrigation' },
    { value: 'consumables', label: 'Consumables' },
    { value: 'harvesting', label: 'Harvesting Equipment' },
    { value: 'safety', label: 'Safety Equipment' },
    { value: 'storage', label: 'Storage Equipment' },
    { value: 'transport', label: 'Transport Equipment' },
    { value: 'other', label: 'Other' },
  ];

  const units = [
    { value: 'units', label: 'Units' },
    { value: 'pieces', label: 'Pieces' },
    { value: 'bags', label: 'Bags' },
    { value: 'kg', label: 'Kilograms' },
    { value: 'liters', label: 'Liters' },
    { value: 'meters', label: 'Meters' },
    { value: 'sets', label: 'Sets' },
    { value: 'pairs', label: 'Pairs' },
    { value: 'trays', label: 'Trays' },
    { value: 'boxes', label: 'Boxes' },
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{equipment ? 'Edit Equipment' : 'Add New Equipment'}</h2>
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
                <label htmlFor="name">Item Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Automatic Feeder, Water Pump"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="quantity">Quantity *</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="e.g., 5"
                  min="1"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="unit">Unit</label>
                <select
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  disabled={loading}
                >
                  {units.map(unit => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group full-width">
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Description, special instructions, etc."
                  rows="3"
                  disabled={loading}
                />
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
              {loading ? 'Saving...' : equipment ? 'Update Equipment' : 'Add Equipment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EquipmentModal;