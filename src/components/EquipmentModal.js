import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import './Modal.css';

const EquipmentModal = ({ isOpen, onClose, onSave, equipment }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'feeding',
    quantity: '',
    unit: 'units',
    notes: '',
  });

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
  }, [equipment]);

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
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{equipment ? 'Edit Equipment' : 'Add New Equipment'}</h2>
          <button className="modal-close" onClick={onClose}>
            <FiX />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
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
                />
              </div>

              <div className="form-group">
                <label htmlFor="unit">Unit</label>
                <select
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
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
                  placeholder="Maintenance notes, special instructions, etc."
                  rows="3"
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {equipment ? 'Update Equipment' : 'Add Equipment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EquipmentModal;