import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const ExpenseModal = ({ isOpen, onClose, onSave, expense }) => {
  const [formData, setFormData] = useState({
    date: '',
    category: 'feed',
    description: '',
    amount: '',
    farmSection: 'fish',
    paymentMethod: 'cash',
    receiptNo: '',
    notes: '',
  });

  useEffect(() => {
    if (expense) {
      setFormData({
        date: expense.date || new Date().toISOString().split('T')[0],
        category: expense.category || 'feed',
        description: expense.description || '',
        amount: expense.amount || '',
        farmSection: expense.farmSection || 'fish',
        paymentMethod: expense.paymentMethod || 'cash',
        receiptNo: expense.receiptNo || '',
        notes: expense.notes || '',
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        category: 'feed',
        description: '',
        amount: '',
        farmSection: 'fish',
        paymentMethod: 'cash',
        receiptNo: '',
        notes: '',
      });
    }
  }, [expense]);

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
    { value: 'feed', label: 'Feed' },
    { value: 'medication', label: 'Medication' },
    { value: 'labor', label: 'Labor' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'transport', label: 'Transport' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'veterinary', label: 'Veterinary Services' },
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
          <button className="modal-close" onClick={onClose}>
            <FiX />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="date">Date *</label>
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
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="farmSection">Farm Section *</label>
                <select
                  id="farmSection"
                  name="farmSection"
                  value={formData.farmSection}
                  onChange={handleChange}
                  required
                >
                  {farmSections.map(section => (
                    <option key={section.value} value={section.value}>
                      {section.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="paymentMethod">Payment Method</label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
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
                  placeholder="Enter expense description"
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
                  step="100"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="receiptNo">Receipt/Invoice No.</label>
                <input
                  type="text"
                  id="receiptNo"
                  name="receiptNo"
                  value={formData.receiptNo}
                  onChange={handleChange}
                  placeholder="Optional"
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
              {expense ? 'Update Expense' : 'Save Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;