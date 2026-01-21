// src/components/ExpenseModal.js
import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { supabase } from '../lib/supabase';
import './Modal.css'; // Assuming you have this CSS file

const ExpenseModal = ({ isOpen, onClose, onSave, expense }) => {
  const [formData, setFormData] = useState({
    date: '',
    category: 'feed',
    description: '',
    amount: '',
    farm_section: 'fish',
    payment_method: 'cash',
    receipt_no: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (expense) {
      setFormData({
        date: expense.date || new Date().toISOString().split('T')[0],
        category: expense.category || 'feed',
        description: expense.description || '',
        amount: expense.amount || '',
        farm_section: expense.farm_section || 'fish',
        payment_method: expense.payment_method || 'cash',
        receipt_no: expense.receipt_no || '',
        notes: expense.notes || '',
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        category: 'feed',
        description: '',
        amount: '',
        farm_section: 'fish',
        payment_method: 'cash',
        receipt_no: '',
        notes: '',
      });
    }
    setErrors({});
  }, [expense]);

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
    
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Valid amount is required';
    if (!formData.farm_section) newErrors.farm_section = 'Farm section is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Prepare the data without user_id
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: formData.date // Keep as string, Supabase will handle date conversion
      };

      let result;
      
      if (expense?.id) {
        // Update existing expense
        result = await supabase
          .from('expenses')
          .update(expenseData)
          .eq('id', expense.id)
          .select();
      } else {
        // Insert new expense
        result = await supabase
          .from('expenses')
          .insert([expenseData])
          .select();
      }

      if (result.error) throw result.error;

      // Call the onSave callback with the saved data
      onSave(result.data[0]);
      onClose();
    } catch (error) {
      console.error('Error saving expense:', error);
      setErrors({ submit: error.message || 'Failed to save expense. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const categories = [
    { value: 'feed', label: 'Feed' },
    { value: 'medication', label: 'Medication' },
    { value: 'labor', label: 'Labor' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'transport', label: 'Transport' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'veterinary', label: 'Veterinary Services' },
    { value: 'pond_setup', label: 'Pond Setup' },
    { value: 'other', label: 'Other' }
  ];

  const farmSections = [
    { value: 'fish', label: 'Fish Farming' },
    { value: 'poultry', label: 'Poultry' },
    { value: 'livestock', label: 'Livestock' },
    { value: 'general', label: 'General' },
    { value: 'administration', label: 'Administration' }
  ];

  const paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'bank-transfer', label: 'Bank Transfer' },
    { value: 'card', label: 'Card' },
    { value: 'mobile-money', label: 'Mobile Money' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{expense ? 'Edit Expense' : 'Add New Expense'}</h2>
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
                <label htmlFor="date">Date *</label>
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
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={errors.category ? 'error' : ''}
                  required
                  disabled={loading}
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                {errors.category && <span className="error-message">{errors.category}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="farm_section">Farm Section *</label>
                <select
                  id="farm_section"
                  name="farm_section"
                  value={formData.farm_section}
                  onChange={handleChange}
                  className={errors.farm_section ? 'error' : ''}
                  required
                  disabled={loading}
                >
                  {farmSections.map(section => (
                    <option key={section.value} value={section.value}>
                      {section.label}
                    </option>
                  ))}
                </select>
                {errors.farm_section && <span className="error-message">{errors.farm_section}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="payment_method">Payment Method</label>
                <select
                  id="payment_method"
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleChange}
                  disabled={loading}
                >
                  {paymentMethods.map(method => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group full-width">
                <label htmlFor="description">Description *</label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={errors.description ? 'error' : ''}
                  placeholder="Enter expense description"
                  required
                  disabled={loading}
                />
                {errors.description && <span className="error-message">{errors.description}</span>}
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
                  step="0.01"
                  required
                  disabled={loading}
                />
                {errors.amount && <span className="error-message">{errors.amount}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="receipt_no">Receipt/Invoice No.</label>
                <input
                  type="text"
                  id="receipt_no"
                  name="receipt_no"
                  value={formData.receipt_no}
                  onChange={handleChange}
                  placeholder="Optional"
                  disabled={loading}
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
              {loading ? 'Saving...' : expense ? 'Update Expense' : 'Save Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;