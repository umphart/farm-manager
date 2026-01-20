import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const InvestmentModal = ({ isOpen, onClose, onSave, investment }) => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    amount: '',
    type: 'infrastructure',
    description: '',
    expectedROI: '',
    duration: '',
    status: 'planned',
    notes: '',
  });

  useEffect(() => {
    if (investment) {
      setFormData({
        name: investment.name || '',
        date: investment.date || new Date().toISOString().split('T')[0],
        amount: investment.amount || '',
        type: investment.type || 'infrastructure',
        description: investment.description || '',
        expectedROI: investment.expectedROI || '',
        duration: investment.duration || '',
        status: investment.status || 'planned',
        notes: investment.notes || '',
      });
    } else {
      setFormData({
        name: '',
        date: new Date().toISOString().split('T')[0],
        amount: '',
        type: 'infrastructure',
        description: '',
        expectedROI: '',
        duration: '',
        status: 'planned',
        notes: '',
      });
    }
  }, [investment]);

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

  const investmentTypes = [
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'facility', label: 'Facility' },
    { value: 'stock', label: 'Stock Purchase' },
    { value: 'technology', label: 'Technology' },
    { value: 'land', label: 'Land Acquisition' },
    { value: 'other', label: 'Other' }
  ];

  const statuses = [
    { value: 'planned', label: 'Planned' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'delayed', label: 'Delayed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{investment ? 'Edit Investment' : 'Add New Investment'}</h2>
          <button className="modal-close" onClick={onClose}>
            <FiX />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Investment Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., New Fish Ponds, Poultry Expansion"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="date">Investment Date *</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="amount">Amount (₦) *</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Enter amount"
                  min="0"
                  step="1000"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="type">Investment Type *</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  {investmentTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="expectedROI">Expected ROI (%)</label>
                <input
                  type="number"
                  id="expectedROI"
                  name="expectedROI"
                  value={formData.expectedROI}
                  onChange={handleChange}
                  placeholder="e.g., 15"
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="duration">Duration (months)</label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g., 12"
                  min="1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  {statuses.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group full-width">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief description of the investment"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Additional notes or details..."
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
              {investment ? 'Update Investment' : 'Create Investment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvestmentModal;