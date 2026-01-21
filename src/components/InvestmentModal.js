import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { supabase } from '../lib/supabase';
import './Modal.css'; // Assuming you have this CSS file

const InvestmentModal = ({ isOpen, onClose, onSave, investment }) => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    amount: '',
    type: 'infrastructure',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (investment) {
      setFormData({
        name: investment.name || '',
        date: investment.date || new Date().toISOString().split('T')[0],
        amount: investment.amount || '',
        type: investment.type || 'infrastructure',
      });
    } else {
      setFormData({
        name: '',
        date: new Date().toISOString().split('T')[0],
        amount: '',
        type: 'infrastructure',
      });
    }
    setErrors({});
  }, [investment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Investment name is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Valid amount is required';
    if (!formData.type) newErrors.type = 'Investment type is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Prepare the data
      const investmentData = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: formData.date
      };

      let result;
      
      if (investment?.id) {
        // Update existing investment
        result = await supabase
          .from('investments')
          .update(investmentData)
          .eq('id', investment.id)
          .select();
      } else {
        // Insert new investment
        result = await supabase
          .from('investments')
          .insert([investmentData])
          .select();
      }

      if (result.error) throw result.error;

      // Call the onSave callback with the saved data
      onSave(result.data[0]);
      onClose();
    } catch (error) {
      console.error('Error saving investment:', error);
      setErrors({ submit: error.message || 'Failed to save investment. Please try again.' });
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{investment ? 'Edit Investment' : 'Add New Investment'}</h2>
          <button className="modal-close" onClick={onClose} disabled={loading}>
            <FiX />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {errors.submit && (
              <div className="alert alert-error">
                <strong>Error:</strong> {errors.submit}
              </div>
            )}
            
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Investment Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? 'error' : ''}
                  placeholder="e.g., New Fish Ponds, Poultry Expansion"
                  required
                  disabled={loading}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="date">Investment Date *</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={errors.date ? 'error' : ''}
                  required
                  disabled={loading}
                />
                {errors.date && <span className="error-message">{errors.date}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="amount">Amount (₦) *</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className={errors.amount ? 'error' : ''}
                  placeholder="Enter amount"
                  min="0"
                  step="1000"
                  required
                  disabled={loading}
                />
                {errors.amount && <span className="error-message">{errors.amount}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="type">Investment Type *</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={errors.type ? 'error' : ''}
                  required
                  disabled={loading}
                >
                  {investmentTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.type && <span className="error-message">{errors.type}</span>}
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
              {loading ? 'Saving...' : investment ? 'Update Investment' : 'Create Investment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvestmentModal;